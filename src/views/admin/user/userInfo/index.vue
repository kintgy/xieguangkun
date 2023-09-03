<template>
  <search-form-content :fields="fields" :fetch-data="fetchData">
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
          @click="dialogFormVisible = true"
          >新增人员信息
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
    </template>
    <template #operations>
      <el-table-column
        label="操作"
        min-width="80"
        fixed="right"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <el-link
            type="danger"
            :underline="false"
            @click="handleDelete(scope.row)"
            >删除
          </el-link>
        </template>
      </el-table-column>
    </template>
  </search-form-content>

  <el-dialog v-model="dialogFormVisible" title="新增人员信息">
    <el-form :model="personInfo">
      <el-form-item label="人员姓名">
        <el-input
          placeholder="请输入"
          v-model="personInfo.name"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="人员类型">
        <el-select v-model="personInfo.type" placeholder="">
          <el-option label="经理" value="经理" />
          <el-option label="风控" value="风控" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import SearchFormContent from "@/components/SearchFormContent";
import userInfoApi from "@/request/api/admin/userInfo";
import { onMounted, ref, reactive } from "vue";
import { ElMessage } from "element-plus";

const fields = ref([
  { id: "name", label: "姓名" },
  { id: "type", label: "类型" },
]);

onMounted(async () => {});

let personInfo = reactive({
  name: "",
  type: "",
});
const handleConfirm = async () => {
  let params = {
    name: personInfo.name,
    type: personInfo.type,
  };
  const res = await userInfoApi.manager.save(params);
  if (res)
    return ElMessage.success({
      message: "保存成功",
      duration: 1000,
      onClose() {
        dialogFormVisible.value = false;
        location.reload();
      },
    });
  ElMessage.error({ message: "保存失败" });
};
const handleDelete = async (row) => {
  const res = await userInfoApi.manager.delete(row.id);
  if (res)
    return ElMessage.success({
      message: "删除成功",
      duration: 1000,
      onClose() {
        dialogFormVisible.value = false;
        location.reload();
      },
    });
  ElMessage.error({ message: "删除失败" });
};

let dialogFormVisible = ref(false);

const fetchData = async (params) => {
  let currData = await userInfoApi.manager.index(params);
  return currData;
};
</script>

<style scoped></style>
