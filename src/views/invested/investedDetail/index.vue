<template>
  <div class="header">
    <el-link href="/invested/investedList" type="primary" :underline="false">
      <el-icon>
        <ArrowLeft />
      </el-icon>
      返回列表
    </el-link>

    <div class="rightBtns">
      <el-button @click="handleSelected" v-if="$store.getters.userInfo.routes.indexOf('/invested/investedList/edit') >= 0" type="primary">编辑</el-button>
      <el-button @click="deleteItem" v-if="$store.getters.userInfo.routes.indexOf('/invested/investedList/delete') >= 0" type="danger">删除</el-button>
    </div>
  </div>

  <el-row class="detail-form">
    <template v-for="field in fields" :key="field.id">
      <el-col :sm="8" :md="4" class="detail-item detail-label">
        <div v-html="field.label" />
      </el-col>
      <el-col :sm="16" :md="20" class="detail-item detail-content">
        <div
          v-if="field.id != 'xieyi' && field.id != 'caiwubaogao'&& field.id != 'shenjibaogao'&& field.id != 'xiangguanwenjian'&& field.id != 'qitawenjian'&&field.id!='dongshijiyao'&&field.id!='gudongjiyao'&&field.id!='cailiaobao'"
          v-html="data[field.id] ? data[field.id] : ''"
        ></div>
        <div v-if="field.id=='cailiaobao'">
          <a target="_blank" :href="data[field.id]">{{ data[field.id] }}</a>
        </div>
        <div v-if="['xieyi','caiwubaogao','shenjibaogao','xiangguanwenjian','qitawenjian','gudongjiyao','dongshijiyao'].indexOf(field.id)>-1" class="">
          <p
            style="color: var(--el-color-primary); cursor: pointer"
            @click="handleDownload(file)"
            v-for="(file, index) in data[field.id]"
            :key="index"
          >
            {{ file.name }}
          </p>
        </div>
      </el-col>
    </template>
  </el-row>

  <edit-invested
    v-if="selected !== undefined"
    :invested="selected"
    @close="selected = undefined"
  />
</template>

<script setup>
import { ArrowLeft } from "@element-plus/icons-vue";
import { onMounted, ref, defineProps } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import EditInvested from "@/views/invested/investedList/EditInvested";
import { useRouter } from 'vue-router'
const router = useRouter()

import invested from "@/request/api/invested";
// import fund from "@/request/api/fund";


const props = defineProps({ id: { required: true } });

const fields = [
  // { id: "name", label: "隶属基金", fixed: "left" },
  { id: "name", label: "项目名称", fixed: "left" },
  { id: "jijinName", label: "隶属基金", fixed: "left" },
  { id: "jine", label: "投资金额" },
  { id: "wanchengtouzi", label: "已完成投资金额" },
  { id: "shijian", label: "投资时间" },
  { id: "xieyi", label: "投资协议" },
  { id: "cailiaobao", label: "材料包" },
  { id: "caiwubaogao", label: "财务报告" },
  { id: "shenjibaogao", label: "审计报告" },
  { id: "gudongjiyao", label: "股东会纪要" },
  { id: "dongshijiyao", label: "董事会纪要" },
  // { id: "xiangguanwenjian", label: "融资相关文件" },
  { id: "qitawenjian", label: "其他文件" },
  { id: "beizhu", label: "备注" },
];



const handleSelected=()=>{
  // selected.value=JSON.parse(sessionStorage.getItem('InvestedCurrentRow'))
  selected.value=copyData.value
}

const deleteItem = () => {
  let row=JSON.parse(sessionStorage.getItem('InvestedCurrentRow'))
  ElMessageBox.confirm("确定删除投后：" + row.name + "?", "删除投后", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      invested.manager.delete(row.id).then((res) => {
        if (res) {
          ElMessage.success("删除成功");
          router.push('/invested/investedList')
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {});
};

const data = ref({});
const copyData = ref({});

const selected = ref(undefined);

onMounted(async () => {
  // console.log('props',props)
  if (props.id) {
    data.value = await invested.manager.detail(props.id);
    copyData.value=JSON.parse(JSON.stringify(data.value))
    data.value.xieyi=data.value.xieyi?JSON.parse(data.value.xieyi):[]
    data.value.caiwubaogao=data.value.caiwubaogao?JSON.parse(data.value.caiwubaogao):[]
    data.value.shenjibaogao=data.value.shenjibaogao?JSON.parse(data.value.shenjibaogao):[]
    data.value.xiangguanwenjian=data.value.xiangguanwenjian?JSON.parse(data.value.xiangguanwenjian):[]
    data.value.qitawenjian=data.value.qitawenjian?JSON.parse(data.value.qitawenjian):[]
    data.value.gudongjiyao=data.value.gudongjiyao?JSON.parse(data.value.gudongjiyao):[]
    data.value.dongshijiyao=data.value.dongshijiyao?JSON.parse(data.value.dongshijiyao):[]
  }
});

const handleDownload = async (file) => {
  let arr = file.response.data.split("/");
  let res = await fund.manager.openUrl({ fileName: arr[arr.length - 1] });
  let blob = new Blob([res.data], {
    // type: res.data.type,
  });
  console.log("blob", blob);
  let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向返回的文件流
  // 创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
  let a = document.createElement("a");
  a.href = url;
  // a.download = decodeURI(res.headers.filename);
  a.download = file.name;
  a.click();
  // 释放这个临时的对象url
  window.URL.revokeObjectURL(url);
  // window.open(url)
};
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}
.detail-form {
  padding: 20px 0;
}

.detail-form .detail-item {
  border: 1px solid var(--el-border-color-light);
  padding: 10px;
}

.detail-form .detail-label {
  display: flex;
  justify-content: center;
}
</style>