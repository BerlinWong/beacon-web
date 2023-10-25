import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath(menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '业务板块',
    icon: 'handshake-o',
    children: [
      { path: '/line-page', title: '图形分析', icon: 'area-chart' },
      { path: '/page2', title: 'AI辅助选股', icon: 'bar-chart-o' },
      { path: '/page3', title: '舆情监控', icon: 'newspaper-o' }
    ]
  },
  {
    title: '数据板块',
    icon: 'database',
    children: [
      { path: '/line-page', title: '数据同步日志', icon: 'clock-o' },
      { path: '/page2', title: '数据存储中心', icon: 'save' },
      { path: '/page3', title: '数据获取列表', icon: 'list' }
    ]
  },
  {
    title: '技术板块',
    icon: 'code',
    children: [
      { path: '/line-page', title: '机器学习', icon: 'cogs' },
      { path: '/page2', title: '数据挖掘', icon: 'globe' },
      { path: '/page3', title: '高频量化', icon: 'bolt' }
    ]
  }
])

export const menuAside = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '业务板块',
    icon: 'handshake-o',
    children: [
      { path: '/line-page', title: '图形分析', icon: 'area-chart' },
      { path: '/page2', title: 'AI辅助选股', icon: 'bar-chart-o' },
      { path: '/page3', title: '舆情监控', icon: 'newspaper-o' }
    ]
  },
  {
    title: '数据板块',
    icon: 'database',
    children: [
      { path: '/line-page', title: '数据同步日志', icon: 'clock-o' },
      { path: '/page2', title: '数据存储中心', icon: 'save' },
      { path: '/page3', title: '数据获取列表', icon: 'list' }
    ]
  },
  {
    title: '技术板块',
    icon: 'code',
    children: [
      { path: '/line-page', title: '机器学习', icon: 'cogs' },
      { path: '/page2', title: '数据挖掘', icon: 'globe' },
      { path: '/page3', title: '高频量化', icon: 'bolt' }
    ]
  }
])
