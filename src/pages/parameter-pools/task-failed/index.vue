<template @scoped>
  <d2-container>
    <template slot="header">
      <template>
        <div class="header-box">
          <div class="header-box-title">训练失败</div>
          <div class="header-box-count">
            <template>
              <div><span>{{ refreshLeftCount }}</span><span> 秒后刷新</span></div>
            </template>
          </div>
        </div>
      </template>
    </template>
    <div>
      <template>
        <el-table :data="tableData" border style="width: 100%;margin-bottom: 50px;" :stripe=true>
          <!-- <el-table-column prop="queue_id" label="任务编号" width="300">
          </el-table-column> -->
          <el-table-column prop="queue_id" label="队列编号" width="120px" :formatter="formatQueueId" align="center">
          </el-table-column>
          <el-table-column prop="creator" label="创建人" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="80px" align="center" :formatter="priorityFormatter">
          </el-table-column>
          <el-table-column width="80px" label="当前状态" align="center">
            <template v-slot="scope">
              <div v-html="statusFormatter(scope.row)"></div>
            </template>
          </el-table-column>
          <el-table-column width="580px" label="执行命令" :formatter="customFormatter" :show-overflow-tooltip="true"
            tooltip-effect="dark">
          </el-table-column>
          <!-- <el-table-column prop="pre_command" label="前置脚本" width="200px">
          </el-table-column>
          <el-table-column prop="exec_file" label="文件路径" width="300px">
          </el-table-column>
          <el-table-column prop="params_col" label="参数字段" width="300px">
          </el-table-column> -->
          <el-table-column prop="create_time" label="创建日期" width="120px" align="center">
          </el-table-column>
          <el-table-column prop="start_time" label="任务开始时间" width="120px" align="center" :formatter="formatColumnNull">
          </el-table-column>
          <el-table-column prop="end_time" label="任务结束时间" width="120px" align="center" :formatter="formatColumnNull">
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button @click="handleClickDetails(scope.row)" type="text" size="small">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

    </div>
    <template slot="footer">
      <template>
        <div class="paginationClass">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryData.page_number" :page-sizes="[10, 20, 25, 300]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </template>

    </template>
  </d2-container>
</template>
<style scoped>
.custom-cell {
  width: 120px;
}

.paginationClass {
  /* position: fixed; */
  /* bottom: 60px;
  height: 40px; */
  width: calc(100% - 200px);
  text-align: center;
}

.header-box {
  display: flex;
  /* justify-content: space-around; */
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.header-box-count {
  font-size: 12px;
  margin: 5px;

}
</style>
<script>
export default {
  data() {
    return {
      tableData: [],
      queryData: {
        page_number: 0,
        page_size: 10
      },
      total: 0,
      response_info: {},
      refreshLeftCount: 0,
      refreshSpeed: 60,
      doCount: '',
      doRefresh: ''
    }
  },
  methods: {
    handleClickDetails(row) {
      if (row.response_info) {
        this.response_info = JSON.parse(row.response_info)
        if (Object.prototype.hasOwnProperty.call(this.response_info, 'errMsg')) {
          this.$alert(this.response_info.errMsg, '错误信息', {
            confirmButtonText: '确定'
          })
        } else {
          this.$alert('预料之外的错误', '错误信息', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${action}`
              })
            }
          })
        }
      }
      this.getTaskList()
    },
    statusFormatter(row) {
      const statusMapping = {
        0: '等待运行',
        1: '正在运行',
        2: '运行结束',
        3: ' 运行出错',
        '': '等待运行',
        null: '等待运行'
      }
      const status = statusMapping[row.msg_id] || '未知'
      return `<div style="${this.getStatusClass(row.msg_id)}"><span style="font-size: 1.625rem;vertical-align: middle;">&#8226; </span>${status}</div>`
      // return status
    },
    getStatusClass(msgId) {
      // 根据 msg_id 返回相应的 CSS 类名
      switch (msgId) {
        case '0':
          return 'color: #ffb900'
        case '1':
          return 'color: #00a4ef'
        case '2':
          return 'color: #91B5A9'
        case '3':
          return 'color: #D98481'
        default:
          return 'unknown-class'
      }
    },
    // 优先级
    priorityFormatter(row) {
      switch (row.priority) {
        case 0:
          return '置顶'
        case 1:
          return '默认'
        case 2:
          return '延迟'
        default:
          return '未知'// 可以根据实际情况返回默认值
      }
    },
    customFormatter(row) {
      // 根据空格切割并只显示前10个字符
      const value = row.pre_command + ' ' + row.exec_file + ' ' + row.params_col
      // const value = "row.pre_command + ' ' + row.exec_file + ' ' + row.params_col"
      return value
    },
    handleClick(row) {
      console.log(row)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.queryData.page_number = val - 1
      this.getUnfinishTaskList()
    },
    handleSizeChange(val) {
      console.log(val)
      this.queryData.page_size = val
      this.getUnfinishTaskList()
    },
    formatQueueId(row) {
      // 在这里将 queue_id 格式化为后八位
      if (row.queue_id) {
        // return row.queue_id.slice(-8)
        return row.queue_id.slice(0, 10)
      }
      return ''
    },
    formatCombinedFields(row) {
      // 将多个字段的值连接为一个单元格，用空格分隔
      const combinedValue = [row.pre_command, row.exec_file, row.params_col].join(' ')
      const slicedValue = combinedValue ? combinedValue.split(' ').slice(0, 18).join(' ') : ''
      return slicedValue
      // return combinedValue
    },
    formatColumnNull(row, column, cellValue) {
      return cellValue || '暂未更新'
    },
    getTaskList() {
      this.$store.dispatch('customer/parampro/getFailedTasks', this.queryData)
        .then(response => {
          // 在这里处理异步操作成功后的响应
          console.log('Response data:', response.data)
          if (response.code === 200) {
            this.tableData = response.data[0]
            // let i = 0
            // for (i = 0; i < 10; i++) {
            //   console.log(i)
            // }
            this.total = response.data[1].total
          }
        })
        .catch(error => {
          // 在这里处理异步操作失败时的错误
          console.error('Error:', error)
        })
      this.refreshLeftCount = this.refreshSpeed
    },
    refreshPage() {
      this.doRefresh = setInterval(() => {
        this.getTaskList()
        if (this.destory === true) {
          return 0
        }
      }, this.refreshSpeed * 1000)
      this.doCount = setInterval(() => {
        this.refreshLeftCount--
      }, 1000)
    }
  },
  mounted() {
    this.getTaskList(this.queryData)
    this.refreshPage()
  },
  beforeDestroy() {
    console.log('beforeDestroy')
    clearInterval(this.doRefresh)
    clearInterval(this.doCount)
  }
}
</script>
