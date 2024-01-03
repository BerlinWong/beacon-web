<template>
  <d2-container>
    <template slot="header">任务队列</template>
    <div>
      <template>
        <el-table :data="tableData" border style="width: 80%;margin-bottom: 50px;" :stripe=true :fit=false
          v-loading="loading">
          <!-- <el-table-column prop="queue_id" label="任务编号" width="300">
          </el-table-column> -->
          <el-table-column prop="queue_id" label="队列编号" width="120px" :formatter="formatQueueId" align="center">
          </el-table-column>
          <el-table-column prop="creator" label="创建人" width="80px" align="center" sortable>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="80px" align="center" :formatter="priorityFormatter" sortable>
          </el-table-column>
          <el-table-column width="100px" label="当前状态" align="center" sortable>
            <template v-slot="scope">
              <div v-if="scope.row.start_time">
                <el-tooltip class="item" effect="dark" placement="top">
                  <!-- <el-button>上边</el-button> -->
                  <div slot="content">任务开始时间：<br />{{ scope.row.start_time }}</div>
                  <div v-html="statusFormatter(scope.row)"></div>
                </el-tooltip>
              </div>
              <div v-else>
                <div v-html="statusFormatter(scope.row)"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="750px" label="执行命令">
            <template v-slot="scope">
              <div class="command-container">
                <div>
                  <el-tooltip class="item" effect="dark" content="复制命令" placement="left">
                    <el-button type="text" id="copy" @click="copyCommand(customFormatter(scope.row))">
                      <i class="el-icon-document-copy"></i>
                    </el-button>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">{{ customFormatter(scope.row) }}</div>
                    <div class="command-box">{{ customFormatter(scope.row) }}</div>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="150px" align="center" sortablesortable>
          </el-table-column>
          <!-- <el-table-column prop="start_time" label="任务开始时间" width="150px" align="center" :formatter="formatColumnNull">
          </el-table-column>
          <el-table-column prop="end_time" label="任务结束时间" width="150px" align="center" :formatter="formatColumnNull">
          </el-table-column> -->
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button @click="handleClickToTop(scope.row)" type="text" size="small" :disabled="scope.row.msg_id != 0">置顶</el-button>
              <el-button @click="handleClickToLast(scope.row)" type="text" size="small" :disabled="scope.row.msg_id != 0">滞后</el-button>
              <el-button @click="handleClickToDel(scope.row)" type="text" size="small" :disabled="scope.row.msg_id != 0">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
.command-box {
  max-width: 700px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  margin-left: 15px;
}

.command-container {
  display: flex;
  flex-direction: row;
  align-items: center;
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
import Clipboard from 'clipboard'

export default {
  data() {
    return {
      tableData: [],
      queryData: {
        page_number: 0,
        page_size: 10
      },
      total: 0,
      showTooltip: true,
      loading: true,
      pageSize: 10,
      currentPage: 1
    }
  },
  methods: {
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
      const value = row.pre_command + ' ' + row.exec_file + ' ' + row.params_col
      return value
    },
    // copyCommand(value) {
    //   console.log(value)
    // },
    copyCommand(value) {
      // console.log(value)
      const clipborad = new Clipboard('#copy', {
        text: () => value
      })
      // 复制成功
      clipborad.on('success', (e) => {
        this.$message({
          message: '已复制到剪切板',
          type: 'success'
        })
        clipborad.destroy()
      })
      // 复制失败
      clipborad.on('error', (e) => {
        this.$message.error('复制出错')
        // 释放内存
        clipborad.destroy()
      })
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
      this.$store.dispatch('customer/parampro/getUnfinishTasks', this.queryData)
        .then(response => {
          // 在这里处理异步操作成功后的响应
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
      // 网络优化
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
