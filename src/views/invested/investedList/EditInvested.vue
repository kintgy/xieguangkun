<template>
  <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogShow"
      :width="getWidth"
  >
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules">
      <el-form-item label="项目名称" prop="name">
        <el-select
            style="width:100%"
            v-model="form.name"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键字"
            :remote-method="nameRemoteMethod"
        >
          <el-option
              v-for="item in nameList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
        <!-- <el-input v-model="form.name" clearable> </el-input> -->
      </el-form-item>
      <el-form-item label="隶属基金" prop="jijinId">
        <el-select
            @change="handleSelectChange"
            style="width: 100%"
            v-model="form.jijinId"
            placeholder=" "
        >
          <el-option
              v-for="item in choiceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投资金额" prop="jine">
        <el-input type="number" v-model="form.jine" clearable>
          <template #append>万元</template>
        </el-input>
        <!-- <el-input v-model="form.jine" clearable /> -->
      </el-form-item>
      <el-form-item label="已完成投资金额" prop="wanchengtouzi">
        <el-input type="number" v-model="form.wanchengtouzi" clearable>
          <template #append>万元</template>
        </el-input>
        <!-- <el-input v-model="form.wanchengtouzi" clearable /> -->
      </el-form-item>
      <el-form-item label="投资时间" prop="shijian">
        <el-date-picker
            style="width: 100%"
            v-model="form.shijian"
            type="date"
            placeholder=" "
            value-format="YYYY-MM"
            format="YYYY-MM"
            :shortcuts="shortcuts"
        />
      </el-form-item>
      <el-row>
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
      <el-form-item label="投资协议上传" prop="xieyi">
        <el-col :md="12" :xs="24">
          <el-upload
              :file-list="form.xieyi"
              class="upload-demo width-100"
              drag
              :action="`${base.url}/company/upload`"
              :multiple="false"
              :before-upload="handleBeforeDownload"
              :on-preview="(file) => handleDownload(file)"
          >
            <el-icon class="el-icon--upload">
              <!-- <upload-filled/> -->
            </el-icon>
            <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
          </el-upload>
          <file-list-show @delete="event => form.xieyi.splice(event, 1)" :file-list="form.xieyi"/>
        </el-col>
        <!-- <el-input v-model="form.xieyi" clearable /> -->
      </el-form-item>
      <el-form-item label="尽调材料包链接" prop="cailiaobao">
        <el-input v-model="form.cailiaobao" clearable/>
      </el-form-item>
      <el-form-item label="企业投后管理财务报告" prop="caiwubaogao">
        <el-col :md="12" :xs="24">
          <el-upload
              :file-list="form.caiwubaogao"
              class="upload-demo width-100"
              drag
              :action="`${base.url}/company/upload`"
              :multiple="true"
              :show-file-list="false"
              :before-upload="handleBeforeDownload"
              :on-preview="(file) => handleDownload(file)"
          >
            <el-icon class="el-icon--upload">
              <!-- <upload-filled/> -->
            </el-icon>
            <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
          </el-upload>
          <!-- <el-input v-model="form.caiwubaogao" clearable /> -->
          <file-list-show @delete="event => form.caiwubaogao.splice(event, 1)" :file-list="form.caiwubaogao"/>
        </el-col>
      </el-form-item>
      <el-form-item label="企业年度审计报告" prop="shenjibaogao">
        <el-col :md="12" :xs="24">
          <el-upload
              :file-list="form.shenjibaogao"
              class="upload-demo width-100"
              :limit="4"
              drag
              :action="`${base.url}/company/upload`"
              :multiple="false"
              :before-upload="handleBeforeDownload"
              :on-preview="(file) => handleDownload(file)"
          >
            <el-icon class="el-icon--upload">
              <!-- <upload-filled/> -->
            </el-icon>
            <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
          </el-upload>
<!--          <file-list-show @delete="event => form.shenjibaogao.splice(event, 1)" :file-list="form.shenjibaogao"/>-->
        </el-col>
        <!-- <el-input v-model="form.shenjibaogao" clearable /> -->
      </el-form-item>
      <el-form-item
          label="股东会纪要(标准格式为20xx年第几次股东会纪要)"
          prop="gudongjiyao"
      >
        <el-col :md="12" :xs="24">
          <el-upload
              :file-list="form.gudongjiyao"
              class="upload-demo width-100"
              :limit="4"
              drag
              :action="`${base.url}/company/upload`"
              :multiple="false"
              :before-upload="handleBeforeDownload"
              :on-preview="(file) => handleDownload(file)"
          >
            <el-icon class="el-icon--upload"></el-icon>
            <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
          </el-upload>
<!--          <file-list-show @delete="event => form.gudongjiyao.splice(event, 1)" :file-list="form.gudongjiyao"/>-->
        </el-col>
        <!-- <el-input
          type="textarea"
          :rows="3"
          v-model="form.gudongjiyao"
          maxlength="255"
          show-word-limit
          clearable
          placeholder="标准格式为20xx年第几次股东会纪要"
        /> -->

        <!-- <el-input v-model="form.gudongjiyao" clearable /> -->
      </el-form-item>
      <el-form-item
          label="董事会纪要(标准格式为20xx年第几次懂事会纪要)"
          prop="dongshijiyao"
      >
        <el-col :md="12" :xs="24">
          <el-upload
              :file-list="form.dongshijiyao"
              class="upload-demo width-100"
              :limit="4"
              drag
              :action="`${base.url}/company/upload`"
              :multiple="false"
              :before-upload="handleBeforeDownload"
              :on-preview="(file) => handleDownload(file)"
          >
            <el-icon class="el-icon--upload"></el-icon>
            <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
          </el-upload>
<!--          <file-list-show @delete="event => form.dongshijiyao.splice(event, 1)" :file-list="form.dongshijiyao"/>-->
        </el-col>
        <!-- <el-input
          type="textarea"
          :rows="3"
          v-model="form.dongshijiyao"
          maxlength="255"
          show-word-limit
          clearable
          placeholder="标准格式为20xx年第几次懂事会纪要"
        /> -->
        <!-- <el-input v-model="form.dongshijiyao" clearable /> -->
      </el-form-item>
      <!-- <el-form-item label="后续融资相关文件上传" prop="xiangguanwenjian">
        <el-upload
          :file-list="form.xiangguanwenjian"
          class="upload-demo width-100"
          :limit="1"
          drag
          :action="`${base.url}/company/upload`"
          :multiple="false"
          :before-upload="handleBeforeDownload"
          :on-preview="(file) => handleDownload(file)"
        >
          <el-icon class="el-icon--upload">
          </el-icon>
          <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
        </el-upload>
      </el-form-item> -->
      <el-form-item label="后续其他文件上传" prop="qitawenjian">
        <el-col :md="12" :xs="24">
          <el-upload
              :file-list="form.qitawenjian"
              class="upload-demo width-100"
              :limit="1"
              drag
              :action="`${base.url}/company/upload`"
              :multiple="false"
              :before-upload="handleBeforeDownload"
              :on-preview="(file) => handleDownload(file)"
          >
            <el-icon class="el-icon--upload">
              <!-- <upload-filled/> -->
            </el-icon>
            <div class="el-upload__text">拖曳文件到此或<em>选择文件</em></div>
          </el-upload>
<!--          <file-list-show @delete="event => form.qitawenjian.splice(event, 1)" :file-list="form.qitawenjian"/>-->
        </el-col>
        <!-- <el-input v-model="form.qitawenjian" clearable /> -->
      </el-form-item>
      <el-form-item label="投后管理重要备注信息" prop="beizhu">
        <el-input
            type="textarea"
            :rows="3"
            v-model="form.jitiguize"
            maxlength="255"
            show-word-limit
            clearable
        />
        <!-- <el-input v-model="form.beizhu" clearable /> -->
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogShow = false">取消</el-button>
      <el-button @click="saveInvested" type="primary">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {onMounted, ref, defineProps, reactive} from "vue";
import invested from "@/request/api/invested";
import fund from "@/request/api/fund";
import base from "@/request/base";
import {ElMessage, ElMessageBox} from "element-plus";
import FileListShow from '@/components/FileListShow'

const props = defineProps({invested: {required: true}});
const dialogShow = ref(true);

const getWidth = ref(document.body.clientWidth > 780 ? "80%" : "100%");
const rules = {
  // name: [{ required: true, trigger: "blur", message: `请选择` }],
};

const shortcuts = [
  {
    text: "今天",
    value: new Date(),
  },
];

const formRef = ref();

const form = ref({
  name: props.invested.name ? props.invested.name : "",
  jijinName: props.invested.jijinName ? props.invested.jijinName : "",
  jijinId: props.invested.jijinId ? props.invested.jijinId : "",
  jine: props.invested.jine ? props.invested.jine : "",
  wanchengtouzi: props.invested.wanchengtouzi
      ? props.invested.wanchengtouzi
      : "",
  shijian: props.invested.shijian ? props.invested.shijian : "",
  xieyi: props.invested.xieyi ? JSON.parse(props.invested.xieyi) : [],
  cailiaobao: props.invested.cailiaobao ? props.invested.cailiaobao : "",
  caiwubaogao: props.invested.caiwubaogao
      ? JSON.parse(props.invested.caiwubaogao)
      : [],
  shenjibaogao: props.invested.shenjibaogao
      ? JSON.parse(props.invested.shenjibaogao)
      : [],
  gudongjiyao: props.invested.gudongjiyao
      ? JSON.parse(props.invested.gudongjiyao)
      : [],
  dongshijiyao: props.invested.dongshijiyao
      ? JSON.parse(props.invested.dongshijiyao)
      : [],
  xiangguanwenjian: props.invested.xiangguanwenjian
      ? JSON.parse(props.invested.xiangguanwenjian)
      : [],
  qitawenjian: props.invested.qitawenjian
      ? JSON.parse(props.invested.qitawenjian)
      : [],
  beizhu: props.invested.beizhu ? props.invested.beizhu : "",
});

const data = ref({});
const choiceList = ref([]);
const nameList = ref([]);
const nameRemoteMethod = async (str) => {
  const res = await invested.manager.nameList(str)
  nameList.value = res.data
  console.log('nameList.value', nameList.value)
};


onMounted(async () => {
  const res = await fund.manager.index({name: "", page: 1, pageSize: 999});
  choiceList.value = res.data;
  if (props.id) {
    data.value = await invested.manager.detail(props.id);
  }

  // console.log('res2',res2)
});

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

const handleSelectChange = (val) => {
  // console.log('val',val)
  form.value.jijinName = choiceList.value.filter(
      (item) => item.id == val
  )[0].name;
};

const handleDownload = async (file) => {
  let arr = file.response.data.split("/");
  let res = await fund.manager.openUrl({fileName: arr[arr.length - 1]});
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

const saveInvested = async () => {
  const result = await formRef.value.validate();
  if (!result) return;
  form.value.xieyi = JSON.stringify(form.value.xieyi);
  form.value.caiwubaogao = JSON.stringify(form.value.caiwubaogao);
  form.value.shenjibaogao = JSON.stringify(form.value.shenjibaogao);
  form.value.xiangguanwenjian = JSON.stringify(form.value.xiangguanwenjian);
  form.value.qitawenjian = JSON.stringify(form.value.qitawenjian);
  form.value.gudongjiyao = JSON.stringify(form.value.gudongjiyao);
  form.value.dongshijiyao = JSON.stringify(form.value.dongshijiyao);
  form.value.id = props.invested.id;
  const res = await invested.manager.save(form.value);
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
.el-cascader-menu {
  min-width: 30px !important;
}

#el-popper-container-7777 .el-popper {
  max-width: 100%;
}
</style>
