<template>
  <el-menu mode="horizontal" menu-trigger="click" :ellipsis="false">
    <el-menu-item
      index="0"
      class="unset-hover system-logo"
      @click="$router.push({ name: 'Index' })"
    >
      <el-row>
        <el-space size="large">
          <img src="~assets/logo.jpg" />
          <span>先文基金数据库</span>
        </el-space>
      </el-row>
    </el-menu-item>
    <div class="flex-grow"></div>
    <el-menu-item v-if="$store.getters.isLogged" index="2" class="unset-hover">
      <div
      @click="$router.push(`/notification/page`)"
      >
        <el-icon>
          <Bell />
        </el-icon>
        <i v-if="messageVisiable" class="redPoint"></i>
      </div>
    </el-menu-item>

    <el-sub-menu
      v-if="$store.getters.isLogged"
      index="3"
      :title="$store.getters.userInfo.name"
    >
      <template #title>
        <el-space>
          <el-avatar
            :src="
              $store.getters.userInfo.avatar
                ? $store.getters.userInfo.avatar
                : avatar
            "
          />
          <span>{{ $store.getters.userInfo.name }}</span>
        </el-space>
      </template>
      <el-menu-item v-if="$store.getters.userInfo.name" @click="logout">
        <el-icon>
          <switch-button />
        </el-icon>
        退出登录
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { getCurrentInstance, onMounted,ref } from "vue";
import { Bell, SwitchButton } from "@element-plus/icons-vue";
import avatar from "@/assets/avatar.png";
import emitter from "@/utils/mitt";
import api from "@/request/api/notification";

const { proxy } = getCurrentInstance();

const messageVisiable=ref(false)
onMounted(() => {
  emitter.on("searchMessage", () => {
    getMessage();
  });
});

const getMessage = async () => {
  let res = await api.getMessage(JSON.parse(localStorage.getItem('user')).userId);
  messageVisiable.value=res
  if(res&&sessionStorage.getItem('firstLogin')==undefined){
    // console.log('aaaaaaa')
    let resMessage= await api.getMessage2(JSON.parse(localStorage.getItem('user')).userId);
    // console.log('resMessage',resMessage)
    let message=resMessage.join('、')

    //有未读消息
    ElMessageBox.alert(`${message}`, '提示', {
    confirmButtonText: '确定',
  })
  sessionStorage.setItem('firstLogin',false)
    
  }
};

const logout = () => {
  ElMessageBox.confirm("确定退出登录?", "退出登录", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await proxy.$store.dispatch("EDIT_USERINFO", undefined);
      if (proxy.$store.getters.isLogged) {
        ElMessage.error("退出登录失败");
      } else {
        ElMessage.success({
          message: "成功退出登录",
          duration: 1000,
          onClose: () => {
            proxy.$router.push({ path: "/login" });
          },
        });
      }
    })
    .catch(() => {});
};
</script>
<style lang="less" scoped>
.unset-hover {
  position: relative;
  .redPoint {
    position: absolute;
    right: 23px;
    top: 20px;
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background-color: red;
    z-index: 9;
  }
}
</style>