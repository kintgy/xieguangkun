<template>
  <div class="header">
    <el-link href="/fund/fundList" type="primary" :underline="false">
      <el-icon>
        <ArrowLeft />
      </el-icon>
      返回列表
    </el-link>

    <div class="rightBtns">
      <el-button
        @click="handleSelected"
        v-if="
          $store.getters.userInfo.routes.indexOf('/fund/fundList/edit') >= 0
        "
        type="primary"
        >编辑</el-button
      >
      <el-button
        @click="deleteItem"
        v-if="
          $store.getters.userInfo.routes.indexOf('/fund/fundList/delete') >= 0
        "
        type="danger"
        >删除</el-button
      >
    </div>
  </div>

  <el-row class="detail-form">
    <template v-for="field in fields" :key="field.id">
      <el-col :sm="8" :md="4" class="detail-item detail-label">
        <div v-html="field.label" />
      </el-col>
      <el-col :sm="16" :md="20" class="detail-item detail-content">
        <div
          v-if="
            field.id != 'jidubaogao' &&
            field.id != 'niandubaogao' &&
            field.id != 'lp' &&
            field.id != 'yitouxiangmu' &&
            field.id != 'xieyi'
          "
          v-html="data[field.id] ? data[field.id] : ''"
        ></div>
        <div v-if="field.id == 'lp'">
          <span v-for="(subItem, subIndex) in data[field.id]" :key="subIndex">
            LP{{ subIndex + 1 }}:&nbsp;{{ subItem.num }}&nbsp;&nbsp;
          </span>
        </div>
        <div
          v-if="
            field.id == 'jidubaogao' ||
            field.id == 'niandubaogao' ||
            field.id == 'xieyi'
          "
          class=""
        >
          <p
            style="color: var(--el-color-primary); cursor: pointer"
            @click="handleDownload(file)"
            v-for="(file, index) in data[field.id]"
            :key="index"
          >
            {{ file.name }}
          </p>
        </div>
        <div v-if="field.id == 'yitouxiangmu'">
          <div
            v-for="(item, index) in yitouxiangmu"
            :key="index"
            class="yitou-Item"
          >
            <div style="display: inline-block; width: 100px">
              {{ item.name }}
            </div>
            <div style="display: inline-block">{{ item.createdTime }}</div>
          </div>
        </div>
      </el-col>
    </template>
  </el-row>

  <edit-fund
    v-if="selected !== undefined"
    :fund="selected"
    @close="selected = undefined"
  />
</template>

<script setup>
import { ArrowLeft } from "@element-plus/icons-vue";
import { onMounted, ref, defineProps } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import EditFund from "@/views/fund/fundList/EditFund";
import { useRouter } from "vue-router";
const router = useRouter();

import fund from "@/request/api/fund";

const props = defineProps({ id: { required: true } });

const fields = [
  { id: "name", label: "基金名称", fixed: "left" },
  { id: "location", label: "基金注册地" },
  { id: "qixian", label: "基金期限" },
  { id: "guimo", label: "基金规模" },
  { id: "yuliu", label: "管理费预留金额" },
  { id: "guanliren", label: "基金管理人" },
  { id: "lp", label: "基金LP" },
  { id: "xieyi", label: "基金相关协议" },
  { id: "jingli", label: "基金经理" },
  { id: "fengkong", label: "基金风控" },
  { id: "chenglishijian", label: "成立时间" },
  { id: "yitouxiangmu", label: "基金已投项目清单" },
  { id: "jidubaogao", label: "基金季度报告" },
  { id: "niandubaogao", label: "基金年度报告" },
  { id: "dangqianzhuangtai", label: "基金当前状态" },
  { id: "yitoujine", label: "基金已投金额" },
  { id: "ketoujine", label: "基金可投金额" },
  { id: "jitiguize", label: "基金管理费计提规则" },
  { id: "guanlifeiji", label: "基金管理费计提明细" },
  { id: "shouyimingxi", label: "基金分红/收益计提规则" },
  { id: "beizhu", label: "其他备注" },
];

const handleSelected = () => {
  // selected.value=JSON.parse(sessionStorage.getItem('FundCurrentRow'))
  selected.value = copyData.value;
};

const deleteItem = () => {
  let row = JSON.parse(sessionStorage.getItem("FundCurrentRow"));
  ElMessageBox.confirm("确定删除基金：" + row.name + "?", "删除基金", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      fund.manager.delete(row.id).then((res) => {
        if (res) {
          ElMessage.success("删除成功");
          router.push("/fund/fundList");
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {});
};

const data = ref({});
const copyData = ref({});
const yitouxiangmu = ref([]);

const selected = ref(undefined);

onMounted(async () => {
  // console.log('prop',props.id)
  if (props.id) {
    yitouxiangmu.value = await fund.manager.getyitou(props.id);
    data.value = await fund.manager.detail(props.id);
    copyData.value = JSON.parse(JSON.stringify(data.value));
    data.value.jidubaogao = data.value.jidubaogao
      ? JSON.parse(data.value.jidubaogao)
      : [];
    data.value.xieyi = data.value.xieyi ? JSON.parse(data.value.xieyi) : [];
    data.value.niandubaogao = data.value.niandubaogao
      ? JSON.parse(data.value.niandubaogao)
      : [];
    data.value.lp = data.value.lp ? JSON.parse(data.value.lp) : [];
  }
});

const handleDownload = async (file) => {
  let arr = file.response.data.split("/");
  let res = await fund.manager.openUrl({ fileName: arr[arr.length - 1] });
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
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}
.detail-form {
  padding: 20px 0;
}

.detail-form .detail-item {
  border: 1px solid var(--el-border-color-light);
  padding: 10px;
}

.detail-form .detail-label {
  display: flex;
  justify-content: center;
}
</style>
