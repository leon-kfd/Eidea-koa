const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const { query, transactionQuery } = require('./tools/async-mysql')
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
  maxAge: 2 * 3600 * 1000,
  httpOnly: true,
  renew: true
}
app.use(session(CONFIG, app))

// 关闭跨域与OPTIONS请求
// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', '*')
//   ctx.set(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
//   )
//   ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
//   if (ctx.method == 'OPTIONS') {
//     ctx.body = 200
//   } else {
//     await next()
//   }
// })

// 获取轮播图列表
router.get('/getCarouselList', async ctx => {
  const sql = `select * from carousel`
  const result = await query(sql)
  ctx.body = r.successData(result)
})

// 获取首页商品
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

// 搜索商品
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
  let sql = `select * from goods where goodsprice between ? and ? `
  let paramsArr = [minPrice, maxPrice]
  if (sex) {
    sql += `and sex = ? `
    paramsArr.push(sex)
  }
  if (classify) {
    sql += `and classify = ? `
    paramsArr.push(classify)
  }
  if (word) {
    sql += `and goodsname like ? or goodsdetail like ? `
    paramsArr.push(`%${word}%`, `%${word}%`)
  }
  const totalSql = `select count(*) as total from (${sql}) as temp `
  const totalResult = await query(totalSql, paramsArr)
  if (!totalResult) { ctx.body = r.error(); return }
  if (order) {
    if (order === 'low') {
      sql += `order by goodsprice `
    } else if (order === 'high') {
      sql += `order by goodsprice desc `
    }
  }
  sql += `limit ?, ? `
  paramsArr.push((page - 1) * pageSize, pageSize)
  const result = await query(sql, paramsArr)
  if (!result) { ctx.body = r.error; return }
  ctx.body = r.successPage(result, page, pageSize, totalResult[0].total)
})

// 获取商品详情
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

// 获取猜你喜欢
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

// 注册
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

// 登录
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

// 检查登录状态
router.get('/checkLogin', async ctx => {
  ctx.body = r.successData(ctx.session.username || '')
})

// 注销
router.get('/logout', async ctx => {
  ctx.session.username = ''
  ctx.body = r.success()
})

// 获取购物车列表
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

// 更改购物车商品数量
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

// 移出购物车商品
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

// 添加到购物车
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

// 获取订单列表
router.get('/getSettlementGoodsList', async ctx => {
  const username = ctx.session.username
  if (!username) {
    ctx.body = r.loginError()
  } else {
    const sql = `select * from shoppingcart,goods where shoppingcart.goodsid=goods.goodsid and username = ?`
    const result = await query(sql, username)
    if (result) {
      ctx.body = r.successData(result)
    } else {
      ctx.body = r.error()
    }
  }
})

// 设置关注/收藏
router.post('/updateCollection', async ctx => {
  const { goodsid } = ctx.request.body
  const username = ctx.session.username
  if (!username) {
    ctx.body = r.loginError()
  } else if (!goodsid) {
    ctx.body = r.parameterError()
  } else {
    const checkSql =
      'select * from collection where username = ? and goodsid = ?'
    const checkResult = await query(checkSql, [username, goodsid])
    if (checkResult.length > 0) {
      const deleteSql = `delete from collection where username = ? and goodsid = ?`
      const deleteResult = await query(deleteSql, [username, goodsid])
      if (deleteResult) {
        ctx.body = r.success()
      } else {
        ctx.body = r.error()
      }
    } else {
      const insertSql = `insert into collection(username, goodsid) values (?, ?)`
      const insertResult = await query(insertSql, [username, goodsid])
      if (insertResult) {
        ctx.body = r.success()
      } else {
        ctx.body = r.error()
      }
    }
  }
})

// 获取商品是否被收藏
router.get('/getCollection', async ctx => {
  const username = ctx.session.username
  const { id: goodsid } = ctx.query
  if (!username) {
    ctx.body = r.loginError()
  } else if (!goodsid) {
    ctx.body = r.parameterError()
  } else {
    const sql = `select * from collection where username = ? and goodsid = ?`
    const result = await query(sql, [username, goodsid])
    if (result.length > 0) {
      ctx.body = r.successData(1)
    } else {
      ctx.body = r.successData(0)
    }
  }
})

// 获取收藏商品列表
router.get('/getCollectionList', async ctx => {
  const username = ctx.session.username
  if (!username) {
    ctx.body = r.loginError()
  } else {
    const sql = `select * from collection where username = ?`
    const result = await query(sql, username)
    if (result) {
      ctx.body = r.successData(result)
    } else {
      ctx.body = r.error()
    }
  }
})

// 获取保存地址列表
router.get('/getAddressList', async ctx => {
  const username = ctx.session.username
  if (!username) {
    ctx.body = r.loginError()
  } else {
    const sql = `select * from address where username = ?`
    const result = await query(sql, username)
    if (result) {
      ctx.body = r.successData(result)
    } else {
      ctx.body = r.error()
    }
  }
})

// 修改地址
router.post('/updateAddress', async ctx => {
  const username = ctx.session.username
  const {
    id,
    addressee,
    addresseeTel,
    province,
    city,
    area,
    addressDetail
  } = ctx.request.body
  const updateSql = `update address set addressee = ? ,addressee_tel = ? , province = ?, city = ?, area = ?, add_detail = ? where id = ? and username = ?`
  const updateResult = await query(updateSql, [
    addressee,
    addresseeTel,
    province,
    city,
    area,
    addressDetail,
    id,
    username
  ])
  if (updateResult) {
    ctx.body = r.success()
  } else {
    ctx.body = r.error()
  }
})

// 删除地址
router.get('/deleteAddress', async ctx => {
  const username = ctx.session.username
  const { id } = ctx.query
  const deleteSql = `delete from address where id = ? and username = ?`
  const deleteResult = await query(deleteSql, [id, username])
  if (deleteResult) {
    ctx.body = r.success()
  } else {
    ctx.body = r.error()
  }
})

app.use(router.routes())

app.listen(3001)
