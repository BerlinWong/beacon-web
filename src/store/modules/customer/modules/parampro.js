import axios from 'axios'
export default {
  namespaced: true,
  state: {
    // 用户信息
    taskList: null,
    stockList: []
  },
  mutations: {
    taskList(state, data) {
      state.taskList = data
    },
    stockList(state, data) {
      state.stockList = data
    }
  },
  actions: {
    // 封装一个 ajax 方法
    async getUnfinishTasks(context, payload) {
      // 发起异步请求
      // 查询所有未完成任务
      const response = await axios.post('/get_individual/unfinished', payload)
      // 提交 mutation 来更新 state
      context.commit('taskList', response.data)
      return response.data // 可以返回响应数据
    },
    async getDoneTasks(context, payload) {
      // 发起异步请求
      // 查询所有未完成任务
      const response = await axios.post('/get_individual/done', payload)
      // 提交 mutation 来更新 state
      context.commit('taskList', response.data)
      return response.data // 可以返回响应数据
    },
    // 等待后端接口
    async getFailedTasks(context, payload) {
      // 发起异步请求
      // 查询所有未完成任务
      const response = await axios.post('/get_individual/unfinished', payload)
      // 提交 mutation 来更新 state
      context.commit('taskList', response.data)
      return response.data // 可以返回响应数据
    },
    async inputSearchQuery(context, payload) {
      // 发起异步请求
      const response = await axios.post('/get_all_stock_by_szorsh_ws', payload)
      // 提交 mutation 来更新 state
      context.commit('stockList', response.data)
      return response.data // 可以返回响应数据
    }
  }
}
