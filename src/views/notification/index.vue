<template>
  <search-form-content :fields="fields" :fetch-data="fetchUsers">
    <template #operations>
      <el-table-column
        label="操作"
        min-width="150"
        fixed="right"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <el-space>
            <el-link
              type="primary"
              :underline="false"
              @click="turnToLookPage(scope.row)"
              >查看
            </el-link>
            <el-link type="primary" :underline="false" @click="changeState(scope.row,1)"
              >标记为已读
            </el-link>
            <el-link type="primary" :underline="false" @click="changeState(scope.row,0)"
              >标记为未读
            </el-link>
          </el-space>
        </template>
      </el-table-column>
    </template>
  </search-form-content>
</template>

<script setup>
import SearchFormContent from "@/components/SearchFormContent";
import api from "@/request/api/notification";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const fields = [
  { id: "status", label: "状态" },
  { id: "content", label: "消息内容" },
  { id: "type", label: "类型" },
];

const fetchUsers = async (params) => {
  let userId = JSON.parse(localStorage.getItem("user")).userId;
  params.userId = userId;
  let dataList = await api.index(params);
  dataList.data.forEach((item) => {
    item.status = item.mid ? "已处理" : "未处理";
    item.type=item.type=='bp'?'bp':'投后';
  });
  return dataList;
};

const turnToLookPage = async (row) => {
  if (row.type == "bp") {
    router.push(`/company/manager/get/${row.id}`);
  } else {
    router.push(`/invested/investedList/get/${row.cid}`);
  }
};
const changeState = async (row,val) => {
  await api.changeStatus({
    messageId: row.id,
    userId: JSON.parse(localStorage.getItem("user")).userId,
    status: val,
  });
  location.reload();
};

const roles = ref([]);
onMounted(async () => {
  console.log(roles)
  // let userId=JSON.parse(localStorage.getItem('user')).userId
  // let res = await api.index({ page: 1, limit: 10000 ,userId:userId});
  // roles.value = res && res.data ? res.data : [];
});
</script>

<style scoped></style>
