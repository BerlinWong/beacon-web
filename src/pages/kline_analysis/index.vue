<template>
  <d2-container>
    <template slot="header">K线分析平台</template>
    <template>
      <div class="head-title-main-info">
        <div>当前展示：{{ info.stockName ? info.stockID : queryData.stock }}</div>
        <div>名称：{{ info.stockName }}</div>
        <div>当前时间：{{ info.nowDate }}</div>
      </div>
      <div class="time-select-box">
        <div class="block">
          <div class="time-selecter-title">选择时间</div>
          <el-date-picker v-model="selectDate" type="daterange" align="right" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" @change="selectTimefunc" :picker-options="pickerOptions">
          </el-date-picker>
          只展示值 <el-switch v-model="only_show_price" active-color="#314656" inactive-color="#c23531">
          </el-switch>
        </div>
      </div>
    </template>
    <div style="display: flex;align-items: center;justify-content: center;margin-left: 7.5%;" ref='ref-candle'>
      <ve-candle :data="chartData" :settings="chartSettings" :legend-visible="true" :tooltip-visible='true' height="50vh"
        width="85%" :resizeable="true" :extend="chartExtend" v-if="!only_show_price"></ve-candle>
      <ve-line :data="chartDataLine" :settings="chartSettingsLine" height="50vh" width="85%" v-if="only_show_price"
        :extend="veLineExtend"></ve-line>
    </div>
    <template slot="footer">
      <!-- <div style="width: 120px;margin: 10px 50px;">
        <div class="time-selecter-title">当前股票代码：</div><el-input v-model="stock" placeholder="请输入股票代码" maxlength="6"
          show-word-limit @change="changeStock"></el-input>
      </div> -->
      <!-- 远程搜索输入框 -->
      <template>
        <el-autocomplete popper-class="my-autocomplete" :popper-append-to-body="false" v-model="state"
          suffix-icon="el-icon-search" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"
          placement="top" :clearable="true" :select-when-unmatched=true>
          <i class="l-icon-search el-input__icon" slot="suffix" @click="handleIconClick">
          </i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.stock_name }}</div>
            <span class="addr">{{ item.splicing }}</span>
          </template>
        </el-autocomplete>
      </template>
    </template>
  </d2-container>
</template>
<style>
.time-select-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.time-selecter-title {
  color: #130f30;
  font-size: 12px;
  text-align: center;
  display: inline-block;
  margin-right: 15px;
  margin-left: 15px;

}

.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}

.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}

.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}

.my-autocomplete li .highlighted .addr {
  color: #ddd;
}
</style>
<script>
import VeCandle from 'v-charts/lib/candle.common.js'
import VeLine from 'v-charts/lib/line.common.js'

export default {
  data() {
    return {
      veLineExtend: {
        yAxis: {
          splitArea: {
            show: true
          }
        },
        dataZoom(d) {
          console.log('d', d)
        },
        series(v) {
          // smooth: true
          console.log('v', v)
          // v.color = '#5470c6'
          // 设置柱子的样式
          v.forEach((i) => {
            i.smooth = false
            i.name = '价格'
            i.color = '#d9b766'
          })
          return v
        }
      },
      chartData: {
        columns: ['date', 'open', 'close', 'low', 'high', 'volume'],
        rows: [],
        upColor: '#ec0000',
        upBorderColor: '#8A0000',
        downColor: '#00da3c',
        downBorderColor: '#008F28',
        dataCount: 2e5
      },
      chartDataLine: {
        columns: ['date', 'close'],
        rows: [],
        upColor: '#ec0000',
        upBorderColor: '#8A0000',
        downColor: '#00da3c',
        downBorderColor: '#008F28',
        dataCount: 2e5
      },
      chartExtend: {
        yAxis: {
          splitArea: {
            show: true
          }
        },
        series(e) {
          console.log(e)
          e.forEach((i) => {
            console.log(i)
            if (i.name === 'Volume') {
              i.itemStyle.color = '#7a3e43'
            }
          })
          return e
        }
      },
      chartSettings: {
        itemStyle: {
          upColor: '#ec0000',
          upBorderColor: '#8A0000',
          downColor: '#00da3c',
          downBorderColor: '#008F28'
        },
        showDataZoom: true,
        start: 0,
        end: 100,
        showMA: true,
        MA: [5, 10, 20, 30],
        showVol: true
      },
      chartSettingsLine: {
        scale: [true, true],
        showDataZoom: true
      },
      info: {
        stockID: '',
        nowDate: '',
        stockName: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近七年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 7)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      selectDate: '',
      stock: '000001',
      queryData: {
        begin: '2023-01-01',
        end: this.give_now_date(),
        stock: '000001'
      },
      stock_list: [],
      state: '',
      customer_search_word: '',
      only_show_price: false
    }
  },
  methods: {
    handleSelect(item) {
      const queryData = this.queryData
      console.log(item)
      if (item) {
        this.state = item.stock_name
        console.log(this.state)
        queryData.stock = item.stock
      } else {
        console.log(this.customer_search_word)
        queryData.stock = this.customer_search_word
      }
      this.info.stockID = item.stock
      this.info.stockName = item.stock_name
      this.give_me_stcok_info(queryData)
    },
    handleIconClick(ev) {
      console.log(ev)
      this.state = ''
    },
    loadAll() {
      return []
    },
    // 下拉框远程请求
    querySearch(queryString, cb) {
      console.log(queryString)
      const stocks = this.stock_list
      this.customer_search_word = queryString
      var results = queryString ? stocks.filter(this.createFilter(queryString)) : stocks
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 下拉框远程请求 过滤器
    createFilter(queryString) {
      return (stocks) => {
        return (stocks.splicing.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 股票代码输入框变化时触发
    changeStock() {
      this.queryData.stock = this.stock
      this.give_me_stcok_info(this.queryData)
    },
    selectTimefunc(val) {
      const queryData = this.queryData
      queryData.begin = this.give_format_date(this.selectDate[0])
      queryData.end = this.give_format_date(this.selectDate[1])
      queryData.stock = this.stock
      this.give_me_stcok_info(queryData)
    },
    // 给我格式化后的yyyy-mm-dd 主要针对中国标准时间
    give_format_date(cst) {
      var date = new Date(cst)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    // 返回现在时间 yyyy-mm-dd
    give_now_date() {
      const date = new Date()
      const year = date.getFullYear() // 获取完整的年份(4位)
      let month = date.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      let strDate = date.getDate() // 获取当前日(1-31)
      if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
      if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
      return `${year}-${month}-${strDate}`
    },
    // 获取股票k线信息，并触发echarts数据刷新
    give_me_stcok_info(queryData) {
      this.$store.dispatch('customer/kline_analysis/setPost', queryData)
        .then(response => {
          // 在这里处理异步操作成功后的响应
          console.log('Response data:', response)
          this.chartData.rows = response.data
          this.chartDataLine.rows = response.data
        })
        .catch(error => {
          // 在这里处理异步操作失败时的错误
          console.error('Error:', error)
        })
    },
    query_select_list(type) {
      this.$store.dispatch('customer/kline_analysis/inputSearchQuery', { type })
        .then(response => {
          // 在这里处理异步操作成功后的响应
          console.log('Response data:', response)
          this.stock_list = response.data
        })
        .catch(error => {
          // 在这里处理异步操作失败时的错误
          console.error('Error:', error)
        })
    },
    give_now_time() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const dates = date.getDate()
      const hours = date.getHours()
      const minute = date.getMinutes()
      const seconds = date.getSeconds()
      return `${year}年${month}月${dates}日 ${hours}时${minute}分${seconds}秒`
    },
    update_now_time() {
      setInterval(() => {
        this.info.nowDate = this.give_now_time()
      }, 1000)
    }
  },

  watch: {
    'only_show_price'(v) {
      console.log(v)
      // this.give_me_stcok_info(this.queryData)
    },
    deep: true
  },
  created() {
    this.give_me_stcok_info(this.queryData)
    this.query_select_list('all')
  },
  mounted() {
    this.stock_list = this.loadAll()
    this.update_now_time()
  },
  components: {
    VeCandle,
    VeLine
  }
}
</script>
