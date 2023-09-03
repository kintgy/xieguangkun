<template>
  <el-dialog v-model="dialogShow" :title="user.id ? '编辑用户' : '新增用户'">
    <el-form label-position="top"
             ref="formRef"
             :model="form"
             :rules="rules">
      <el-row justify="space-around" :gutter="20">
        <el-col :sm="24" :md="12">
          <el-form-item prop="userName" label="用户名">
            <el-input v-model="form.userName" :disabled="props.user.id === form.id"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item prop="name" label="姓名">
            <el-input v-model="form.name"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item prop="passWord" label="密码">
            <el-input type="password"
                      v-model="form.passWord"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item prop="rePassWord" label="再次确认">
            <el-input type="password"
                      v-model="form.rePassWord"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="role" label="角色">
            <el-checkbox-group v-model="form.roles">
              <el-checkbox v-for="role in roleList" :key="role.code" :label="role.id">{{ role.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogShow=false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>

</template>

<script setup>
import {ref, defineProps} from "vue";
import api from "@/request/api/admin/user";
import {ElMessage} from "element-plus";

const props = defineProps({
  user: {type: Object, required: true},
  roleList: {required: true}
})

const dialogShow = ref(true)

const formRef = ref()
const form = ref({
  id: props.user.id ? props.user.id : 0,
  userName: props.user.userName ? props.user.userName : '',
  name: props.user.name ? props.user.name : '',
  passWord: props.user.passWord ? props.user.passWord : '',
  rePassWord: '',
  roles: props.user.roles ? props.user.roles : [],
})

const rules = {
  userName: {required: true, message: '姓名不能为空', trigger: 'blur'},
  passWord: {required: true, message: '密码不能为空', trigger: 'blur'},
  rePassWord: {
    validator: async (rule, val, callback) => {
      if (val !== form.value.passWord && props.user.passWord !== form.value.passWord) {
        callback(new Error('两次输入的密码应该一致'))
      } else {
        callback()
      }
    }, trigger: 'blur'
  },
}

const submit = async () => {
  const result = await formRef.value.validate()
  if (!result) return

  const res = await api.manager.save(form.value)
  if (res) return ElMessage.success({
    message: '保存成功', duration: 1000, onClose() {
      dialogShow.value = false
      location.reload()
    }
  })
  ElMessage.error({message: '保存失败'})
}
</script>

<style scoped>

</style>