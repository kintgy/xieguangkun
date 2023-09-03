<template>
  <el-form :model="form" label-width="120px">
    <!-- <el-form-item label="Activity time">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date1"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker
          v-model="form.date2"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </el-col>
    </el-form-item> -->

    <el-row v-for="(item, index) in PageData.dateList" :key="index">
      <el-col :span="8">
        <el-form-item :label="item.name">
          <el-input @blur="onSaveOrUpdate(index)" v-model="item.value" />
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="2">
        <el-switch @change="onSaveOrUpdate(index)" v-model="item.isShow" />
        <!-- <el-form-item>
          <el-switch v-model="form.delivery" />
        </el-form-item> -->
      </el-col>
    </el-row>

    <!-- <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button>Cancel</el-button>
    </el-form-item> -->
  </el-form>
</template>
  
  <script setup>
import { reactive } from "vue";
import { onMounted } from "vue";
import company from "@/request/api/company";

const PageData = reactive({
  dateList: [
    {
      id: "",
      key1: "name",
      name:"企业名称",
      value: "新的企业名称",
      type:"1",
      isShow: true, //0不展示，1展示
    },
    {
      id: "",
      key1: "introduction",
      name: "项目简介",
      value: "新的项目简介",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "mainBusiness",
      name: "主营业务",
      value: "新的主营业务",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "participants",
      name: "参与人员",
      value: "新的参与人员",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "actions",
      name: "后续动作",
      value: "新的后续动作",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "remark",
      name: "备注",
      value: "新的备注",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "sign",
      name: "行业分类和特性标签",
      value: "新的行业分类和特性标签",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "location",
      name: "公司所在地",
      value: "新的公司所在地",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "interview",
      name: "访谈情况",
      value: "新的访谈情况",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "timePoint",
      name: "回访时点",
      value: "新的回访时点",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "projectType",
      name: "项目归类",
      value: "新的项目归类",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "source",
      name: "项目来源",
      value: "新的项目来源",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "financing",
      name: "融资情况",
      value: "新的融资情况",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "financials",
      name: "财务情况",
      value: "新的财务情况",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "createdTime",
      name: "创建时间",
      value: "新的创建时间",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "createdBy",
      name: "创建人",
      value: "新的创建人",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "updatedTime",
      name: "修改时间",
      value: "新的修改时间",
      type:"1",
      isShow: true,
    },
    {
      id: "",
      key1: "updatedBy",
      name: "修改人",
      value: "新的修改人",
      type:"1",
      isShow: true,
    },
  ],
});


onMounted(async () => {
  let res = await company.settings.DataList();
  PageData.dateList=res
});

const onSaveOrUpdate = async (index) => {
  await company.settings.SaveSettings(PageData.dateList[index]);
};
</script>
  
