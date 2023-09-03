<template>
  <search-form-content :fields="fields" :fetch-data="fetchData">
    <template #buttons>
      <template v-if="true">
        <el-button
          type="primary"
          style="margin-left: 10px"
          :underline="false"
          @click="openDialg('新增')"
          >新增一级标签
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
          <el-space>
            <el-link
              type="primary"
              size="small"
              @click="openDialg('编辑', scope.row)"
              >编辑
            </el-link>
            <el-link type="primary" size="small" @click="moveup(scope.row)"
              >上移
            </el-link>
            <el-link type="primary" size="small" @click="movedown(scope.row)"
              >下移
            </el-link>
            <el-link type="danger" size="small" @click="handleDelete(scope.row)"
              >删除
            </el-link>
          </el-space>
        </template>
      </el-table-column>
    </template>
  </search-form-content>

  <el-dialog v-model="dialogFormVisible" :title="title">
    <el-form :model="labelForm">
      <el-form-item label="一级标签">
        <el-input
          placeholder="请输入"
          v-model="labelForm.name"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="二级标签" v-if="title != '新增'">
        <el-input
          placeholder="请输入"
          v-model="labelForm.name2"
          type="textarea"
          clearable
          :row="3"
        />
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
import labelApi from "@/request/api/admin/labelManage";
import { onMounted, ref, reactive } from "vue";
import { ElMessage } from "element-plus";

const fields = ref([
  { id: "name", label: "一级标签" },
  { id: "name2", label: "二级标签" },
]);
let dialogFormVisible = ref(false);
let title = ref("新增");

onMounted(async () => {});

let labelForm = reactive({
  name: "",
  name2: "",
});
const handleConfirm = async () => {
  let params = {
    id: labelForm.id,
    name: labelForm.name,
    name2: labelForm.name2,
  };
  const res = await labelApi.manager.save(params);
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
const openDialg = async (tit, row) => {
  title.value = tit;
  dialogFormVisible.value = true;
  if (tit == "新增") {
    labelForm.id = "";
    labelForm.name = "";
    labelForm.name2 = "";
  } else {
    labelForm.id = row.id;
    labelForm.name = row.name;
    labelForm.name2 = row.name2;
  }
};
const handleDelete = async (row) => {
  const res = await labelApi.manager.delete(row.id);
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
const moveup = async (row) => {
  const res = await labelApi.manager.up(row.id);
  if (res)
    return ElMessage.success({
      message: "操作成功",
      duration: 1000,
      onClose() {
        dialogFormVisible.value = false;
        location.reload();
      },
    });
  ElMessage.error({ message: "操作失败" });
};
const movedown = async (row) => {
  const res = await labelApi.manager.down(row.id);
  if (res)
    return ElMessage.success({
      message: "操作成功",
      duration: 1000,
      onClose() {
        dialogFormVisible.value = false;
        location.reload();
      },
    });
  ElMessage.error({ message: "操作失败" });
};

const fetchData = async (params) => {
  let currData = await labelApi.manager.getTableData(params);
  return currData;
};
</script>

<style scoped></style>
