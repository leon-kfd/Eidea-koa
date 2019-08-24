const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const { query, transactionQuery } = require('./tools/async-mysql')
const Valid = require('./tools/validation')
const Response = require('./tools/response')
const app = new Koa()
const r = new Response()

app.use(static(__dirname + '/static'))
app.use(bodyParser())

router.get('/getTest', async ctx => {
  ctx.body = ctx.query
})
router.post('/postTest', async ctx => {
  ctx.body = ctx.request.body
})

router.get('/getCarouselList', async ctx => {
  const sql = `select * from carousel`
  let result = await query(sql)
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
    minPrice = 0,
    maxPrice = 99999,
    order = 'default',
    word
  } = ctx.query
  let itemSql = ''
  let countSql = ''
  if (Valid(sex).in(['1', '2'])) {
    if (!Valid(classify).in(['1', '2', '3'])) {
      itemSql = `select * from goods where goodsprice between ${minPrice} and ${maxPrice} `
      countSql = `select count(*) as sum from goods goodsprice between ${minPrice} and ${maxPrice} `
    } else {
      itemSqL = `select * from goods where goodsprice between ${minPrice} and ${maxPrice} and classify = ${classify} `
      countSql = `select count(*) as sum from goods where goodsprice between ${minPrice} and ${maxPrice} and classify = ${classify} `
    }
  } else {
    if (!Valid(classify).in(['1', '2', '3'])) {
      itemSql = `select * from goods where goodsprice between ${minPrice} and ${maxPrice} and sex = ${sex} `
      countSql = `select count(*) as sum from goods where goodsprice between ${minPrice} and ${maxPrice} and sex = ${sex} `
    } else {
      itemSqL = `select * from goods where goodsprice between ${minPrice} and ${maxPrice} and sex = ${sex} and classify = ${classify} `
      countSql = `select count(*) as sum from goods where goodsprice between ${minPrice} and ${maxPrice} and sex = ${sex} and classify = ${classify} `
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
  itemSql += ` limit ${page},12`
})

app.use(router.routes())

app.listen(3001)
