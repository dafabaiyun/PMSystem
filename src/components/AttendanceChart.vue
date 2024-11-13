<template>  
    <div ref="chart" style="width: 100%; height: 400px;"></div>  
  </template>  
    
  <script>  
  import * as echarts from 'echarts';  
    
  export default {  
    name: 'AttendanceChart',  
    props: {  
      attendanceData: {  
        type: Array,  
        required: true,  
        default: () => []  
      }  
    },  
    mounted() {  
      this.initChart();  
    },  
    methods: {  
      initChart() {  
        const chartDom = this.$refs.chart;  
        const myChart = echarts.init(chartDom);  
    
        const categories = this.attendanceData.map(item => item.date);  
        const absent = this.attendanceData.map(item => item.absent);  
        const leave = this.attendanceData.map(item => item.leave);  
        const present = this.attendanceData.map(item => item.present);  
    
        const option = {  
          title: {  
            text: 'Monthly Attendance Report'  
          },  
          tooltip: {  
            trigger: 'axis',  
            axisPointer: {  
              type: 'shadow'  
            }  
          },  
          legend: {  
            data: ['Absent', 'Leave', 'Present']  
          },  
          grid: {  
            left: '3%',  
            right: '4%',  
            bottom: '3%',  
            containLabel: true  
          },  
          xAxis: {  
            type: 'category',  
            data: categories  
          },  
          yAxis: {  
            type: 'value'  
          },  
          series: [  
            {  
              name: 'Absent',  
              type: 'bar',  
              stack: 'total',  
              data: absent,  
              itemStyle: { color: '#ff0000' }  
            },  
            {  
              name: 'Leave',  
              type: 'bar',  
              stack: 'total',  
              data: leave,  
              itemStyle: { color: '#00ff00' }  
            },  
            {  
              name: 'Present',  
              type: 'bar',  
              stack: 'total',  
              data: present,  
              itemStyle: { color: '#0000ff' }  
            }  
          ]  
        };  
    
        myChart.setOption(option);  
      }  
    }  
  };  
  </script>  
    
  <style scoped>  
  /* Add any scoped styles here */  
  </style>