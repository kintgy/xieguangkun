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
      <template
        v-if="
          true
        "
      >
        <el-button
          type="primary"
          style="margin-left: 10px"
          :underline="false"
          v-if="$store.getters.userInfo.routes.indexOf('/fund/fundList/add') >= 0"
          @click="selected = {}"

          >新增基金
        </el-button>
      </template>
    </template>
    <template #columns>
      <el-table-column label="序号" align="center" header-align="center" fixed type="index" width="60" />

      <el-table-column 
      fixed 
      prop="name" 
      show-overflow-tooltip
      label="基金名称" 
      width="150" 
      style="color:red"
      >
      <template #default="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>
    </template>
  </search-form-content>
  <edit-company
    v-if="selected !== undefined"
    :fund="selected"
    @close="selected = undefined"
  />
</template>

<script setup>
import SearchFormContent from "@/components/SearchFormContent";
import fund from "@/request/api/fund";
// import { onMounted, computed, ref } from "vue";
import { onMounted, ref } from "vue";
// import UploadFile from "@/components/UploadFile";
import Detail from "@/views/fund/fundDetail/index";
// import { ElMessage, ElMessageBox } from "element-plus";
import EditCompany from "@/views/fund/fundList/EditFund";
import { useRouter } from 'vue-router'
const router = useRouter()

const fields = ref([
  // { id: "index", label: "序号" },
  // { id: "name", label: "基金名称" },
  { id: "guanliren", label: "管理人" },
  { id: "qixian", label: "期限" },
  { id: "guimo", label: "规模" },
  { id: "chenglishijian", label: "成立时间" },
  { id: "dangqianzhuangtai", label: "状态" },
  { id: "jingli", label: "基金经理" },
  { id: "yitoujine", label: "已投金额" },
]);
const items = {
  name: { label: "关键字" },
  // sign: { label: "标签" },
};

onMounted(async () => {
});

const selected = ref(undefined);


const handleCellClick=(row,column)=>{
  sessionStorage.setItem('FundCurrentRow',JSON.stringify(row))
  if(JSON.parse(JSON.stringify(column)).label=='基金名称'){
    // router.push(`/company/manager/get/${row.id}`)

    router.push(`/fund/fundList/get/${row.id}`)
  }
}


const fetchData = async (params) => {
  let currData = await fund.manager.index(params);
  return currData;
};


const refreshPage = () => {
  location.reload();
};
</script>

<style scoped>
</style>