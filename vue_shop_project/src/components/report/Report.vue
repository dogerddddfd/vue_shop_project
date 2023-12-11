<template>
   <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>数据统计</el-breadcrumb-item>
         <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片区 -->
      <el-card>
         <div id="main" style="width: 600px; height: 400px"></div>
      </el-card>
   </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
   data() {
      return {
         // 需要合并的配置
         options: {
            title: {
               text: '用户来源',
            },
            tooltip: {
               trigger: 'axis',
               axisPointer: {
                  type: 'cross',
                  label: {
                     backgroundColor: '#E9EEF3',
                  },
               },
            },
            grid: {
               left: '3%',
               right: '4%',
               bottom: '3%',
               containLabel: true,
            },
            xAxis: [
               {
                  boundaryGap: false,
               },
            ],
            yAxis: [
               {
                  type: 'value',
               },
            ],
         },
      }
   },
   created() {},
   async mounted() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))

      const { data: res } = await this.$http.get(`reports/type/1`)
      if (res.meta.status !== 200) {
         console.log(res.meta.msg)
         this.$message.error('获取报表数据失败')
         return
      }

      const result= _.merge(res.data,this.options)

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result)
   },
   methods: {},
}
</script>

<style lang="less">
</style>