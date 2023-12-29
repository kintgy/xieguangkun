<template>
  <el-row class="mb-10 file-list-mt-5">
    <el-col :span="24">
      <template v-for="(item, index) in fileList" :key="`${index}_${showHover(index)}`">
        <el-row justify="space-between" v-if="index < 5 || showBtn"
                class="file-list-item"
                @mouseenter="hoverBtn[index] = !hoverBtn[index]"
                @mouseleave="hoverBtn[index] = !hoverBtn[index]">
          <el-col :span="20" class="file-list-item-name" @click="handleDownload(fileList[fileList.length - 1 - index])">
            <el-icon><Document /></el-icon>
            {{ fileList[fileList.length - 1 - index].name }}
          </el-col>
          <el-col :span="4">
            <el-button type="text" class="right-middle color-success"
                       :icon="hoverBtn[index] ? Close : CircleCheck"
                       @click="$emit('delete', fileList.length - 1 - index)"
            >
            </el-button>
          </el-col>
        </el-row>
      </template>
    </el-col>
  </el-row>
  <el-row>
    <el-button type="text" class="right-middle"
               v-if="fileList.length > 0"
               :icon="showBtn ? ArrowUp : ArrowDown"
               @click="showBtn = !showBtn">
      {{ showBtn ? '收起' : '展开' }}
    </el-button>
  </el-row>
</template>

<script setup>
import {defineProps, ref,} from "vue";
import {CircleCheck, ArrowDown, ArrowUp, Close, Document} from "@element-plus/icons-vue";
import fund from "@/request/api/fund";

defineProps({
  fileList: {
    type: Array,
    required: true
  }
})

let showBtn = ref(false)
let hoverBtn = ref([false])
let showHover = (index) => {
  if (hoverBtn.value[index] === undefined) hoverBtn.value[index] = false
}

const handleDownload = async (file) => {
  let arr = file.response.data.split("/");
  let res = await fund.manager.openUrl({fileName: arr[arr.length - 1]});
  let blob = new Blob([res.data], {
    // type: res.data.type,
  });
  let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向返回的文件流
  // 创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
  let a = document.createElement("a");
  a.href = url;
  // a.download = decodeURI(res.headers.filename);
  a.download = file.name;
  a.click();
  // 释放这个临时的对象url
  window.URL.revokeObjectURL(url);
};
</script>

<style scoped>
.file-list-mt-5 {
  margin-top: 5px;
}

.file-list-item {
  padding: 6px;
  color: #606266;
  font: 14px "PingFang SC";
}

.file-list-item:hover {
  cursor: pointer;
  background-color: var(--el-color-info-light-9);
  border-radius: 5px;
  color: var(--el-color-primary) !important;
}

.file-list-item:hover .file-list-item-name {

}


</style>