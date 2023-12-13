import axios from 'axios'
export default {
  namespaced: true,
  state: {
    // 用户信息
    info: null,
    stockList: []
  },
  mutations: {
    setInfo(state, data) {
      state.info = data
    },
    stockList(state, data) {
      state.stockList = data
    }
  },
  actions: {
    // 封装一个 ajax 方法
    async setPost(context, payload) {
      // 发起异步请求
      const response = await axios.post('/get_k_line_dataset_normal', payload)
      // 提交 mutation 来更新 state
      context.commit('setInfo', response.data)
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
