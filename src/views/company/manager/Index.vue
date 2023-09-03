<template>
  <detail v-if="$route.params.id" :id="$route.params.id"></detail>
  <search-form-content
      ref="searchFormContent"
      v-else
      :form-items="items"
      :fields="fields"
      :fetch-data="fetchData"
      :handleCellClick="handleCellClick"
      :page="$route.query.page ? $route.query.page : 1"
      :limit="$route.query.pageSize ? $route.query.pageSize : 20"
  >
    <template #buttons>
      <template
          v-if="
          $store.getters.userInfo.routes.indexOf('/company/manager/add') >= 0
        "
      >
        <!-- <upload-file
          :btn-text="'BP上传'"
          action="/company/import"
          :example="'BP示例文件.xlsx'"
          @close="refreshPage"
        /> -->
        <el-button
            type="primary"
            style="margin-left: 10px"
            :underline="false"
            @click="selected = {}"
        >新增项目
        </el-button>
        <el-button
            type="primary"
            style="margin-left: 10px"
            :underline="false"
            @click="handleExport"
        >导出表格
        </el-button>
      </template>
    </template>
    <!--    <template #columns>-->
    <!--      <el-table-column-->
    <!--          label="序号"-->
    <!--          align="center"-->
    <!--          header-align="center"-->
    <!--          sortable-->
    <!--          fixed-->
    <!--          type="index"-->
    <!--          width="60"-->
    <!--      >-->
    <!--        <template #default="scope">-->
    <!--          {{ scope.row.sort }}-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column-->
    <!--          show-overflow-tooltip-->
    <!--          label="企业名称"-->
    <!--          width="150"-->
    <!--      >-->
    <!--        <template #default="scope">-->
    <!--          {{ scope.row.name }}-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--    </template>-->
  </search-form-content>
  <edit-company
      v-if="selected !== undefined"
      :company="selected"
      @close="selected = undefined"
  />
</template>

<script setup>
import SearchFormContent from "@/components/SearchFormContent";
import company from "@/request/api/company";
// import { onMounted, computed, ref } from "vue";
import {onMounted, ref, getCurrentInstance} from "vue";
// import UploadFile from "@/components/UploadFile";
import Detail from "@/views/company/manager/Detail";
// import { ElMessage, ElMessageBox } from "element-plus";
import EditCompany from "@/views/company/manager/EditCompany";
import {useRouter} from "vue-router";

const router = useRouter();

const fields = ref([
  {id: "sort", label: "序号", fixed: true},
  {id: "name", label: "企业名称"},
  {id: "introduction", label: "项目简介"},
  {id: "mainBusiness", label: "主营业务"},
  {id: "participants", label: "参与人员"},
  {id: "actions", label: "后续动作"},
  {id: "remark", label: "备注"},
  {id: "sign", label: "行业分类"},
  {id: "sign2", label: "行业分类和特性标签"},
  {id: "location", label: "公司所在地"},
  {id: "interview", label: "访谈情况"},
  {id: "reportUrl", label: "信息收集&行研报告"},
  {id: "timePoint", label: "回访时点"},
  // { id: "projectType", label: "项目归类" },
  {id: "source", label: "项目来源"},
  {id: "financing", label: "融资情况"},
  {id: "financials", label: "财务情况"},
  {id: "createdTime", label: "创建时间"},
  {id: "createdBy", label: "创建人"},
  {id: "updatedTime", label: "修改时间"},
  {id: "updatedBy", label: "修改人"},
]);
let queryParams = router.currentRoute.value.query
const items = {
  searchColum: {
    type: "selector",
    label: "查询列",
    value: queryParams && queryParams.searchColum ? queryParams.searchColum : '',
    options: [
      {name: "企业名称 ", id: "name"},
      {name: "主营业务 ", id: "main_business"},
      {name: "项目来源 ", id: "source"},
      {name: "参与人员 ", id: "participants"},
      {name: "项目简介 ", id: "introduction"},
      {name: "企业全称和地点 ", id: "location"},
      {name: "行业分类 ", id: "sign"},
      {name: "二级行业分类 ", id: "sign_second"},
      {name: "行业分类和特性标签 ", id: "sign2"},
      {name: "全部", id: "all"},
    ],
  },
  searchValue: {
    label: "关键字",
    value: queryParams && queryParams.searchValue ? queryParams.searchValue : '',
  },
  desc: {
    label: "排序",
    type: "selector",
    value: queryParams && queryParams.searchValue ? queryParams.searchValue : "1",
    options: [
      {name: "序号正序", id: "0"},
      {name: "序号倒序", id: "1"},
      {name: "创建时间正序", id: "2"},
      {name: "创建时间倒序", id: "3"},
    ],
  }
};

const {proxy} = getCurrentInstance();
const handleExport = async () => {
  const pageData = proxy.$refs.searchFormContent.getPageData();
  const searchForm = proxy.$refs.searchFormContent.getSearchForm();
  let data = {
    searchColum: searchForm.searchColum,
    searchValue: searchForm.searchValue,
    page: pageData.page,
    pageSize: pageData.pageSize,
    total: pageData.total,
  };
  let res = await company.manager.export(data);
  console.log("resresres", res);
  let blob = new Blob([res.data], {
    // type: res.data.type,
  });
  console.log("blob", blob);
  let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向返回的文件流
  // 创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
  let a = document.createElement("a");
  a.href = url;
  // a.download = decodeURI(res.headers.filename);
  a.download = "BP列表.xls";
  a.click();
  // 释放这个临时的对象url
  window.URL.revokeObjectURL(url);
  // window.open(url)
};

onMounted(async () => {
  let res = await company.settings.DataList();
  fields.value = [
    Object.assign({id: 'sort', label: '序号', fixed: 'left'}, window.innerWidth >= '768' ? {width: 100} : {width: 60,}),
    Object.assign({
      id: 'name', label: '企业名称', class: 'company-name', fixed: 'left'
    }, window.innerWidth >= '768' ? {width: 150,} : {width: 100}),
  ];
  // let arr=[]
  res.forEach((item) => {
    if (item.isShow) {
      fields.value.push(Object.assign({
        id: item.key1,
        label: item.value,
        // sortable: item.key1 == "createdTime" ? true : false,
        // sortable: item.key1 == "sort" ? true : false,
      }, item.key1 === 'introduction' && window.innerWidth >= '768' ? {fixed: 'left'} : {}));
    }
  });
});

const selected = ref(undefined);

const handleCellClick = (row, column) => {
  sessionStorage.setItem("BPCurrentRow", JSON.stringify(row));
  console.log(column)
  if (column.property == "name") {
    let params = ''
    let formParams = proxy.$refs.searchFormContent.getSearchForm()
    console.log(formParams)
    if (formParams) {
      for (let key in formParams) {
        if (key !== 'total' && undefined !== formParams[key] && null !== formParams[key]) {
          params += `&${key}=${formParams[key]}`
        }
      }
    }
    router.push(`/company/manager/get/${row.id}?back=1${params}`);
  }
};

const fetchData = async (params) => {
  let data = {
    searchColum: params.searchColum,
    searchValue: params.searchValue,
    page: params.page,
    pageSize: params.pageSize,
    total: params.total,
  };
  console.log(params.desc, params.desc == "0" || params.desc == "1");
  if (params.desc == "0" || params.desc == "1") {
    data.desc = params.desc;
  } else {
    console.log(222222222);
    data.time = params.desc == "2" ? "0" : "1";
  }
  let currData = await company.manager.index(data);
  currData.data.forEach((item) => {
    item.actions2 = JSON.parse(JSON.stringify(item.actions));
    item.interview = item.interview ? JSON.parse(item.interview) : [];
    try {
      item.actions = JSON.parse(item.actions);
      item.actions = item.actions[item.actions.length - 1];
    } catch (err) {
    }
    // item.actions = item.actions ? JSON.parse(item.actions).pop : [];
  });
  return currData;
};

// const deleteItem = (row) => {
//   ElMessageBox.confirm("确定删除项目：" + row.name + "?", "删除项目", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning",
//   })
//     .then(() => {
//       company.manager.delete(row.id).then((res) => {
//         if (res) {
//           ElMessage.success("删除成功");
//           location.reload();
//         } else {
//           ElMessage.error("删除失败");
//         }
//       });
//     })
//     .catch(() => {});
// };

const refreshPage = () => {
  location.reload();
};
</script>


<style>
.el-popper {
  max-width: 400px;
}
td.company-name {
  color: var(--el-color-primary) !important;
  cursor: pointer;
  text-align: left !important;
}
</style>
