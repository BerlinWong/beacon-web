<template>
  <d2-container>
    <template slot="header">拼装车间</template>
    <div class="container">
      <div class="container-main">
        <template>
          <div style="margin-bottom: 15px;">参数列表</div>
          <el-row :gutter="20">
            <el-col :span="18">
              <el-table :data="suggestParams" style="width: 100%" border :stripe=true>
                <el-table-column prop="name" label="参数项" width="120px" :formatter="paramFormatter" sortable>
                  <template v-slot="scope">
                    <span style="margin-right: 5px;color:#2f74ff;">{{ paramFormatter(scope.row) }}</span>
                    <el-tooltip class="item" effect="dark" content="复制参数" placement="top">
                      <el-button type="text" id="copy" @click="copyCommand(paramFormatter(scope.row))">
                        <i class="el-icon-document-copy"></i>
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="数据类型" width="80px" align="center">
                </el-table-column>
                <el-table-column prop="default" label="默认值" width="120px" align="center" sortable>
                </el-table-column>
                <el-table-column prop="options" label="选项" width="160px" :formatter="formatterOptions">
                </el-table-column>
                <el-table-column label="描述" width="200px" :formatter="handleEmptyData">
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="6">
              <div class="container-main-right">
                <template>
                  <div class="btn-list">
                    <div>
                      <el-button type="primary" @click="checkSubmit"><i class="fa fa-paper-plane" aria-hidden="true"></i>
                        提交</el-button>
                    </div>
                  </div>
                  <!-- <div style="margin-top: 50px;position: relative;top: 0;width: 100%;height: 1px;background-color: #ccc;"></div> -->
                  <div class="scroll-view">
                    <div class="shell-load">
                      <el-autocomplete class="inline-input" v-model="params" :fetch-suggestions="querySearch"
                        value-key="name" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
                      <el-input class="inline-input" v-model="paramsDefaultValue" placeholder="默认值"></el-input>
                      <el-button type="primary" icon="el-icon-plus" circle @click="addRow"></el-button>
                      <el-button type="danger" icon="el-icon-refresh-right" circle small @click="clearInput"></el-button>
                    </div>
                    <div v-for="(val, key, index) in params_col" :key="index">
                      <el-input class="inline-input" v-model="val.name" placeholder="默认值"></el-input>
                      <el-input class="inline-input" v-model="val.default" placeholder="默认值"></el-input>
                      <el-button type="text" icon="el-icon-delete" circle @click="(deleteRow(key))"></el-button>
                    </div>
                  </div>
                </template>
              </div>
            </el-col>
          </el-row>
        </template>
      </div>
    </div>
  </d2-container>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  data() {
    return {
      pre_command: '/usr/local/anaconda3/envs/py39torch118/bin/python',
      exec_file: '/home/zhli/mytry/Apollo/trigger.py',
      params_col: [],
      params: '',
      paramsDefaultValue: '',
      parameters: [],
      suggestParams: [],
      submitForm: {
        creator: 'test11',
        priority: 1,
        pre_command: '',
        exec_file: '',
        params_col: []
      },
      submitCommand: ''
    }
  },
  methods: {
    formatterOptions(row) {
      if (row.options) {
        return row.options.toString()
      }
    },
    checkSubmit() {
      if (this.params_col.length === 0) {
        this.$message.error('参数列表为空！')
        return
      }
      this.formatSubmitCommand()
      this.$confirm('此操作将提交任务至队列, 是否继续?<br />' + this.submitCommand, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.handleClickSubmit()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    formatSubmitCommand() {
      var paramsColString = ''
      var i = 0
      for (i = 0; i < this.params_col.length; i++) {
        const paramsColString_ = ' ' + this.params_col[i].name + ' ' + this.params_col[i].default + ' '
        paramsColString += paramsColString_
      }
      this.submitCommand = '<span style="color:blue;">' + this.pre_command + '</span> <span style="color: green;">' + this.exec_file + '</span><span style="color:red;">' + paramsColString + '</span>'
      console.log(this.submitCommand)
    },
    handleClickSubmit() {
      this.submitForm.pre_command = this.pre_command
      this.submitForm.exec_file = this.exec_file
      this.submitForm.params_col = this.params_col
      this.$store.dispatch('customer/parampro/toSubmit', this.submitForm)
        .then(response => {
          // 在这里处理异步操作成功后的响应
          if (response.code === 200) {
            this.$message({
              message: '添加成功，队列编号：' + response.data,
              type: 'success'
            })
          }
        })
        .catch(error => {
          // 在这里处理异步操作失败时的错误
          this.$message.error(error)
          // console.error('Error:', error)
        })
    },
    deleteRow(e) {
      // console.log(e)
      this.params_col.splice(e, 1)
    },
    clearInput() {
      this.params = ''
      this.paramsDefaultValue = ''
    },
    addRow() {
      if (this.params !== '' && this.paramsDefaultValue !== '' && !this.isNameExists(this.params)) {
        var paramsColItem = {
          name: this.params,
          default: this.paramsDefaultValue
        }
        this.params_col.unshift(paramsColItem)
        this.clearInput()
      } else if (this.params === '' || this.paramsDefaultValue === '') {
        this.$message.error('不可以为空！')
      } else if (this.isNameExists(this.params)) {
        this.$message.error('已经添加过了')
        this.clearInput()
      }
    },
    isNameExists(inputString) {
      // console.log(this.params_col.name)
      return this.params_col.some(item => item.name === inputString)
    },
    createFilter(queryString) {
      return (suggestParams) => {
        // console.log(suggestParams.name.toLowerCase().indexOf(queryString.toLowerCase()))
        return (suggestParams.name.toLowerCase().indexOf(queryString.slice(2).toLowerCase()) === 0)
      }
    },
    querySearch(queryString, cb) {
      var suggestParams = this.suggestParams
      // console.log(suggestParams)
      var results = queryString ? suggestParams.filter(this.createFilter(queryString)) : suggestParams
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelect(item) {
      // console.log(item)
      this.params = '--' + this.params
      this.paramsDefaultValue = item.default
    },
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
    paramFormatter(row) {
      return '--' + row.name
    },
    handleEmptyData(row) {
      if (row.description === '') {
        return '暂无描述'
      } else {
        return row.description
      }
    },
    processData() {
      const formattedData = []
      for (const key in this.rawData) {
        formattedData.push({
          property: key,
          value: this.rawData[key]
        })
      }
      this.tableData = formattedData
    },

    suggestParameters() {
      return [
        // { name: 'uid', type: 'string', default: 'Required', options: [], description: '模型的标识符，由平台统一分配' },
        { name: 'model', type: 'string', default: 'Required', options: ['PatchTST', 'TimesNet'], description: '模型的名称' },
        { name: 'table_name', type: 'string', default: 'cffex_l2_20231123', options: ['ifind_history_data_by_ticks', 'cffex_l2_20231123'], description: '数据来源的表名' },
        { name: 'stock_id', type: 'string', default: 'IC2401/ICZL.CFE', description: '股指期货的合约编号' },
        { name: 'train_epochs', type: 'int', default: 200, options: [], description: '模型训练的最大回合数' },
        { name: 'train_stdate', type: 'string', default: '2023-12-04', options: [], description: '股指期货数据训练集的起始时间' },
        { name: 'train_endate', type: 'string', default: '2023-12-15', options: [], description: '股指期货数据训练集的结束时间' },
        { name: 'val_stdate', type: 'string', default: '2023-12-18', options: [], description: '股指期货数据验证集的开始时间' },
        { name: 'val_endate', type: 'string', default: '2023-12-18', options: [], description: '股指期货数据验证集的结束时间' },
        { name: 'test_date', type: 'string', default: '2023-12-15', options: [], description: '股指期货数据测试集的结束时间' },
        { name: 'week_date', type: 'string', default: '1,2,3,4,5', options: [], description: '星期内选取的编号信息，默认星期一到星期五全选' },
        { name: 'up_bar', type: 'float', default: 5, options: [], description: '止盈点' },
        { name: 'low_bar', type: 'float', default: -5, options: [], description: '止损点' },
        { name: 'batch_size', type: 'int', default: 256, options: [], description: '计算误差时的批量大小' },
        { name: 'seq_len', type: 'int', default: 1800, options: [], description: '预测所使用的时间（单位：0.5秒）' },
        { name: 'pred_window', type: 'int', default: 600, options: [], description: '预测的时间窗口（单位：0.5秒）' },
        { name: 'learning_rate', type: 'float', default: 0.0001, options: [], description: '学习率' },
        { name: 'level_cnt', type: 'int', default: 3, options: [], description: '使用行情的档数' },
        { name: 'enc_in', type: 'int', default: 11, options: [], description: '输入数据的维度' },
        { name: 'checkpoints', type: 'string', default: 'checkpoints/', options: [], description: '模型保存的内部相对路径' },
        { name: 'use_extern_pos', type: 'bool', default: false, options: [], description: '是否使用外部的模型储存路径' },
        { name: 'model_abs_save_path', type: 'string', options: [], default: '/home/zhli/mytry/Apollo/checkpoints', description: '外部的模型储存路径' },
        { name: 'env_name', type: 'string', default: 'py39torch118', options: [], description: 'conda环境的名字' },
        { name: 'gpu', type: 'int', default: 0, options: [], description: '使用GPU的编号' },
        { name: 'use_basemodel', type: 'bool', default: false, options: [], description: '是否使用预训练模型' },
        { name: 'base_model_path', type: 'string', default: '0', options: [], description: '预训练模型的保存位置' },
        { name: 'initconv', type: 'int', default: 1, description: '是否对初始输入使用卷积' },
        { name: 'conv_out_dim', type: 'int', default: 8, description: '卷积层输出维度' },
        { name: 'label_func', type: 'string', default: 'normal', options: ['normal', 'jump'], description: '计算标签的方式' },
        { name: 'low_tick', type: 'int', default: 0, options: [], description: 'label_func为jump时使用，挂单的降点数' },
        { name: 'stride_x_predlen', type: 'int', default: 20, options: [], description: '滑动采样训练集时滑动窗口的步长' },
        { name: 'e_layers', type: 'int', default: 3, options: [], description: '模型的深度（PatchTST）' },
        { name: 'top_k', type: 'int', default: 5, options: [], description: '模型的深度（TimesNet）' },
        { name: 'd_model', type: 'int', default: 256, options: [], description: '模型隐藏层维度' },
        { name: 'd_ff', type: 'int', default: 1024, options: [], description: '全连接层维度' },
        { name: 'n_heads', type: 'int', default: 8, options: [], description: '注意力的头数' },
        { name: 'strategy', type: 'string', default: 'both_radical', options: ['ptst', 'tsn', 'both_radical', 'both_conservative'], description: '测试时的策略' }
      ]
    },
    splitParameters() {
      // 假设完整数组是 this.suggestParameters()
      const fullArray = this.suggestParameters()

      // 计算中间位置
      const midIndex = Math.ceil(fullArray.length / 2)

      // 使用 slice 方法拆分成两个数组
      const firstHalf = fullArray.slice(0, midIndex)
      const secondHalf = fullArray.slice(midIndex)

      // 将两个拆分的数组赋值给 this.parameters
      this.parameters = [firstHalf, secondHalf]
      this.suggestParams = fullArray
    }
  },
  created() {
    this.splitParameters()
  }

}
</script>
<style scoped>
/* .terminal-box {
  border: 2px solid #333;
  border-radius: 5px;
  overflow: hidden;
  width: calc(90%);
  background-color: #2d2d2d;
  margin-bottom: 15px;
  color: #eee;
  max-height: 200px;
}

.terminal-header {
  background-color: #4d4d4d;
  padding: 8px;
  display: flex;
  align-items: center;
} */

.close-btn {
  background-color: #ff5f56;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.minimize-btn {
  background-color: #ffbd2e;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.maximize-btn {
  background-color: #27c93f;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.terminal-body {
  padding: 16px;
  white-space: pre-wrap;
  height: 200px;
  overflow: hidden;
}

.container {
  display: flex;
}

.container-main {
  /* width: ; */
  overflow-x: hidden;
}

.container-main-right {
  position: fixed;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  height: calc(100vh - 240px - 30px);
  padding: 15px;
  overflow: hidden;
}

.scroll-view {
  height: calc(100% - 80px);
  margin-top: 50px;
  overflow-y: scroll;
  width: 110%;
}

.container-main-right .el-input,
.container-main-right .el-autocomplete {
  max-width: 130px;
}

.btn-list {
  /* margin-bottom: 15px; */
  position: fixed;
  /* background-color: #fff; */
  margin-top: -15px;
  padding: 15px;
  height: 50px;
  width: 100%;
  z-index: 9;
}

.inline-input {
  display: inline-block;
  width: 200px;
  margin-right: 5px;
  margin-top: 5px;
}

.shell-load {
  margin-bottom: 15px;
}
</style>
