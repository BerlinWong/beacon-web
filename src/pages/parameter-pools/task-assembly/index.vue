<template>
  <d2-container>
    <template slot="header">拼装车间</template>
    <div class="container">
      <div class="container-main">
        <template>
          <div style="margin-bottom: 15px;">参数列表</div>
          <el-row :gutter="20">
            <el-col :span="18">
              <el-table :data="suggestParams" style="width: 100%" border :stripe=true height="calc(100vh - 240px - 30px)">
                <el-table-column prop="name" label="参数项" width="120px" :formatter="paramFormatter">
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
                <el-table-column prop="default" label="默认值" width="120px" align="center">
                </el-table-column>
                <el-table-column prop="options" label="选项" width="200px">
                </el-table-column>
                <el-table-column label="描述" width="200px" :formatter="handleEmptyData">
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="4">
              <template>
                <div class="terminal-box">
                  <div class="terminal-header">
                    <div class="close-btn"></div>
                    <div class="minimize-btn"></div>
                    <div class="maximize-btn"></div>
                  </div>
                  <div class="terminal-body">
                    <span>$</span> <span>{{ pre_command }}</span> <span>{{ exec_file }}</span> <span
                      v-for="(val, key, index) in params_col" :key="index">{{ val.name }} {{ val.default }}</span>
                  </div>
                </div>
              </template>
              <div class="container-main-right">
                <template>
                  <div class="btn-list">
                    <div>
                      <el-button type="primary"><i class="fa fa-paper-plane" aria-hidden="true"></i> 提交</el-button>
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
            <!-- <el-col :span="12">
              <el-table :data="parameters[1]" style="width: 100%" border :stripe=true>
                <el-table-column prop="name" label="参数项" width="120px" :formatter="paramFormatter">
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
                <el-table-column prop="default" label="默认值" width="120px" align="center">
                </el-table-column>
                <el-table-column prop="options" label="选项" width="200px">
                </el-table-column>
                <el-table-column label="描述" width="200px" :formatter="handleEmptyData">
                </el-table-column>
              </el-table>
            </el-col> -->
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
      pre_command: 'conda activate py39torch118 && python',
      exec_file: '/home/Shares/workdic/simulation_oneday.py',
      params_col: [{
        name: '--uid',
        default: 'request'
      }],
      params: '',
      paramsDefaultValue: '',
      parameters: [],
      suggestParams: []
    }
  },
  methods: {
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
      console.log(this.params_col.name)
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
      console.log(suggestParams)
      var results = queryString ? suggestParams.filter(this.createFilter(queryString)) : suggestParams
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelect(item) {
      console.log(item)
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
        { name: 'uid', type: 'str', default: 'Required', options: [], description: '' },
        { name: 'model', type: 'str', default: 'Required', options: ['PatchTST', 'TimesNet'], description: '' },
        { name: 'train_epochs', type: 'int', default: 200, options: [], description: '' },
        { name: 'train_stdate', type: 'str', default: '2023-12-04', options: [], description: '' },
        { name: 'train_endate', type: 'str', default: '2023-12-15', options: [], description: '' },
        { name: 'val_stdate', type: 'str', default: '2023-12-18', options: [], description: '' },
        { name: 'val_endate', type: 'str', default: '2023-12-18', options: [], description: '' },
        { name: 'test_date', type: 'str', default: '2023-12-15', options: [], description: '' },
        { name: 'table_name', type: 'str', default: 'cffex_l2_20231123', options: ['ifind_history_data_by_ticks', 'cffex_l2_20231123'], description: '' },
        { name: 'up_bar', type: 'float', default: 5, options: [], description: '' },
        { name: 'low_bar', type: 'float', default: -5, options: [], description: '' },
        { name: 'batch_size', type: 'int', default: 256, options: [], description: '' },
        { name: 'seq_len', type: 'int', default: 1800, options: [], description: '' },
        { name: 'pred_window', type: 'int', default: 600, options: [], description: '' },
        { name: 'learning_rate', type: 'float', default: 0.0001, options: [], description: '' },
        { name: 'level_cnt', type: 'int', default: 3, options: [], description: '' },
        { name: 'checkpoints', type: 'str', default: '3', options: [], description: '' },
        { name: 'gpu', type: 'int', default: 0, options: [], description: '' },
        { name: 'use_basemodel', type: 'bool', default: false, options: [], description: '' },
        { name: 'base_model_path', type: 'int', default: 0, options: [], description: '' },
        { name: 'initconv', type: 'int', default: 1, options: [], description: '' },
        { name: 'conv_out_dim', type: 'int', default: 8, options: [], description: '' },
        { name: 'label_func', type: 'str', default: 'normal', options: ['normal', 'jump'], description: '' },
        { name: 'low_tick', type: 'int', default: 0, options: [], description: '' },
        { name: 'stride_x_predlen', type: 'int', default: 20, options: [], description: '' },
        { name: 'e_layers', type: 'int', default: 3, options: [], description: '' },
        { name: 'd_model', type: 'int', default: 256, options: [], description: '' },
        { name: 'd_ff', type: 'int', default: 1024, options: [], description: '' },
        { name: 'n_heads', type: 'int', default: 8, options: [], description: '' },
        { name: 'strategy', type: 'str', default: 'both_radical', options: ['ptst', 'tsn', 'both_radical', 'both_conservative'], description: '' }
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
.terminal-box {
  border: 2px solid #333;
  border-radius: 5px;
  overflow: hidden;
  width: 400px;
  max-width: 100%;
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
}

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
  height: calc(100% - 55px);
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
