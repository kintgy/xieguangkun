<template>
  <el-row class="mb-10">
    <el-col :span="24">
      <template v-for="(item, index) in fileList" :key="`${index}_${showHover(index)}` ">
        <el-row justify="space-between" v-if="index < 5 || showBtn">
          <el-col :span="20">
            {{ fileList[fileList.length - 1 - index].name }}
          </el-col>
          <el-col :span="4">
            <el-button type="text" class="right-middle color-success"
                       :icon="hoverBtn[index] ? Close : CircleCheck"
                       @mouseenter="hoverBtn[index] = !hoverBtn[index]"
                       @mouseleave="hoverBtn[index] = !hoverBtn[index]"
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
import {CircleCheck, ArrowDown, ArrowUp, Close} from "@element-plus/icons-vue";

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
</script>

<style scoped>

</style>