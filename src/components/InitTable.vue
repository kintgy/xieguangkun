<template>
  <el-table
    :data="tableData"
    :show-summary="showSummary"
    :summary-method="summaryTotal"
    :cell-class-name="formatStatus"
    :span-method="mergeCell"
    @cell-click="handleCellClick"
    :cell-style="cellStyle"
    class="data-table"
    border
  >
    <el-table-column
      v-if="tableType"
      :type="tableType"
      width="55"
    ></el-table-column>
    <slot name="columns"></slot>
    <template v-for="(field, index) in tableFields" :key="field.id">
      <el-table-column
        v-if="field.id"
        header-align="center"
        :prop="field.id"
        :sortable="field.sortable"
        :align="field.align ? field.align : 'center'"
        :show-overflow-tooltip="true"
        :min-width="field.width ? field.width : 150"
        :fixed="field.fixed ? field.fixed : index === 0 ? 'left' : null"
        :class-name="field.class ? field.class : ''"
      >
        <template #header>
          {{ field.label }}
          <el-tooltip
            v-if="field.tips"
            class="item"
            effect="dark"
            :content="field.tips"
            placement="top"
            popper-class="tool-tip"
          >
            <el-icon>
              <info-filled></info-filled>
            </el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          <template v-if="field.id === 'file'">
            <a
              v-if="
                Array.isArray(scope?.row?.[field.id]) &&
                scope.row[field.id].length
              "
              :href="scope.row[field.id]?.[0].url"
              :download="scope.row[field.id]?.[0].name"
            >
              在线查看
              <!--              {{ scope.row[field.id]?.[0].name }}-->
            </a>
            <!--            <span-->
            <!--                v-if="scope.row[field.id].length"-->
            <!--                @click="downloadFile(scope.row[field.id])"-->
            <!--            >-->
            <!--              下载-->
            <!--&lt;!&ndash;              {{ scope.row[field.id]?.[0].name }}&ndash;&gt;-->
            <!--            </span>-->
          </template>
          <template v-if="field.id === 'interview' || field.id === 'reportUrl'">
            <p
              style="color: var(--el-color-primary)"
              @click="handleDownload(subItem)"
              v-for="(subItem, subIndex) in scope.row[field.id]"
              :key="subIndex"
            >
              {{ subItem.name }}
            </p>
          </template>
          <template
            v-else-if="
              typeof (field.content
                ? field.content(scope.row[field.id])
                : scope.row[field.id]) === 'object'
            "
          >
            <el-space>
              <el-tag
                v-for="fieldData in field.content
                  ? field.content(scope.row[field.id])
                  : scope.row[field.id]"
                :key="fieldData"
                size="small"
              >
                {{ fieldData }}
              </el-tag>
            </el-space>
          </template>
          <template v-else-if="field.format">
            {{ field.format(scope.row[field.id]) }}
          </template>
          <template v-else>{{ scope.row[field.id] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        header-align="center"
        :label="field.label"
        :align="field.align ? field.align : 'center'"
        show-overflow-tooltip
        :min-width="field.width ? field.width : 150"
        :fixed="field.fixed ? field.fixed : index === 0 ? 'left' : null"
      >
        <el-table-column
          v-for="item in field.items"
          :key="item.id"
          header-align="center"
          :prop="item.id"
          :label="item.label"
          :align="item.align ? item.align : 'center'"
          show-overflow-tooltip
          :min-width="item.width ? item.width : 150"
          :fixed="item.fixed ? item.fixed : index === 0 ? 'left' : null"
        >
        </el-table-column>
      </el-table-column>
    </template>
    <slot name="operations"></slot>
  </el-table>
</template>

<script setup>
import { defineProps } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";
import company from "@/request/api/company";

defineProps({
  tableData: { type: Array },
  tableFields: { default: [] },
  formatStatus: { type: Function },
  summaryTotal: { type: Function },
  showSummary: { default: false },
  mergeCell: { type: Function },
  tableType: { default: "" },
  handleCellClick: { type: Function },
});

const handleDownload = async (file) => {
  let arr = file.response.data.split("/");
  let res = await company.manager.openUrl({ fileName: arr[arr.length - 1] });
  let blob = new Blob([res.data], {
    // type: res.data.type,
  });
  console.log("blob", blob);
  let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向返回的文件流
  // 创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
  let a = document.createElement("a");
  a.href = url;
  // a.download = decodeURI(res.headers.filename);
  a.download = file.name;
  a.click();
  // 释放这个临时的对象url
  window.URL.revokeObjectURL(url);
  // window.open(url)
};

const cellStyle = ({ column }) => {
  if (
    column.label == "企业名称" ||
    column.label == "基金名称" ||
    column.label == "项目名称"
  ) {
    return {
      color: "#409eff",
    };
  }
};
</script>

<style lang="less">
/deep/.el-tooltip__popper {
  max-width: 400px !important;
  overflow: hidden;
}
</style>
<style lang="less">
.data-table .el-popper{
  max-width: 400px!important;
}
</style>