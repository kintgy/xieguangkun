<template>
  <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogShow"
      :width="getWidth"
      class="editCompany"
  >
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules">
      <el-form-item label="序号" prop="sort">
        <el-input v-model="form.sort"/>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="form.name" clearable/>
      </el-form-item>
      <el-form-item label="项目简介" prop="introduction">
        <el-input
            type="textarea"
            :rows="3"
            v-model="form.introduction"
            maxlength="255"
            show-word-limit
            clearable
        />
      </el-form-item>
      <el-form-item label="主营业务" prop="mainBusiness">
        <el-input v-model="form.mainBusiness" clearable/>
      </el-form-item>
      <el-form-item label="参与人员" prop="participants">
        <el-select
            multiple
            style="width: 100%"
            v-model="form.participants"
            placeholder=" "
        >
          <el-option
              v-for="item in [
              { label: '李先文' },
              { label: '张立寒' },
              { label: '谷加俊' },
              { label: '邱月' },
            ]"
              :key="item.label"
              :label="item.label"
              :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="editCompanyClass" label="后续动作" prop="actions">
        <el-cascader
            placeholder=" "
            style="width: 100%"
            filterable
            v-model="form.actions"
            :show-all-levels="false"
            :props="{ expandTrigger: 'hover',checkStrictly: true }"
            popper-class="actions-select-options"
            :options="options"
            size="mini"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
            maxlength="255"
            show-word-limit
            type="textarea"
            :rows="3"
            v-model="form.remark"
            clearable
        />
      </el-form-item>
      <el-form-item label="企业全称和地点" prop="location">
        <el-input
            maxlength="255"
            show-word-limit
            type="textarea"
            :rows="3"
            v-model="form.location"
            clearable
        />
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="行业分类" prop="sign">
            <el-select
                style="width: 100%"
                v-model="form.sign"
                filterable
                value-key="id"
                placeholder=" "
                @change="handleChange"
            >
              <el-option
                  v-for="item in labelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="二级行业标签" prop="sign2">
            <el-select
                style="width: 100%"
                v-model="form.signSecond"
                filterable
                value-key="id"
                placeholder=" "
            >
              <el-option
                  v-for="item in subLabelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="二级行业标签" prop="sign2">
            <el-input v-model="form.signSecond" clearable />
          </el-form-item> -->
        </el-col>
      </el-row>

      <el-form-item label="自定义标签" prop="sign2">
        <el-input v-model="form.sign2" clearable/>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="回访时点" prop="timePoint">
            <el-date-picker
                style="width: 100%"
                v-model="form.timePoint"
                type="date"
                placeholder=" "
                :shortcuts="shortcuts"
                value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="消息内容" prop="source">
            <el-input v-model="form.timeContent"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item label="项目归类" prop="projectType">
        <el-select
          style="width: 100%"
          v-model="form.projectType"
          placeholder=" "
        >
          <el-option
            v-for="item in [
              { label: '消费' },
              { label: '科创' },
              { label: '医疗' },
            ]"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="项目来源" prop="source">
        <el-input
            type="textarea"
            maxlength="255"
            show-word-limit
            :rows="3"
            v-model="form.source"
            clearable
        />
      </el-form-item>
      <el-form-item label="融资情况" prop="financing">
        <el-input
            type="textarea"
            :rows="3"
            v-model="form.financing"
            clearable
            maxlength="255"
            show-word-limit
        />
      </el-form-item>
      <el-form-item label="财务情况" prop="financials">
        <el-input
            type="textarea"
            :rows="3"
            v-model="form.financials"
            clearable
            maxlength="255"
            show-word-limit
        />
      </el-form-item>
      <el-form-item label="访谈情况" prop="interview">
        <el-input
            maxlength="255"
            show-word-limit
            style="margin-bottom: 10px"
            type="textarea"
            :rows="3"
            v-model="form.interview2"
            clearable
            placeholder="输入格式：第X次访谈，时间xx年x月x日，线上or 线下，某某某。主要内容：…………或见访谈纪要之《xx公司第x次访谈纪要》"
        />
        <el-upload
            :file-list="form.interview"
            class="upload-demo"
            drag
            :action="`${base.url}/company/upload`"
            :multiple="false"
            :before-upload="handleBeforeDownload"
            :on-preview="(file) => handleDownload(file)"
        >
          <el-icon class="el-icon--upload"></el-icon>
          <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="行研报告" prop="reportUrl">
        <el-upload
            :file-list="form.reportUrl"
            class="upload-demo"
            drag
            :action="`${base.url}/company/upload`"
            :multiple="false"
            :before-upload="handleBeforeDownload"
            :on-preview="(file) => handleDownload(file)"
        >
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="信息收集" prop="reportUrl">
        <el-upload
            :file-list="form.reportUrl2"
            class="upload-demo"
            drag
            :action="`${base.url}/company/upload`"
            :multiple="false"
            :before-upload="handleBeforeDownload"
            :on-preview="(file) => handleDownload(file)"
        >
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="bp上传" prop="reportUrl">
        <el-upload
            :file-list="form.bpUrl"
            class="upload-demo"
            drag
            :action="`${base.url}/company/upload`"
            :multiple="false"
            :before-upload="handleBeforeDownload"
            :on-preview="(file) => handleDownload(file)"
        >
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogShow = false">取消</el-button>
      <el-button @click="saveCompany" type="primary">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {onMounted, ref, defineProps} from "vue";
import company from "@/request/api/company";
import labelApi from "@/request/api/admin/labelManage";
import base from "@/request/base";
import {ElMessage, ElMessageBox} from "element-plus";
import {UploadFilled} from "@element-plus/icons-vue";

const props = defineProps({company: {required: true}});
const dialogShow = ref(true);

const getWidth = ref(document.body.clientWidth > 780 ? "80%" : "100%");
var validatePass = (rule, value, callback) => {
  var reg = /^[1-9]\d*$/g;
  if (!reg.test(value)) {
    callback(new Error("请输入正确的序号"));
  } else {
    callback();
  }
};
const rules = {
  sort: [{required: true, validator: validatePass, trigger: "blur"}],
  name: [{required: true, trigger: "blur", message: `请输入企业名称`}],
  introduction: [
    {required: true, trigger: "blur", message: `请输入项目简介`},
  ],
};

const shortcuts = [
  {
    text: "今天",
    value: new Date(),
  },
];

const options = [
  {
    value: "入库",
    label: "入库",
    children: [
      {
        value: "pass",
        label: "pass",
      },
      {
        value: "拉群",
        label: "拉群",
        children: [
          {
            value: "业务访谈",
            label: "业务访谈",
            children: [
              {
                value: "签署NDA",
                label: "签署NDA",
                children: [
                  {
                    value: "业务尽调",
                    label: "业务尽调",
                  },
                  {
                    value: "完整尽调",
                    label: "完整尽调",
                    children: [
                      {
                        value: "上会讨论",
                        label: "上会讨论",
                        children: [
                          {
                            value: "签署协议",
                            label: "签署协议",
                            children: [
                              {
                                value: "投后管理",
                                label: "投后管理",
                              },
                            ],
                          },
                          {
                            value: "保持跟踪",
                            label: "保持跟踪",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    value: "保持跟踪",
                    label: "保持跟踪",
                  },
                ],
              },
            ],
          },

          {
            value: "业务合作",
            label: "业务合作",
            children: [
              {
                value: "对接集团",
                label: "对接集团",
              },
            ],
          },
          {
            value: "了解信息",
            label: "了解信息",
            children: [
              {
                value: "保持联系",
                label: "保持联系",
              },
            ],
          },
        ],
      },
    ],
  },
];

const formRef = ref();
const form = ref({
  sort: props.company.sort ? props.company.sort : "",
  interview2: props.company.interview2 ? props.company.interview2 : "",
  name: props.company.name ? props.company.name : "",
  introduction: props.company.introduction ? props.company.introduction : "",
  mainBusiness: props.company.mainBusiness ? props.company.mainBusiness : "",
  participants: props.company.participants
      ? props.company.participants.split(",")
      : "",
  actions: props.company.actions ? JSON.parse(props.company.actions) : "",
  remark: props.company.remark ? props.company.remark : "",
  location: props.company.location ? props.company.location : "",
  // interview: props.company.interview ? props.company.interview : '',
  timePoint: props.company.timePoint ? props.company.timePoint : "",
  timeContent: props.company.timeContent ? props.company.timeContent : "",
  // projectType: props.company.projectType ? props.company.projectType : "",
  source: props.company.source ? props.company.source : "",
  financing: props.company.financing ? props.company.financing : "",
  financials: props.company.financials ? props.company.financials : "",

  sign: props.company.sign ? props.company.sign : "", //标签
  signSecond: props.company.signSecond ? props.company.signSecond : "", //标签
  sign2: props.company.sign2 ? props.company.sign2 : "", //标签
  interview: props.company.interview ? JSON.parse(props.company.interview) : [], //访谈情况
  reportUrl: props.company.reportUrl ? JSON.parse(props.company.reportUrl) : [], //行研报告
  reportUrl2: props.company.reportUrl2
      ? JSON.parse(props.company.reportUrl2)
      : [], //信息收集
  bpUrl: props.company.bpUrl ? JSON.parse(props.company.bpUrl) : [], //bp上传
});
const data = ref({});
const labelList = ref([]);
onMounted(async () => {
  let res = await labelApi.manager.getTableData({
    page: 1,
    pageSize: 999,
  });
  res.data.forEach((item) => {
    labelList.value.push({
      id: item.id,
      name: item.name,
      name2: item.name2,
    });
  });
  if (props.id) {
    data.value = await company.manager.detail(props.id);
    // form.value.signid = props.company.sign ? props.company.sign : ""; //标签
  }
  if (!props.company.id) {
    form.value.sort = await company.manager.sortNum();
  }
});

const subLabelList = ref([]);
const handleChange = (value) => {
  form.value.sign = value.name;
  subLabelList.value = value.name2.split(";");
  // form.value.signSecond = value.name2;
};

const handleClose = (done) => {
  ElMessageBox.confirm("即将关闭弹窗，数据不会保留，是否继续？")
      .then(() => {
        done();
      })
      .catch(() => {
        // catch error
      });
};

const handleBeforeDownload = (file) => {
  let fileSize = Number(file.size / 1024 / 1024);
  if (fileSize > 50) {
    ElMessage({
      message: "上传文件不可大于50MB，请尝试压缩或转换格式后上传",
      type: "warning",
    });
    return false;
  }
};

const handleDownload = async (file) => {
  let arr = file.response.data.split("/");
  let res = await company.manager.openUrl({fileName: arr[arr.length - 1]});
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
};

const saveCompany = async () => {
  const result = await formRef.value.validate();
  if (!result) return;

  form.value.interview = JSON.stringify(form.value.interview);
  form.value.reportUrl = JSON.stringify(form.value.reportUrl);
  form.value.reportUrl2 = JSON.stringify(form.value.reportUrl2);
  form.value.bpUrl = JSON.stringify(form.value.bpUrl);
  form.value.actions = JSON.stringify(form.value.actions);
  form.value.participants = form.value.participants.join(",");
  form.value.id = props.company.id;
  const res = await company.manager.save(form.value);
  if (res)
    return ElMessage.success({
      message: "保存成功",
      duration: 1000,
      onClose() {
        dialogShow.value = false;
        location.reload();
      },
    });
  ElMessage.error({message: "保存失败"});
};
</script>

<style scoped>
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

<style>
.actions-select-options .el-cascader-menu {
  min-width: 50px !important;
}

.actions-select-options.el-popper {
  max-width: 100% !important;
}
</style>
