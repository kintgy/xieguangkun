<template>
  <search-form-content
    :form-items="items"
    :fields="fields"
    :fetch-data="fetchUsers"
  >
    <template #buttons>
      <el-button @click="selected = {}">添加用户</el-button>
      <upload-file
        :btn-text="'总表上传'"
        action="/company/import"
        :example="'BP示例文件.xlsx'"
        @close="refreshPage"
      />
    </template>
    <template #operations>
      <el-table-column
        label="操作"
        min-width="150"
        fixed="right"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="selected = scope.row"
            >编辑
          </el-link>
          <el-link
            type="primary"
            :underline="false"
            @click="handleDelete(scope.row)"
            > &nbsp;&nbsp;&nbsp;删除
          </el-link>
        </template>
      </el-table-column>
    </template>
  </search-form-content>
  <edit-user
    v-if="selected !== undefined"
    :user="selected"
    :role-list="roles"
    @close="selected = undefined"
  />
</template>

<script setup>
import UploadFile from "@/components/UploadFile";
import SearchFormContent from "@/components/SearchFormContent";
import api from "@/request/api/admin/user";
import EditUser from "@/views/admin/user/manager/EditUser";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";

const fields = [
  { id: "userName", label: "用户名" },
  { id: "name", label: "姓名" },
];
const items = {
  name: { label: "用户名/姓名" },
};

const selected = ref(undefined);

const fetchUsers = async (params) => {
  return await api.manager.index(params);
};

const roles = ref([]);
onMounted(async () => {
  let res = await api.role.index({ page: 1, limit: 10000 });
  roles.value = res && res.data ? res.data : [];
});

const refreshPage = () => {
  location.reload();
};

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除用户 ${row.userName}`, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      api.role.delete(row.id).then((res) => {
        if (res) {
          ElMessage.success("删除成功");
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {});
};
</script>

<style scoped>
</style>