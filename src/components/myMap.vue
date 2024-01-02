<template>
  <div ref="mapRef" style="width: 50%; height: 500px"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { mapData } from './map.js'
const mapRef = ref(null)
onMounted(() => {
  const myChart = echarts.init(mapRef.value)
  echarts.registerMap('sichuanMap', mapData)
  const option = {
    geo: {
      type: 'map',
      map: 'sichuanMap',
      zoom: 1,
      label: {
        show: true,
        color: '#fff',
        fontSize: 15
        // 高亮状态下的多边形和标签样式。
      },
      // 选中状态下的多边形和标签样式
      emphasis: {
        itemStyle: {
          color: 'rgba(15, 40, 80, .5)', // 地图背景色
          borderColor: '#516a89', // 省市边界线00fcff 516a89
          borderWidth: 1,
          areaColor: '#2068e3'
        },
        label: {
          color: '#fff'
        }
      },
      itemStyle: {
        borderColor: 'rgba(147, 235, 248, 1)',
        borderWidth: 1,
        areaColor: {
          // 背景色
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(4, 129, 181, 0.2)' // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(4, 129, 181, 0.4)' // 100% 处的颜色
            }
          ],
          globalCoord: false // 缺省为 false
        },
        shadowColor: 'rgba(128, 217, 248, 1)',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10
      }
    }
  }
  myChart.setOption(option)
})
</script>

<style scoped></style>
