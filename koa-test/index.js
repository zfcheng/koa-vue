'use strict'
const logger = require('koa-logger')
const debug = require('debug')('koa-vue')



const koa = require('koa')
const app = new koa()
app.use(logger())


app.use(function * (next) {
  console.log('!!!!!!!!!')
  const a = yield new Promise(function (resolve, reject) {
    resolve('1')
  })
  const b = yield new Promise(function (resolve, reject) {
    resolve('11')
  })
  yield next
  console.log(a)
})
app.use(function * (next) {
  console.log('@@@@@@@@@')
  debug('koa-vue debug')
  yield next
  console.log('2')
})


app.use(function * (next) {
  console.log('#########')
  console.log('3')
  this.body = 'xxx'
})


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
