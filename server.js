'use strict'
process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'
const fs = require('fs')
const path = require('path')
const logger = require('koa-logger')

const resolve = file => path.resolve(__dirname, file)
const koa = require('koa')
const Router = new require('koa-router')();
const serverStatic = require('koa-static')
const serialize = require('serialize-javascript')
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer

const app = new koa()
app.use(logger())
var number = 0;

const html = (() => {
  const template = fs.readFileSync(resolve('./index.html'), 'utf-8')
  const i = template.indexOf('{{ APP }}')
  // styles are injected dynamically via vue-style-loader in development
  const style = isProd ? '<link rel="stylesheet" href="/dist/styles.css">' : ''
  return {
    head: template.slice(0, i).replace('{{ STYLE }}', style),
    tail: template.slice(i + '{{ APP }}'.length)
  }
})()
// setup the server renderer, depending on dev/prod environment
let renderer;
if (isProd) {
  // create server renderer from real fs
  const bundlePath = resolve('./dist/server-bundle.js')
  renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else {
  require('./build/setup-dev-server')(app, bundle => {
    renderer = createRenderer(bundle)
  })
}

console.log('1')
function createRenderer (bundle) {
  return createBundleRenderer(bundle, {
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

app.use(serverStatic('./dist'));

console.log('232232')

Router.get('/*', function* () {
  console.profile('性能分析器');
  console.log('本次进入刷新次数：', ++number);
  const res = this.res;
  const req = this.req 

  if (!renderer) {
    return res.end('waiting for compilation...')
  }
  console.time('whole request:')
  //var s = Date.now()
  const context = { url: req.url }
  const renderStream = renderer.renderToStream(context)
  let firstChunk = true

  res.write(html.head)

  renderStream.on('data', chunk => {
    if (firstChunk) {
      // embed initial store state

      if (context.initialState) {
        res.write(
          `<script>window.__INITIAL_STATE__=${
            serialize(context.initialState, { isJSON: true })
          }</script>`
        )
      }
      firstChunk = false
    }
    res.write(chunk)
  })

  renderStream.on('end', () => {
    res.end(html.tail)
    console.timeEnd('whole request:')
   // console.log(`whole request: ${Date.now() - s}ms`)
  })

  renderStream.on('error', err => {
    throw err
  })
  console.profileEnd()
});
// Router.get('/xx', (ctx, next) => {
//   console.log('num', ++ number)
//   console.log('xx')
// });


app
  .use(Router.routes())
  .use(Router.allowedMethods());



const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
