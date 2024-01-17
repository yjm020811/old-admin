<template>
  <div ref="mapRef" style="width: 50%; height: 500px"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { mapData } from './map.js'
console.log(mapData)
const mapRef = ref(null)
onMounted(() => {
  const myChart = echarts.init(mapRef.value)
  echarts.registerMap('sichuanMap', mapData)
  const option = {
    geo: {
      type: 'map',
      map: 'sichuanMap',
      zoom: 1,
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
        shadowColor: '#013c62',
        shadowOffsetX: -5,
        shadowOffsetY: 15,
        shadowBlur: 20
      }
    },
    visualMap: {
      show: false,
      max: 100,
      seriesIndex: 0,
      inRange: {
        // 明亮的颜色
        color: ['#2b83ba', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c']
      }
    },
    series: [
      {
        type: 'map',
        map: 'sichuanMap',
        // 视角缩放比例
        zoom: 1,
        // 是否开启鼠标缩放和平移地图
        roam: false,
        // 图形上的文本
        label: {
          show: true,
          // 旋转文本
          // rotate: -20,
          // 对文本进行偏移
          // offset: [10, 40],
          // 文本字体风格
          // fontStyle: "italic",
          // 文本字体粗细
          fontWeight: 'normal',
          color: '#000'
        },
        // 地图区域的多边形 图形样式
        itemStyle: {
          // 图形的描边颜色
          borderColor: '#013c62',
          borderWidth: 1
        },
        // 高亮状态的图形和标签样式
        emphasis: {
          label: {
            // 标签文本的格式
            height: 40,
            backgroundColor: '#fff',
            color: '#000',
            padding: [8, 10, 4],
            fontSize: 16,
            borderColor: 'skyblue',
            borderWidth: 1,
            formatter: (params) => {
              console.log(params)
              // 根据需要配置提示内容
              let str = params.data.name
              if (
                typeof params.value === 'string' &&
                params.value.length >= 2
              ) {
                str += '\n' + params.value.slice(-2)
              } else {
                str += '\n' + params.value // 如果字符串长度小于2或者不是字符串，直接拼接整个字符串
              }
              return str
            }
          },
          itemStyle: {
            areaColor: '#2B9184',
            borderWidth: 0,
            color: '#2B9184'
          }
        },
        data: mapData.features.map((item) => {
          const key = item.properties.name
          const value = Math.random() * 100
          return {
            name: key,
            value: value
          }
        })
      }
    ]
  }
  myChart.setOption(option)
})
</script>

<style scoped></style>
