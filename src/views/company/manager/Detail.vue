<template>
  <div class="header">
    <el-link @click="goBack" type="primary" :underline="false">
      <el-icon>
        <ArrowLeft/>
      </el-icon>
      返回列表
    </el-link>

    <div class="rightBtns">
      <el-button
          @click="handleSelected"
          v-if="
          $store.getters.userInfo.routes.indexOf('/company/manager/edit') >= 0
        "
          type="primary"
      >编辑
      </el-button
      >
      <el-button
          @click="deleteItem"
          v-if="
          $store.getters.userInfo.routes.indexOf('/company/manager/delete') >= 0
        "
          type="danger"
      >删除
      </el-button
      >
    </div>
  </div>

  <el-row class="detail-form">
    <template v-for="field in fields" :key="field.id">
      <el-col :sm="8" :md="4" class="detail-item detail-label">
        <div v-html="field.label"/>
      </el-col>
      <el-col :sm="16" :md="20" class="detail-item detail-content">
        <div
            v-if="
            field.id != 'interview' &&
            field.id != 'reportUrl' &&
            field.id != 'reportUrl2' &&
            field.id != 'bpUrl'
          "
            v-html="data[field.id] ? data[field.id] : ''"
        ></div>
        <div
            v-if="
            field.id == 'interview' ||
            field.id == 'reportUrl' ||
            field.id == 'reportUrl2' ||
            field.id == 'bpUrl'
          "
            class=""
        >
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

  <edit-company
      v-if="selected !== undefined"
      :company="selected"
      @close="selected = undefined"
  />
</template>

<script setup>
import {ArrowLeft} from "@element-plus/icons-vue";
import {onMounted, ref, defineProps} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import EditCompany from "@/views/company/manager/EditCompany";
import {useRouter} from "vue-router";

const router = useRouter();

// import base from "@/request/base";

import company from "@/request/api/company";

const props = defineProps({id: {required: true}});

const fields = [
  {id: "name", label: "企业名称", fixed: "left"},
  {id: "introduction", label: "项目简介"},
  {id: "mainBusiness", label: "主营业务"},
  {id: "participants", label: "参与人员"},
  {id: "sign", label: "行业分类"},
  {id: "signSecond", label: "二级行业分类"},
  {id: "sign2", label: "自定义标签"},
  {id: "actions", label: "后续动作"},
  {id: "remark", label: "备注"},
  {id: "location", label: "企业全称和地点"},
  {id: "interview2", label: "访谈情况"},
  {id: "reportUrl", label: "行研报告"},
  {id: "reportUrl2", label: "信息收集"},
  {id: "bpUrl", label: "bp上传"},
  {id: "timePoint", label: "回访时点"},
  {id: "timeContent", label: "消息内容"},
  // { id: "projectType", label: "项目归类" },
  {id: "source", label: "项目来源"},
  {id: "financing", label: "融资情况"},
  {id: "financials", label: "财务情况"},
  {id: "createdTime", label: "创建时间"},
  {id: "createdBy", label: "创建人"},
  {id: "updatedTime", label: "修改时间"},
  {id: "updatedBy", label: "修改人"},
];

const handleSelected = () => {
  // selected.value=JSON.parse(sessionStorage.getItem('BPCurrentRow'))
  selected.value = copyData.value;
  console.log("copyData.value", copyData.value);
};

const deleteItem = () => {
  let row = JSON.parse(sessionStorage.getItem("BPCurrentRow"));
  ElMessageBox.confirm("确定删除项目：" + row.name + "?", "删除项目", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(() => {
        company.manager.delete(row.id).then((res) => {
          if (res) {
            ElMessage.success("删除成功");
            router.push("/company/manager");
          } else {
            ElMessage.error("删除失败");
          }
        });
      })
      .catch(() => {
      });
};

const data = ref({});
const copyData = ref({});

const selected = ref(undefined);

onMounted(async () => {
  console.log(router.currentRoute.value)
  if (props.id) {
    data.value = await company.manager.detail(props.id);
    copyData.value = JSON.parse(JSON.stringify(data.value));

    data.value.interview = data.value.interview
        ? JSON.parse(data.value.interview)
        : [];
    data.value.reportUrl = data.value.reportUrl
        ? JSON.parse(data.value.reportUrl)
        : [];
    data.value.reportUrl2 = data.value.reportUrl2
        ? JSON.parse(data.value.reportUrl2)
        : [];
    data.value.bpUrl = data.value.bpUrl ? JSON.parse(data.value.bpUrl) : [];
    data.value.actions = JSON.parse(data.value.actions);
    data.value.actions = data.value.actions[data.value.actions.length - 1];
  }
});

const handleDownload = async (file) => {
  let arr = file.response.data.split("/");
  let res = await company.manager.openUrl({fileName: arr[arr.length - 1]});
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

let goBack = () => {
  let queryParams = router.currentRoute.value.query
  if (queryParams && queryParams.back) delete queryParams.back
  router.push({path: '/company/manager', query: router.currentRoute.value.query})
}
</script>

<style scoped>
.header {
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
