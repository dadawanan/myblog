const {
  mdConf,
  themeConf,
  localesConf
} = require('./config/')
console.log(process.env.clientSecret)
module.exports = {
  locales: localesConf,
  markdown: mdConf,
  themeConfig: themeConf,
  base: '/blog/',
  plugins: [
    require('./plugins/my-router'),
    require('./plugins/my-loader'),
    require('vuepress-plugin-viewer'),
    '@vuepress/back-to-top',
    [
      '@vuepress/google-analytics', { 'ga': 'UA-124601890-1' }
    ],
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: {
          message: "发现页面有新内容",
          buttonText: "刷新"
        }
      }
    ],
    [
      'vuepress-plugin-comment',
      {
        choosen: 'gitalk',
        options: {
          clientID: '2d47e91a3f4db035686a',
          clientSecret: process.env.clientSecret || 'e40d4242897a706232d0666b2efe701b21ba2f10',
          repo: 'myblog',
          owner: 'dadawanan',
          admin: ['dadawanan'],
          id: '<%- frontmatter.commentid || frontmatter.permalink %>',      // Ensure uniqueness and length less than 50
          distractionFreeMode: false,  // Facebook-like distraction free mode
          labels: ['Gitalk', 'Comment'],
          title: '「评论」<%- frontmatter.title %>',
          body: '<%- frontmatter.title %>：<%- window.location.origin %><%- frontmatter.to.path || window.location.pathname %>'
        }
      }
    ]
  ]
}
