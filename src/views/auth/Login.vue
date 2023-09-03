<template>
  <el-row justify="center">
    <el-col class="login-header"
            :sm="20"
            :md="8">
      <el-row justify="center">登录</el-row>
    </el-col>
  </el-row>
  <el-row justify="center" class="login-form">
    <el-col :sm="20" :md="6">
      <el-form label-position="top"
               ref="formRef"
               :model="form"
               :rules="rules">
        <el-form-item prop="userName">
          <el-input placeholder="姓名"
                    v-model="form.userName"/>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input type="password"
                    placeholder="密码"
                    v-model="form.passWord"/>
        </el-form-item>
        <el-form-item>
          <el-button class="submit-btn"
                     type="primary"
                     @click="submit">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import auth from "@/request/api/auth";

const {proxy} = getCurrentInstance()

const formRef = ref()
const form = ref({
  userName: '',
  passWord: ''
})
const rules = ref({
  userName: {required: true, message: '姓名不能为空', trigger: 'blur'},
  passWord: {required: true, message: '密码不能为空', trigger: 'blur'}
})

const submit = async () => {
  const result = await formRef.value.validate()
  if (!result) return

  const res = await auth.login(form.value)
  await proxy.$store.dispatch('EDIT_USERINFO', res)
  if (proxy.$route.query && proxy.$route.query.goto) return proxy.$router.replace({path: proxy.$route.query.goto})
  proxy.$router.replace({name: 'Index'})
}

onMounted(async () => {
  if (proxy.$store.getters.isLogged) {
    return ElMessage.warning({
      message: '您已经登录了', duration: 1000, onClose() {
        proxy.$router.replace({name: 'Index'})
      }
    })
  }
})

</script>

<style lang="less" scoped>
.login-header {
  font-size: 30px;
  font-weight: 400;
  padding: 0 0 20px 0;
  align-items: center;
}
</style>