<script setup>

import {onMounted, reactive,} from "vue";
import VChart from "vue-echarts";

import {use} from 'echarts/core'
import {PieChart, ScatterChart} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'
import {getImageProcessingChart, getPanelGroup, getPatientAgeChart} from "@/api/dashboard.js";
import {ElMessage} from "element-plus";

onMounted(() => {
  requestPanelGroup()
  requestPatientAgeChart()
  requestImageProcessingChart()
})

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  ScatterChart,
  CanvasRenderer
])

const counts = reactive({
  patientCount: 0,
  studyCount: 0,
  taskCount: 0,
  patientIncrease: 0,
  studyIncrease: 0,
  taskIncrease: 0,
});

const requestPanelGroup = () => {
  getPanelGroup().then((res) => {
    Object.assign(counts, res.data);
  }).catch((err) => {
    ElMessage.error(err.message)
  })
}

const requestPatientAgeChart = () => {
  getPatientAgeChart().then((res) => {
    patientAgeChartOptions.series[0].data[0].value = res.data.youthNum;
    patientAgeChartOptions.series[0].data[1].value = res.data.adultNum;
    patientAgeChartOptions.series[0].data[2].value = res.data.elderlyNum;
  }).catch((err) => {
    ElMessage.error(err.message)
  })
}

const requestImageProcessingChart = () => {
  getImageProcessingChart().then((res) => {
    imageProcessTimeConsumingChartOptions.series[0].data = res.data.map(item => item.consumedTime);
    imageProcessTimeConsumingChartOptions.xAxis.data = res.data.map(item => item.taskId);
  }).catch((err) => {
    ElMessage.error(err.message)
  })
}

const patientAgeChartOptions = reactive({
  title: {
    text: '患者年龄分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '患者年龄分布占比',
      type: 'pie',
      radius: '50%',
      data: [
        {value: 0, name: '少年组(0~14)'},
        {value: 0, name: '成年组(15~65)'},
        {value: 0, name: '老年组(65+)'},
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

const imageProcessTimeConsumingChartOptions = reactive({
  title: {
    text: '图像处理耗时统计（最近20次）',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      return '任务ID: ' + params[0].name + '<br/>' +
          '处理耗时: ' + params[0].data + 's';
    }
  },
  xAxis: {
    type: 'category',
    name: '任务ID',
    data: [1, 2, 3, 4, 5],
    nameTextStyle: {
      fontSize: 11
    }
  },
  yAxis: {
    type: 'value',
    name: '处理耗时 (s)',
    axisLabel: {
      formatter: '{value} s'
    }
  },
  series: [{
    name: '处理耗时',
    type: 'scatter',
    // data: [],
    data: [1, 2, 3, 4, 5],
    symbolSize: 10,
    itemStyle: {
      color: '#5470c6'
    }
  }],
})

</script>

<template>
  <div id="dashboard">
    <el-row :gutter="16">
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="counts.patientCount">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                患者人数
                <el-tooltip
                    effect="dark"
                    content="Number of users who logged into the product in one day"
                    placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning/>
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>较昨日增长</span>
              <span class="green">
              {{ counts.patientIncrease }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="counts.studyCount">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                检查记录个数
                <el-tooltip
                    effect="dark"
                    content="Number of users who logged into the product in one month"
                    placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning/>
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>较昨日增长</span>
              <span class="green">
              {{ counts.studyIncrease }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
            </span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="counts.taskCount">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                任务记录个数
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>较昨日增长</span>
              <span class="green">
              {{ counts.taskIncrease }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
            </div>
            <div class="footer-item">
              <el-icon :size="14">
                <ArrowRight/>
              </el-icon>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="chart-box">
      <v-chart class="chart" :option="patientAgeChartOptions"/>
      <v-chart class="chart" :option="imageProcessTimeConsumingChartOptions"/>
    </div>
  </div>
</template>

<style scoped>
.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.statistic-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed var(--el-border-color-lighter);
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  padding: 2px 6px;
  border-radius: 12px;
}

.green {
  color: var(--el-color-success);
  background-color: rgba(var(--el-color-success-rgb), 0.1);
}

.red {
  color: var(--el-color-error);
  background-color: rgba(var(--el-color-error-rgb), 0.1);
}

/* 添加标题样式 */
.el-statistic .el-statistic__head {
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.el-statistic .el-statistic__content {
  margin-top: 8px;
}

.chart-box {
  display: flex;
  justify-content: space-between;
}

.chart {
  margin-top: 50px;
  height: 400px;
  width: 630px;
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px;
  transition: all 0.3s ease;
}

.chart:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

</style>
