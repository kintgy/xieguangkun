<template>
  <el-button :type="btnType ? btnType : ''" @click="dialogShow = true">{{ btnText ? btnText : '点击上传' }}</el-button>
  <el-dialog title="上传" v-model="dialogShow" @close="$emit('close', '')">
    <el-row justify="center">
      <el-upload
          class="upload-demo"
          drag
          :action="`${base.url}${action}`"
          :on-success="handleSuccess"
          :limit="limit">
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          拖曳文件到此或<em>选择文件</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            <el-link
                type="primary"
                v-if="example"
                :href="'/examples/' + example"
                download="示例文件"
                :underline="false">点击下载示例文件
            </el-link>
          </div>
        </template>
      </el-upload>
    </el-row>
    <template #footer>
      <el-button type="primary" @click="dialogShow=false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {UploadFilled} from '@element-plus/icons-vue'
import {ref, defineProps} from "vue";
import base from "@/request/base";
import {ElMessage} from "element-plus";

defineProps({
  value: {
    default() {
      return [];
    },
  },
  director: {default: ''},
  autoExceed: {default: false},
  accept: {default: ''},
  btnText: {default: ''},
  btnType: {default: ''},
  limit: {default: 1},
  action: {default: ''},
  example: {default: ''}
});

const dialogShow = ref(false)

const handleSuccess = () => {
  ElMessage.success('导入成功')
  dialogShow.value = false
}

</script>
