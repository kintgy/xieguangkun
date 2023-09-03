<template>
  <el-breadcrumb class="page-breadcrumb" v-if="'Index' !== $route.name">
    <template v-for="route in $route.matched" :key="route.path">
      <el-breadcrumb-item v-if="$route.path !== route.path" :to="route">{{ route.meta.title }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else>{{ route.meta.title }}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>