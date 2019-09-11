const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const { query, transactionQuery } = require('./tools/async-mysql')
const Valid = require('./tools/validation')
const Response = require('./tools/response')
const app = new Koa()
const r = new Response()

// 静态资源服务器
app.use(static(__dirname + '/static'))

// 处理POST请求的JSON格式
app.use(bodyParser())

// koa-session
app.keys = ['eidea']
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false
}
app.use(session(CONFIG, app))

// 关闭跨域与OPTIONS请求
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

router.get('/getTest', async ctx => {
  ctx.body = ctx.query
})
router.post('/postTest', async ctx => {
  ctx.body = ctx.request.body
})

router.get('/getCarouselList', async ctx => {
  const sql = `select * from carousel`
  const result = await query(sql)
  ctx.body = r.successData(result)
})

router.get('/getHomeGoods', async ctx => {
  const manSql = `select * from goods where sex=1 limit 0,4`
  const ladySql = `select * from goods where sex=2 limit 0,4`
  const manItems = await query(manSql)
  const ladyItems = await query(ladySql)
  ctx.body = r.successData({
    manItems,
    ladyItems
  })
})

router.get('/query', async ctx => {
  const {
    sex,
    classify,
    page = 1,
    pageSize = 12,
    minPrice = 0,
    maxPrice = 99999,
    order = 'default',
    word
  } = ctx.query
  let itemSql = ''
  let countSql = ''
  if (!Valid(sex).in(['1', '2'])) {
    if (!Valid(classify).in(['1', '2', '3'])) {
      itemSql = `select * from goods where (goodsprice between ${minPrice} and ${maxPrice}) `
      countSql = `select count(*) as total from goods where (goodsprice between ${minPrice} and ${maxPrice}) `
    } else {
      itemSql = `select * from goods where (goodsprice between ${minPrice} and ${maxPrice}) and classify = ${classify} `
      countSql = `select count(*) as total from goods where (goodsprice between ${minPrice} and ${maxPrice}) and classify = ${classify} `
    }
  } else {
    if (!Valid(classify).in(['1', '2', '3'])) {
      itemSql = `select * from goods where (goodsprice between ${minPrice} and ${maxPrice}) and sex = ${sex} `
      countSql = `select count(*) as total from goods where (goodsprice between ${minPrice} and ${maxPrice}) and sex = ${sex} `
    } else {
      itemSql = `select * from goods where (goodsprice between ${minPrice} and ${maxPrice}) and sex = ${sex} and classify = ${classify} `
      countSql = `select count(*) as total from goods where (goodsprice between ${minPrice} and ${maxPrice}) and sex = ${sex} and classify = ${classify} `
    }
  }
  if (word) {
    itemSql += ` and (goodsname like '%${word}%' or goodsdetail like '%${word}%') `
    countSql += ` and (goodsname like '%${word}%' or goodsdetail like '%${word}%') `
  }
  if (order == 'low') {
    itemSql += ` order by goodsprice `
  } else if (order == 'high') {
    itemSql += ` order by goodsprice desc `
  }
  itemSql += ` limit ${(page - 1) * pageSize},${pageSize};`
  const items = await query(itemSql)
  const total = await query(countSql)
  ctx.body = r.successPage(items, page, pageSize, total[0].total)
})

router.get('/detail', async ctx => {
  const id = ctx.query.id
  if (!id) {
    ctx.body = r.parameterError()
  } else {
    const sql = `select * from goods where goodsid = ?`
    const detail = await query(sql, id)
    if (detail.length > 0) {
      ctx.body = r.successData(detail[0])
    } else {
      ctx.body = r.error(302, '没有数据')
    }
  }
})

router.get('/recommend', async ctx => {
  const id = ctx.query.id
  if (!id) {
    ctx.body = r.parameterError()
  } else {
    const sql = `select * from goods where goodsid = ?`
    const info = await query(sql, id)
    ctx.body = info
    if (info.length > 0) {
      const sex = info[0].sex
      const classify = info[0].classify
      const recommendSql = `select * from goods where sex = ? and classify = ? and goodsid <> ?`
      let recommendList = await query(recommendSql, [sex, classify, id])
      if (recommendList.length > 4) {
        recommendList.sort(() => Math.random() - 0.5)
        recommendList = recommendList.slice(0, 4)
      }
      ctx.body = r.successData(recommendList)
    } else {
      ctx.body = r.error(302, '没有数据')
    }
  }
})

router.post('/register', async ctx => {
  const { username, email, password } = ctx.request.body
  const checkSql = `select * from usertable where e_username = ?`
  const check = await query(checkSql, username)
  if (check.length > 0) {
    ctx.body = r.error(303, '用户名已存在')
  } else {
    const insertSql = `insert into usertable (e_username, e_password, e_email) values (?, ?, ?)`
    const insert = await query(insertSql, [username, password, email])
    if (insert) {
      ctx.body = r.success()
    } else {
      ctx.body = r.error()
    }
  }
})

router.post('/login', async ctx => {
  const { username, password } = ctx.request.body
  const checkSql = `select * from usertable where e_username = ? and e_password = ?`
  const check = await query(checkSql, [username, password])
  if (check.length > 0) {
    ctx.session.username = username
    ctx.body = r.success()
  } else {
    ctx.body = r.error(301, '账号密码错误')
  }
})

router.get('/checkLogin', async ctx => {
  ctx.body = r.successData(ctx.session.username || '')
})

router.get('/logout', async ctx => {
  ctx.session.username = ''
  ctx.body = r.success()
})

router.get('/getCartGoodsList', async ctx => {
  const username = ctx.session.username
  if (username) {
    const sql =
      'select * from shoppingcart,goods where shoppingcart.goodsid=goods.goodsid and username = ?'
    const result = await query(sql, username)
    ctx.body = r.successData(result)
  } else {
    ctx.body = r.loginError()
  }
})

router.post('/setCartGoods', async ctx => {
  const { goodsid, quantity } = ctx.request.body
  const username = ctx.session.username
  if (!username) {
    ctx.body = r.loginError()
  } else if (!goodsid || !quantity) {
    ctx.body = r.parameterError()
  } else {
    const sql =
      'update shoppingcart set quantity= ? where username = ? and goodsid = ?'
    const result = await query(sql, [quantity, username, goodsid])
    if (result) {
      ctx.body = r.success()
    } else {
      ctx.body = r.error()
    }
  }
})

router.post('/removeCartGoods', async ctx => {
  const { goodsid } = ctx.request.body
  const username = ctx.session.username
  if (!username) {
    ctx.body = r.loginError()
  } else if (!goodsid) {
    ctx.body = r.parameterError()
  } else {
    const sql = 'delete from shoppingcart where username = ? and goodsid = ?'
    const result = await query(sql, [username, goodsid])
    if (result) {
      ctx.body = r.success()
    } else {
      ctx.body = r.error()
    }
  }
})

router.post('/addToCart', async ctx => {
  const { goodsid } = ctx.request.body
  const username = ctx.session.username
  if (!username) {
    ctx.body = r.loginError()
  } else if (!goodsid) {
    ctx.body = r.parameterError()
  } else {
    const checkSql =
      'select * from shoppingcart where username = ? and goodsid = ?'
    const checkResult = await query(checkSql, [username, goodsid])
    if (checkResult.length > 0) {
      ctx.body = r.error(303, '商品已存在购物车中')
    } else {
      const sql =
        'insert into shoppingcart(username,goodsid,quantity) values( ? , ? , 1)'
      const result = await query(sql, [username, goodsid])
      if (result) {
        ctx.body = r.success()
      } else {
        ctx.body = r.error()
      }
    }
  }
})

app.use(router.routes())

app.listen(3001)
