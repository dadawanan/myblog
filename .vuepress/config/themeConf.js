const sidebar = require('./sidebar')

module.exports = {
  repo: 'dadawanan/myblog',
  navbar: true, 
  editLinks: true,
  editLinkText: '在 GitHub 上编辑此页',
  lastUpdated: '更新于',
  sidebar,
  nav: [
    { 
      text: '前端',
      items: [
        {
          text: '基础',
          items: [
            { text: 'JavaScript', link: '/passages/2019-08-18-javascript-top/' },
            { text: 'ES6', link: '/passages/2019-04-09-es6/' },
          ]
        },
        {
          text: 'Webpack4',
          items: [
            { text: 'Webpack4', link: '/passages/2018-07-29-webpack-demos-introduction/' },
          ]
        },
      ]
    },
  ]
}
