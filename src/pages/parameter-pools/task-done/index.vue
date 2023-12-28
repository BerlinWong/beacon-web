<template>
  <d2-container>
    <template slot="header">训练完成</template>
    <div>
      <template>
        <el-table :data="tableData" border style="width: 100%;margin-bottom: 50px;" :stripe=true v-loading="loading">
          <!-- <el-table-column prop="queue_id" label="任务编号" width="300">
          </el-table-column> -->
          <el-table-column prop="queue_id" label="队列编号" width="120px" :formatter="formatQueueId" align="center">
          </el-table-column>
          <el-table-column prop="creator" label="创建人" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="80px" align="center" :formatter="priorityFormatter">
          </el-table-column>
          <el-table-column width="100px" label="当前状态" align="center">
            <template v-slot="scope">
              <div v-html="statusFormatter(scope.row)"></div>
            </template>
          </el-table-column>
          <el-table-column width="580px" label="执行命令" :formatter="customFormatter" :show-overflow-tooltip="true"
            tooltip-effect="dark">
          </el-table-column>
          <el-table-column prop="create_time" label="创建日期" width="150px" align="center">
          </el-table-column>
          <el-table-column prop="start_time" label="任务开始时间" width="150px" align="center" :formatter="formatColumnNull">
          </el-table-column>
          <el-table-column prop="end_time" label="任务结束时间" width="150px" align="center" :formatter="formatColumnNull">
          </el-table-column>
          <el-table-column prop="response_info" label="返回响应" width="400px">
            <template slot-scope="scope">
              <el-button @click="handleClickDetails(scope.row)" type="text" size="small">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template>
        <el-dialog title="DETAILS" :visible.sync="showResponeDialog">
          <template>
            <div class="box-container">
              <div class="box">
                <h2>Model Information</h2>
                <div class="box-content">
                  <div>
                    <strong>Model Name:</strong> {{ response_info.model_name }}
                  </div>
                  <div>
                    <strong>Whole ID:</strong><span class="important-high-light"> {{
                      queueIDFilter(response_info.uid) }}</span>
                  </div>
                  <div>
                    <strong>Start Time:</strong> {{ detail_start_time }}
                  </div>
                  <div>
                    <strong>End Time:</strong> {{ detail_end_time }}
                  </div>
                  <!-- 其他字段... -->
                </div>
              </div>

              <div class="box box-wide">
                <h2>Training Information</h2>
                <div class="box-content">
                  <div>
                    <strong>Train Epochs:</strong><span>{{ response_info.train_opochs }}</span>
                  </div>
                  <div>
                    <strong>Model Base Path:</strong><br /><span class="high-light">{{
                      response_info.model_path }}</span>
                  </div>
                  <div>
                    <strong>Best Model Save Path:</strong><br /><span class="high-light">{{
                      response_info.best_model_save_path }}</span>
                  </div>
                  <div>
                    <strong>Last Model Save Path:</strong><br /><span class="high-light">{{
                      response_info.last_model_save_path }}</span>
                  </div>
                  <!-- 其他字段... -->
                </div>
              </div>

              <div class="box">
                <h2>Accuracy Information</h2>
                <div class="box-content">
                  <div>
                    <strong>Train Accuracy (Best):</strong> {{ numFilter(response_info.train_accurancy_of_best) }}
                  </div>
                  <div>
                    <strong>Valid Accuracy (Best):</strong> {{ numFilter(response_info.valid_accurancy_of_best) }}
                  </div>
                  <div>
                    <strong>Test Accuracy (Best):</strong> {{ numFilter(response_info.test_accurancy_of_best) }}
                  </div>
                  <div>
                    <strong>Rise Fall Accuracy (Best):</strong> {{ numFilter(response_info.rise_fall_accurancy_of_best) }}
                  </div>
                  <!-- 其他字段... -->
                </div>
              </div>
            </div>
          </template>
        </el-dialog>
      </template>
    </div>
    <template slot="footer">
      <template>
        <div class="paginationClass">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 25, 300]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </template>
    </template>
  </d2-container>
</template>
<style scoped>
.box-container {
  display: flex;
  justify-content: space-between;
}

.box {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  width: 30%;
  /* 调整宽度以适应页面布局 */
}

.box-wide {
  /* 添加 box-wide 类名，设置更大的宽度 */
  width: 40%;
}

.box-content {
  margin-top: 10px;
}

.box-content div {
  margin-top: 8px;
}

.box-content .high-light {
  color: #00a47b;
}

.box-content .important-high-light {
  color: #df3079;
}

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
      loading: true,
      pageSize: 10,
      currentPage: 1,
      response_info: [],
      showResponeDialog: false,
      detail_start_time: null,
      detail_end_time: null
    }
  },
  methods: {
    handleClickDetails(row) {
      const response = row.response_info
      this.detail_start_time = row.start_time
      this.detail_end_time = row.end_time
      this.response_info = JSON.parse(response)
      this.showResponeDialog = true
      console.log(this.response_info)
    },
    numFilter(value) {
      // 截取当前数据到小数点后三位
      const transformVal = Number(value).toFixed(3)
      const realVal = transformVal.substring(0, transformVal.length - 1)
      // num.toFixed(3)获取的是字符串
      return Number(realVal)
    },
    queueIDFilter(val) {
      // 判断 val 是否为 undefined，如果是则返回空字符串
      if (val === undefined) {
        return ''
      }

      // 截取当前数据到小数点后三位
      console.log(val)
      const realVal = val.toString().slice(0, 10)
      // num.toFixed(3)获取的是字符串
      return realVal
    },
    openAlert(title, msg) {
      this.$alert(msg, title, {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    },
    // processData(row) {
    //   const formattedData = []
    //   for (const key in row.response_info) {
    //     formattedData.push({
    //       property: key,
    //       value: row.response_info[key]
    //     })
    //   }
    //   this.response_info = formattedData
    // },
    statusFormatter(row) {
      const statusMapping = {
        0: '等待运行',
        1: '正在运行',
        2: '运行成功',
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
          return 'color: #7fba00'
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
    handleSizeChange(val) {
      this.loading = true
      this.pageSize = val
      this.queryData.page_size = val
      this.currentPage = 1
      this.queryData.page_number = 0
      this.getUnfinishTaskList()
    },
    handleCurrentChange(val) {
      this.loading = true
      this.currentPage = val
      this.queryData.page_number = val - 1
      this.queryData.page_size = this.pageSize
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
    getUnfinishTaskList() {
      this.$store.dispatch('customer/parampro/getDoneTasks', this.queryData)
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
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  },
  created() {
    this.getUnfinishTaskList(this.queryData)
  }
}
</script>
