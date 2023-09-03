<template>
  <el-dialog
    v-model="dialogShow"
    :title="role.name ? '编辑 ' + role.name : '新增角色'"
    @close="$emit('close', {})"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="80px"
    >
      <el-form-item prop="name" label="角色名">
        <el-input v-model="form.name" :disabled="!editable" />
      </el-form-item>
      <el-form-item prop="code" label="角色编码">
        <el-input
          v-model="form.code"
          placeholder="如：ROLE_XXX"
          :disabled="!editable"
        />
      </el-form-item>
      <el-form-item prop="routes" label="权限">
        <el-tree
          :data="getRouteTree()"
          :show-checkbox="true"
          node-key="path"
          :default-checked-keys="role.routes ? role.routes : []"
          @check="checkNodes"
        >
          <template #default="{ data }">
            <el-col v-if="!data.meta.public" :lg="12" :md="24"
              >{{ data.meta.title }}: {{ data.name }}</el-col
            >
          </template>
        </el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogShow = false">取消</el-button>
      <el-button @click="saveRole" type="primary">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { getCurrentInstance, ref, defineProps, defineEmits } from "vue";
import user from "@/request/api/admin/user";
import { ElMessage } from "element-plus";

const props = defineProps({
  role: { required: true },
  editable: { required: true },
});
defineEmits(["close"]);

const { proxy } = getCurrentInstance();
const dialogShow = ref(true);
const formRef = ref();

const form = ref(
  Object.assign(
    {
      id: 0,
      name: "",
      code: "",
      routes: "",
    },
    props.role
  )
);

const rules = ref({
  name: { required: true, message: "请输入角色名", trigger: "blur" },
  code: { required: true, message: "请输入角色编码", trigger: "blur" },
});

const getRouteTree = () => {
  let result = [];
  proxy.$router.getRoutes().forEach((route) => {
    if (!route.meta.public && route.meta.header) {
      if (route.children) {
        route.children.forEach((item, idx) => {
          route.children[idx] = Object.assign(item, {
            disabled: !props.editable,
          });
        });
      }
      result.push(Object.assign(route, { disabled: !props.editable }));
    }
  });
  console.log("menutree", result);
  return result;
};

const checkNodes = (data, checkedData) => {
  form.value.routes = checkedData.checkedKeys;
};

const saveRole = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    const res = await user.role.save(form.value);
    if (res)
      return ElMessage.success({
        message: "保存成功",
        duration: 1000,
        onClose() {
          dialogShow.value = false;
          // location.reload();
        },
      });
    ElMessage.error({ message: "保存失败" });
  });
};
</script>
