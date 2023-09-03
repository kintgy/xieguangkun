<template>
  <template v-if="'{}' !== JSON.stringify(formItems)">
    <search-form
        ref="searchFormRef"
        :form-items="formItems"
        :fetch-data="refreshData"
        :download="download"
    >
      <template #buttons>
        <slot name="buttons"></slot>
      </template>
    </search-form>
  </template>
  <el-card>
    <el-row v-if="initTotal" class="total-data">
      <span v-for="list in totalData" :key="list.name" class="total-item">
        {{ list.name }}：
        <template v-if="list.value instanceof Object">
          <span class="bolder">{{ list.value.value }}</span>
          <el-tag
              v-if="list.value.rate < 0"
              type="warning"
              effect="plain"
              size="small"
              style="border: 0 !important"
          >
            <i class="el-icon-bottom"></i>{{ list.value.rate }}%
          </el-tag>
          <el-tag
              v-else
              type="success"
              effect="plain"
              size="small"
              style="border: 0 !important"
          >
            <i class="el-icon-top"></i>{{ list.value.rate }}%
          </el-tag>
        </template>
        <template v-else>
          <span class="bolder"> {{ list.value }}</span>
        </template>
      </span>
    </el-row>
    <el-row class="mb-10" v-if="'table' === type" style="width: 100%">
      <init-table
          :table-fields="fields"
          :table-data="data"
          :format-status="formatStatus"
          :span-method="mergeCell"
          :show-summary="showSummary"
          :summary-total="summaryTotal"
          :handleCellClick="handleCellClick"
      >
        <template #operations>
          <slot name="operations"></slot>
        </template>
        <slot name="content"></slot>
        <template #columns>
          <slot name="columns"></slot>
        </template>
      </init-table>
    </el-row>
    <el-row v-else class="mb-10">
      <template v-if="data.length">
        <slot name="content" :data="data"></slot>
      </template>
      <el-empty v-else description="暂无数据" class="el-col-24"></el-empty>
    </el-row>
    <el-row class="mb-10">
      <el-pagination
          v-if="pageData"
          v-model:page-size="pageData.pageSize"
          v-model:current-page="pageData.page"
          :total="pageData.total"
          :page-sizes="['10', '20', '40', '60', '80', '100', '200', '300', '400']"
          @size-change="pageChange"
          @current-change="pageChange"
          layout="total, sizes, prev, pager, next, jumper"
      />
    </el-row>
  </el-card>
</template>

<script setup>
import SearchForm from "@/components/SearchForm";
import {onMounted, ref, defineProps, defineExpose} from "vue";
import filters from "@/base/filters";
import InitTable from "@/components/InitTable";

const props = defineProps({
  type: {default: "table"},
  formItems: {type: Object},
  fetchData: {type: Function},
  initTotal: {type: Function},
  fields: {default: []},
  formatStatus: {type: Function},
  summaryTotal: {type: Function},
  showSummary: {default: false},
  mergeCell: {type: Function},
  download: {default: null},
  handleCellClick: {type: Function},
  page: {type: Number, default: 1},
  limit: {type: Number, default: 20},
});

const searchFormRef = ref(null);
const data = ref([]);
const pageData = ref({page: props.page, pageSize: props.limit, total: 0});
const totalData = ref(props.initTotal ? props.initTotal() : {});

const refreshData = function (params, withPage = true) {
  searchFormRef.value.formRef.validate((valid) => {
    if (!valid) return;
    if (props.fetchData) {
      props
          .fetchData(withPage ? Object.assign(params, pageData.value) : params)
          .then((res) => {
            data.value = res.data;
            pageData.value = res.page;
            console.log('pageData.value', pageData.value)
          })
          .finally(() => {
          });
      if (props.initTotal) {
        props
            .fetchData(
                Object.assign(
                    {total: true},
                    withPage ? Object.assign(params, pageData.value) : params
                )
            )
            .then((res) => {
              totalData.value = filters.setTotalData(res, props.initTotal());
            });
      }
    }
  });
};

const pageChange = () => {
  refreshData(searchFormRef.value.getSearchForm(), true);
};

const getSearchForm = () => {
  return searchFormRef.value.getSearchForm()
}

const getTableData = () => {
  return data.value
}

const getPageData = () => {
  return pageData.value
}

onMounted(() => {
  if ("{}" === JSON.stringify(props.formItems) && props.fetchData) {
    props
        .fetchData({})
        .then((res) => {
          data.value = res.data;
          pageData.value = res.page;
        })
        .finally(() => {
        });
  }
});

defineExpose({getSearchForm, getTableData, getPageData})
</script>

