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
  { path: '/index', title: '首页', iconSvg: 'shouye' },
  {
    title: '参数池',
    iconSvg: 'ml',
    children: [
      // Assembly workshop
      { path: '/task-assembly', title: '拼装车间', iconSvg: 'task-assembly' },
      { path: '/task-queue', title: '任务队列', iconSvg: 'task-queue' },
      { path: '/task-done', title: '训练完成', iconSvg: 'task-done' },
      { path: '/task-failed', title: '训练异常', iconSvg: 'task-failed' }
    ]
  }
])

export const menuAside = supplementPath([
  { path: '/index', title: '首页', iconSvg: 'shouye' },
  {
    title: '参数池',
    iconSvg: 'ml',
    children: [
      { path: '/task-assembly', title: '拼装车间', iconSvg: 'task-assembly' },
      { path: '/task-queue', title: '任务队列', iconSvg: 'task-queue' },
      { path: '/task-done', title: '训练完成', iconSvg: 'task-done' },
      { path: '/task-failed', title: '训练异常', iconSvg: 'task-failed' }
    ]
  }
])
