<template>
  <el-card class="homepage-header">
    <el-row>
      <el-col :span="24">
        <el-avatar size="large" :src="$store.getters.userInfo.avatar ? $store.getters.userInfo.avatar : avatar"/>
        <span :span="20">
        <span class="header-username">{{ $store.getters.userInfo.name }}</span>
        <span class="header-userinfo"> 欢迎登录先文基金信息管理系统 </span>
      </span>
      </el-col>
    </el-row>
  </el-card>
  <el-row class="homepage-content">
    <el-col :span="24">
      <workplace></workplace>
    </el-col>
  </el-row>
</template>

<script setup>
import avatar from '@/assets/avatar.png'
import Workplace from "@/views/home/workspace/Index";
</script>

<style scoped>
.homepage-header {
  margin-bottom: 20px;
}

.header-username {
  font-size: 20px;
  line-height: 28px;
  height: 56px;
  position: absolute;
  top: 0;
  margin-left: 25px;
}

.header-userinfo {
  position: absolute;
  top: 45px;
  left: 81px;
  color: var(--el-disabled-text-color);
  font-size: 14px;
}
</style>