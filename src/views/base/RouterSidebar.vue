<template>
  <el-menu :default-active="$route.path" :router="true">
    <template v-for="menu in routes" :key="menu.name">
      <el-sub-menu
        v-if="isVisitable(menu) && menu.meta.header"
        :index="menu.path"
      >
        <template #title>{{ menu.meta.title }}</template>
        <template v-for="submenu in menu.children" :key="submenu.name">
          <el-sub-menu
            v-if="isVisitable(submenu) && submenu.meta.group"
            :index="submenu.path"
          >
            <template #title>{{ submenu.meta.title }}</template>
            <template v-for="item in submenu.children" :key="item.name">
              <el-menu-item v-if="isVisitable(item)" :index="item.path">{{
                item.meta.title
              }}</el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item
            v-else-if="isVisitable(submenu) && !submenu.meta.group"
            :index="submenu.path"
          >
            {{ submenu.meta.title }}
          </el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item
        v-else-if="isVisitable(menu) && menu.meta.single_page"
        :index="menu.path"
        >{{ menu.meta.title }}
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script setup>
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const routes = proxy.$router.getRoutes();

const isVisitable = (menu) => {
  if (!proxy.$store.getters.isLogged) return false;

  if (menu.meta.hidden) return false;
  if ("Index" === menu.name) return true;
  if (menu.meta.public) return true;

  if (menu.children && menu.children.length) {
    let result = false;
    menu.children.forEach((subMenu) => {
      if (isVisitable(subMenu)) result = true;
    });
    return result;
  }

  if (!proxy.$store.getters.userInfo || !proxy.$store.getters.userInfo.routes)
    return false;

  if (proxy.$store.getters.userInfo.routes.indexOf(menu.path) >= 0) return true;
  return false;
};
</script>
