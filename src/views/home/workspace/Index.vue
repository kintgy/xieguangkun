<template>
  <el-card class="home-workspace" header="工作台">
    <el-row justify="space-between">
      <el-col :span="24">
        <!-- <el-empty description="敬请期待"></el-empty> -->
      </el-col>
      <el-col :md="12" :sm="24">
        <div style="height: 500px" id="mainLeft"></div>
      </el-col>
      <el-col :md="12" :sm="24">
        <div style="height: 500px" id="mainMiddle"></div>
      </el-col>
      <el-col :span="24" class="year-data">
        <el-row>
          <el-col style="margin-bottom: 10px">
            <span class="year-data-title">本周录入新增项目 <span class="color-success">{{
                yearData.weekNum
              }}</span> 个，分别为：</span>
            <br/>
            <span class="year-data-detail" v-for="(item, idx) in yearData.weekNames" :key="item">{{ idx > 0 ? `，${item}` : item }}</span>
          </el-col>
          <el-col>
            <span class="year-data-title">本月录入新增项目 <span class="color-success">{{
                yearData.monthNum
              }}</span> 个，分别为：</span>
            <br/>
            <span class="year-data-detail" v-for="(item, idx) in yearData.monthNames" :key="item">{{ idx > 0 ? `，${item}` : item }}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import * as echarts from "echarts";
import {onMounted, reactive, ref} from "vue";
import api from "@/request/api/notification";

let option = reactive({
  weekData: {
    title: {
      text: "周图",
      // subtext: "Fake Data",
      left: "center",
    },
    tooltip: {show: true, trigger: 'item'},
    // tooltip: {
    //   trigger: "item",
    // },
    // legend: {
    //   orient: "vertical",
    //   left: "left",
    // },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: [
          // { value: 1048, name: "Search Engine" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: '{b} : {c} ({d}%)'
            },
            labelLine: { show: true }
          }
        }
      },
    ],
  },
  seasonData: {
    title: {
      text: "季图",
      left: "center",
    },
    tooltip: {show: true, trigger: 'item'},
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        itemStyle: {
          normal: {
            label: {
              show: true,
              formatter: '{b} : {c} ({d}%)'
            },
            labelLine: { show: true }
          }
        }
      },
    ],
  }
});

let yearData = ref({
  weekNum: 0,
  weekNames: [],
  monthNum: 0,
  monthNames: []
})

onMounted(async () => {
  //周图
  api
      .getPieChartData({
        startTime: new Date().getTimeRange("week")[0],
        endTime: new Date().getTimeRange("week")[1],
      })
      .then((res) => {
        res.forEach((item) => {
          option.weekData.series[0].data.push({
            value: item.number,
            name: item.sign1,
          });
        });
        let chartDomLeft = document.getElementById("mainLeft");
        let myChartLeft = echarts.init(chartDomLeft);
        option.weekData && myChartLeft.setOption(option.weekData);
      });

  console.log(new Date().getTimeRange("season"))
  //季图
  api
      .getPieChartData({
        startTime: new Date().getTimeRange("season")[0],
        endTime: new Date().getTimeRange("season")[1],
      })
      .then((res) => {
        res.forEach((item) => {
          option.seasonData.series[0].data.push({
            value: item.number,
            name: item.sign1,
          });
        });
        let chartDoMiddle = document.getElementById("mainMiddle");
        let myChartMiddle = echarts.init(chartDoMiddle);
        option.seasonData && myChartMiddle.setOption(option.seasonData);
      });
  //年图
  api.getCompanyCount().then(res => {
    console.log(res)
    yearData.value = res
  })


});
</script>
<style scoped>
/* #main {
  height: 300px;
} */
.year-data-title {
  font-size: 18px;
  font-weight: 500;
}

.year-data-detail {
  color: #606266;
}
</style>