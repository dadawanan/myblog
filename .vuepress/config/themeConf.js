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
            { text: 'JavaScript', link: '/passages/javascript(1)/' },
            { text: 'ES6', link: '/passages/es6(1)/' },
            { text: 'HTML和CSS', link: '/passages/html5(1)/' }
          ]
        },
        {
          text: 'TypeScript',
          items: [
            { text: 'TypeScript', link: '/passages/ts(2)/' },
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
    {
      text: '计算机基础',
      items: [
        { text: '编译原理', link: '' },
        { text: '网络协议', link: '' },
        { text: '设计模式', link: '' }
      ]
    },
    {
      text: '数据结构和算法',
      items: [
        { text: 'JavaScript编码能力', link: '' },
        { text: '手动实现前端轮子', link: '' },
        { text: '数据结构', link: '' },
        { text: '算法', link: '' },
      ]
    },
    {
      text: '运行环境',
      items: [
        { text: '浏览器API', link: '' },
        { text: '浏览器原理', link: '' },
        { text: 'Node', link: '' },
      ]
    },
    {
      text: '框架和类库',
      items: [
        { text: 'TypeScript', link: '' },
        { text: 'React', link: '' },
        { text: 'Vue', link: '' },
        { text: '多端开发', link: '' },
        { text: '数据流管理', link: '' },
        { text: '实用库', link: '' },
        { text: '开发和调试', link: '' },
      ]
    },
    {
      text: '前端工程',
      items: [
        { text: '项目构建', link: '' },
        { text: 'nginx', link: '' },
        { text: 'webpakc指南', link: '' },
        { text: '开发提速', link: '' },
        { text: '版本控制', link: '' },
        { text: '持续集成', link: '' },
      ]
    },
    {
      text: '项目和业务',
      items: [
        { text: '后端技能', link: '' },
        { text: '性能优化', link: '' },
        { text: '前端安全', link: '' },
        { text: '业务相关', link: '' },
      ]
    },
    {
      text: '踩过的坑',
      items: [
        { text: 'ReactNative', link: '' }
      ]
    }
  ]
}
