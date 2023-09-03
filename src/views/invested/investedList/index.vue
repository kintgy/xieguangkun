<template>
  <detail v-if="$route.params.id" :id="$route.params.id"></detail>
  <search-form-content
    v-else
    :form-items="items"
    :fields="fields"
    :fetch-data="fetchData"
    :handleCellClick="handleCellClick"
  >
    <template #buttons>
      <template v-if="true">
        <el-button
          type="primary"
          style="margin-left: 10px"
          :underline="false"
          v-if="
            $store.getters.userInfo.routes.indexOf(
              '/invested/investedList/add'
            ) >= 0
          "
          @click="selected = {}"
          >新增投后
        </el-button>
      </template>
    </template>
    <template #columns>
      <el-table-column
        label="序号"
        align="center"
        header-align="center"
        fixed
        type="index"
        width="60"
      />
      <el-table-column
        fixed
        prop="name"
        show-overflow-tooltip
        label="项目名称"
        width="150"
        style="color: red"
      >
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
    </template>
  </search-form-content>
  <edit-invested
    v-if="selected !== undefined"
    :invested="selected"
    @close="selected = undefined"
  />
</template>

<script setup>
import SearchFormContent from "@/components/SearchFormContent";
import invested from "@/request/api/invested";
// import { onMounted, computed, ref } from "vue";
import { onMounted, ref } from "vue";
// import UploadFile from "@/components/UploadFile";
import Detail from "@/views/invested/investedDetail/index";
// import { ElMessage, ElMessageBox } from "element-plus";
import EditInvested from "@/views/invested/investedList/EditInvested";
import { useRouter } from "vue-router";
const router = useRouter();

const fields = ref([
  // { id: "index", label: "序号" },
  // { id: "index", label: "序号" },
  { id: "jijinName", label: "隶属基金" },
  // { id: "name", label: "项目名称" },
  { id: "jine", label: "投资金额(万)" },
  { id: "wanchengtouzi", label: "已完成投资金额(万)" },
  { id: "shijian", label: "投资时间" },
  // { id: "caiwubaogao", label: "财务报告" },
  // { id: "shenjibaogao", label: "审计报告" },
  { id: "beizhu", label: "备注" },
]);
const items = {
  name: { label: "关键字" },
  // sign: { label: "标签" },
};

onMounted(async () => {});

const selected = ref(undefined);

const handleCellClick = (row, column) => {
  sessionStorage.setItem("InvestedCurrentRow", JSON.stringify(row));
  if (JSON.parse(JSON.stringify(column)).label == "项目名称") {
    router.push(`/invested/investedList/get/${row.id}`);
  }
};

const fetchData = async (params) => {
  let currData = await invested.manager.index(params);
  return currData;
};

const refreshPage = () => {
  location.reload();
};
</script>

<style scoped>
</style>