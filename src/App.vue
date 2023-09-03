<template>
  <el-container>
    <el-header class="page-header">
      <header-content></header-content>
    </el-header>
    <el-container
      :class="'page-content' + ('Index' === $route.name ? ' homepage' : '')"
    >
      <template v-if="$store.getters.isLogged">
        <el-button
          class="btn-router-menu opened"
          circle
          plain
          v-if="showMenu"
          :icon="DArrowLeft"
          @click="showMenu = false"
        />
        <el-button
          class="btn-router-menu closed"
          round
          plain
          v-else
          :icon="DArrowRight"
          @click="showMenu = true"
        />
        <el-aside v-if="showMenu" width="250px" class="page-sidebar">
          <router-sidebar></router-sidebar>
        </el-aside>
      </template>

      <el-main
        :class="'main-content' + (showMenu ? ' show-router-menu' : '')"
        v-loading="$store.getters.isLoading"
      >
        <render-breadcrumb v-if="$store.getters.isLogged" />
        <el-scrollbar class="page-main">
          <el-row v-if="isSubmenu(currentRoute)">
            <el-col
              :lg="6"
              :md="12"
              :sm="24"
              v-for="route in currentRoute.children"
              :key="route.path"
            >
              <el-link
                @click="$router.push({ name: route.name })"
                type="primary"
                >{{ route.meta.title }}</el-link
              >
            </el-col>
          </el-row>
          <template v-else>
            <el-card v-if="tabs && tabs.length > 0">
              <el-menu
                mode="horizontal"
                :default-active="pageTab"
                class="page-main-tabs"
              >
                <el-menu-item
                  v-for="item in tabs"
                  :key="item.tab"
                  :index="item.tab"
                  @click="toTabPage(item.tab)"
                >
                  {{ item.title }}
                </el-menu-item>
              </el-menu>
              <router-view :name="pageTab"></router-view>
            </el-card>
            <router-view v-else :name="pageTab"></router-view>
          </template>
          <slot name="content"></slot>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import HeaderContent from "@/views/base/HeaderContent";
import { DArrowRight, DArrowLeft } from "@element-plus/icons-vue";
import { getCurrentInstance, ref, watchEffect } from "vue";
import RouterSidebar from "@/views/base/RouterSidebar";
import RenderBreadcrumb from "@/views/base/RenderBreadcrumb";

const { proxy } = getCurrentInstance();
let showMenu = ref(document.body.clientWidth > 780);
const currentRoute = ref({});
const tabs = ref([]);
const pageTab = ref("default");

const getCurrentRoute = () => {
  if (!proxy.$route || !proxy.$route.matched) return;
  proxy.$route.matched.forEach((route) => {
    if (proxy.$route.name === route.name) {
      currentRoute.value = route;
    }
  });
};

const isSubmenu = (route) => {
  return (
    route.meta &&
    !route.meta.page &&
    route.children &&
    route.children.length > 0
  );
};

const initPageTabs = () => {
  if (!proxy.$store || !proxy.$store.getters || !proxy.$store.getters.isLogged)
    return;
  tabs.value = [];
  pageTab.value = "default";
  if (proxy.$route.meta && proxy.$route.meta.page) {
    proxy.$route.matched.forEach((menu) => {
      if (
        proxy.$route.name === menu.name &&
        menu.children &&
        menu.children.length > 0
      ) {
        menu.children.forEach((tab) => {
          if (
            tab.meta.tab &&
            (proxy.$store.getters.userInfo.routes.indexOf(tab.path) >= 0 ||
              tab.meta.public)
          ) {
            tabs.value.push(tab.meta);
            if (
              proxy.$route.params.tab &&
              proxy.$route.params.tab === tab.meta.tab
            ) {
              pageTab.value = tab.meta.tab;
            } else if (1 === tabs.value.length) {
              pageTab.value = tabs.value[0].tab;
            }
          }
        });
      }
    });
  }
};

const toTabPage = (tab) => {
  if (tab !== pageTab.value)
    proxy.$router.push({ name: proxy.$route.name, params: { tab: tab } });
};

watchEffect(() => {
  getCurrentRoute();
  initPageTabs();
});
</script>

<style>
body {
  margin: 0 !important;
}
</style>
