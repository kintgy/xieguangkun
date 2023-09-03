<template>
  <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogShow"
      :width="getWidth"
  >
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules">
      <!-- 基本信息 -->
      <el-form-item label="基金名称" prop="name">
        <el-input v-model="form.name" clearable/>
      </el-form-item>
      <el-form-item label="基金注册地" prop="location">
        <el-input v-model="form.location" clearable/>
      </el-form-item>
      <el-form-item label="期限" prop="qixian">
        <div style="display: flex; width: 100%; justify-content: space-between">
          <el-form-item label="投资期" prop="location">
            <el-date-picker
                style="width: 100%%"
                v-model="form.qixian"
                type="date"
                placeholder=" "
                value-format="YYYY-MM-DD"
                :shortcuts="shortcuts"
            />
          </el-form-item>
          <el-form-item label="退出期" prop="location">
            <el-date-picker
                style="width: 100%%"
                v-model="form.qixian1"
                type="date"
                placeholder=" "
                :shortcuts="shortcuts"
            />
          </el-form-item>
          <el-form-item label="延长退出期" prop="location">
            <el-date-picker
                style="width: 100%%"
                v-model="form.qixian2"
                type="date"
                placeholder=" "
                :shortcuts="shortcuts"
            />
          </el-form-item>
          <!-- <el-date-picker
            style="width: 32%"
            v-model="form.qixian"
            type="date"
            placeholder=" 请选择投资期"
            :shortcuts="shortcuts"
          />
          <el-date-picker
            style="width: 32%"
            v-model="form.qixian"
            type="date"
            placeholder=" 请选择退出期"
            :shortcuts="shortcuts"
          />
          <el-date-picker
            style="width: 32%"
            v-model="form.qixian"
            type="date"
            placeholder=" 请选择延长退出期"
            :shortcuts="shortcuts"
          /> -->
        </div>
        <!-- <div>
          <el-date-picker
            style="width: 100%"
            v-model="form.qixian"
            type="date"
            placeholder=" "
            :shortcuts="shortcuts"
          />
        </div> -->
        <!-- <el-date-picker
          style="width: 100%"
          v-model="form.qixian"
          type="date"
          placeholder=" "
          :shortcuts="shortcuts"
        />
        <el-date-picker
          style="width: 100%"
          v-model="form.qixian"
          type="date"
          placeholder=" "
          :shortcuts="shortcuts"
        /> -->
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="规模" prop="guimo">
            <el-input type="number" v-model="form.guimo" clearable>
              <template #append>万元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="预留金额">
            <el-input type="number" v-model="form.yuliu" clearable>
              <template #append>万元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="管理人" prop="guanliren">
        <el-input v-model="form.guanliren" clearable/>
        <!-- <el-select
          style="width: 100%"
          v-model="form.guanliren"
          placeholder=" "
        >
          <el-option
            v-for="item in [
              { label: 'a' },
              { label: 'b' },
              { label: 'c' },
              { label: 'd' },
            ]"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select> -->
      </el-form-item>
      <el-form-item label="LP" prop="lp">
        <el-col :span="24">
          <el-row v-for="(item, index) in form.lp"
                  :key="index" justify="space-between"
                  style="margin-bottom: 10px;">
            <el-col :md="20" :xs="24">
              <span>
                {{ `LP${index + 1}` }}&nbsp;&nbsp;</span>
              <el-input
                  style="width: 95%;float: right;"
                  v-model="form.lp[index].num"
                  clearable
              />
            </el-col>
            <el-col :md="4" :xs="24">
              <el-row justify="end" :gutter="20">
                <el-button
                    @click="form.lp.push({ num: '' })"
                    v-if="index == form.lp.length - 1"
                    plain
                >新增
                </el-button
                >
                <el-button
                    type="danger"
                    @click="form.lp.splice(index, 1)"
                    v-if="index > 0 && index == form.lp.length - 1"
                    plain
                >删除
                </el-button
                >
              </el-row>
            </el-col>

          </el-row>
        </el-col>
      </el-form-item>
      <!--      <el-form-item label="LP" prop="lp">-->
      <!--        <div style="width: 100%" class="lpList">-->
      <!--          <div-->
      <!--            style="display: flex; position: relative"-->
      <!--            v-for="(item, index) in form.lp"-->
      <!--            :key="index"-->
      <!--          >-->
      <!--            <span style="display: inline-block; width: 40px"-->
      <!--              >LP{{ index + 1 }}&nbsp;&nbsp;</span-->
      <!--            >-->
      <!--            <el-input-->
      <!--              style="width: 85%; margin-bottom: 10px"-->
      <!--              v-model="form.lp[index].num"-->
      <!--              clearable-->
      <!--            />-->
      <!--            <el-button-->
      <!--              style="position: absolute; right: 0"-->
      <!--              @click="form.lp.push({ num: '' })"-->
      <!--              v-if="index == form.lp.length - 1"-->
      <!--              plain-->
      <!--              >新增</el-button-->
      <!--            >-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-form-item>-->
      <el-form-item label="相关协议" prop="xieyi">
        <el-upload
            :file-list="form.xieyi"
            class="upload-demo"
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
        <!-- <el-input
          type="textarea"
          :rows="3"
          v-model="form.xieyi"
          maxlength="255"
          show-word-limit
          clearable
        /> -->
      </el-form-item>
      <el-form-item label="经理" prop="jingli">
        <el-select style="width: 100%" v-model="form.jingli" placeholder=" ">
          <el-option
              v-for="(item, index) in managerPersonList"
              :key="index"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
        <!-- <el-input v-model="form.jingli" clearable /> -->
      </el-form-item>
      <el-form-item label="风控" prop="fengkong">
        <el-select style="width: 100%" v-model="form.fengkong" placeholder=" ">
          <el-option
              v-for="(item, index) in riskPersonList"
              :key="index"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
        <!-- <el-input v-model="form.fengkong" clearable /> -->
      </el-form-item>
      <el-form-item label="成立时间" prop="chenglishijian">
        <el-date-picker
            style="width: 100%"
            v-model="form.chenglishijian"
            type="date"
            placeholder=" "
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 管理信息 -->
      <el-form-item
          v-if="props.fund.id"
          label="已投项目清单"
          prop="yitouxiangmu"
      >
        <!-- <el-input
          type="textarea"
          :rows="3"
          v-model="form.yitouxiangmu"
          maxlength="255"
          show-word-limit
          clearable
        /> -->
        <div class="yitouList">
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
        <!-- <el-input v-model="form.yitouxiangmu" clearable /> -->
      </el-form-item>
      <!-- <el-form-item label="季度报告" prop="jidubaogao">
        <el-input v-model="form.jidubaogao" clearable />
      </el-form-item> -->
      <el-form-item label="季度报告" prop="jidubaogao">
        <el-upload
            :file-list="form.jidubaogao"
            class="upload-demo"
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
      </el-form-item>
      <el-form-item label="年度报告" prop="niandubaogao">
        <el-upload
            :file-list="form.niandubaogao"
            class="upload-demo"
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
      </el-form-item>
      <!-- <el-form-item label="年度报告" prop="niandubaogao">
        <el-input v-model="form.niandubaogao" clearable />
      </el-form-item> -->

      <el-form-item label="当前状态" prop="dangqianzhuangtai">
        <el-select
            style="width: 100%"
            v-model="form.dangqianzhuangtai"
            placeholder=" "
        >
          <el-option
              v-for="item in [
              { label: '续存(投资期)' },
              { label: '续存(退出期)' },
              { label: '延长退出期' },
              { label: '清算关闭' },
            ]"
              :key="item.label"
              :label="item.label"
              :value="item.label"
          />
        </el-select>
        <!-- <el-input v-model="form.dangqianzhuangtai" clearable /> -->
      </el-form-item>

      <!-- 财务信息 -->
      <el-form-item label="已投金额" prop="yitoujine">
        <el-input disabled v-model="form.yitoujine" clearable/>
      </el-form-item>
      <el-form-item label="可投金额" prop="ketoujine">
        <el-input disabled v-model="form.ketoujine" clearable/>
      </el-form-item>
      <el-form-item label="管理费计提规则" prop="jitiguize">
        <el-input
            type="textarea"
            :rows="3"
            v-model="form.jitiguize"
            maxlength="3000"
            show-word-limit
            clearable
        />
        <!-- <el-input v-model="form.jitiguize" clearable /> -->
      </el-form-item>
      <el-form-item label="管理费计提明细" prop="guanlifeiji">
        <el-input
            type="textarea"
            :rows="3"
            v-model="form.guanlifeiji"
            maxlength="3000"
            show-word-limit
            clearable
        />
        <!-- <el-input v-model="form.guanlifeiji" clearable /> -->
      </el-form-item>
      <!-- <el-form-item label="提明细" prop="timingxi">
        <el-input v-model="form.timingxi" clearable />
      </el-form-item> -->
      <el-form-item label="分红/收益计提明细" prop="shouyimingxi">
        <el-input
            type="textarea"
            :rows="3"
            v-model="form.shouyimingxi"
            maxlength="3000"
            show-word-limit
            clearable
        />
        <!-- <el-input v-model="form.shouyimingxi" clearable /> -->
      </el-form-item>
      <el-form-item label="其他备注" prop="beizhu">
        <el-input
            type="textarea"
            :rows="3"
            v-model="form.beizhu"
            maxlength="255"
            show-word-limit
            clearable
        />
        <!-- <el-input v-model="form.beizhu" clearable /> -->
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogShow = false">取消</el-button>
      <el-button @click="saveFund" type="primary">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {onMounted, ref, defineProps} from "vue";
import fund from "@/request/api/fund";
import base from "@/request/base";
import {ElMessage, ElMessageBox} from "element-plus";
import userInfo from "@/request/api/admin/userInfo";
import {UploadFilled} from "@element-plus/icons-vue";

const props = defineProps({fund: {required: true}});
const dialogShow = ref(true);

const getWidth = ref(document.body.clientWidth > 780 ? "80%" : "100%");
const rules = {
  name: [{required: true, trigger: "blur", message: `请输入`}],
  guimo: [{required: true, trigger: "blur", message: `请输入`}],
};

const shortcuts = [
  {
    text: "今天",
    value: new Date(),
  },
];

const yitouxiangmu = ref([]);

const formRef = ref();

const form = ref({
  name: props.fund.name ? props.fund.name : "",
  location: props.fund.location ? props.fund.location : "",
  qixian: props.fund.qixian ? props.fund.qixian : "",
  qixian2: props.fund.qixian1 ? props.fund.qixian1 : "",
  qixian3: props.fund.qixian2 ? props.fund.qixian2 : "",
  guimo: props.fund.guimo ? props.fund.guimo : "",
  yuliu: props.fund.yuliu ? props.fund.yuliu : "",
  guanliren: props.fund.guanliren ? props.fund.guanliren : "",
  lp: props.fund.lp ? JSON.parse(props.fund.lp) : [{num: ""}, {num: ""}],
  xieyi: props.fund.xieyi ? JSON.parse(props.fund.xieyi) : [],
  jingli: props.fund.jingli ? props.fund.jingli : "",
  fengkong: props.fund.fengkong ? props.fund.fengkong : "",
  chenglishijian: props.fund.chenglishijian ? props.fund.chenglishijian : "",
  yitouxiangmu: props.fund.yitouxiangmu ? props.fund.yitouxiangmu : "",
  jidubaogao: props.fund.jidubaogao ? JSON.parse(props.fund.jidubaogao) : [],
  niandubaogao: props.fund.niandubaogao
      ? JSON.parse(props.fund.niandubaogao)
      : [],
  dangqianzhuangtai: props.fund.dangqianzhuangtai
      ? props.fund.dangqianzhuangtai
      : "",
  yitoujine: props.fund.yitoujine ? props.fund.yitoujine : "",
  ketoujine: props.fund.ketoujine ? props.fund.ketoujine : "",
  jitiguize: props.fund.jitiguize ? props.fund.jitiguize : "",
  guanlifeiji: props.fund.guanlifeiji ? props.fund.guanlifeiji : "",
  timingxi: props.fund.timingxi ? props.fund.timingxi : "",
  shouyimingxi: props.fund.shouyimingxi ? props.fund.shouyimingxi : "",
  beizhu: props.fund.beizhu ? props.fund.beizhu : "",
});

const data = ref({});
const riskPersonList = ref([]);
const managerPersonList = ref([]);
const gettPersonList = async () => {
  let params = {
    page: 1,
    pageSize: 999,
    total: 0,
  };
  const res = await userInfo.manager.index(params);
  riskPersonList.value = res.data.filter((item) => item.type == "风控");
  managerPersonList.value = res.data.filter((item) => item.type == "经理");
};
onMounted(async () => {
  gettPersonList();
  if (props.fund.id) {
    // data.value = await fund.manager.detail(props.id);
    yitouxiangmu.value = await fund.manager.getyitou(props.fund.id);
  }
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

const saveFund = async () => {
  const result = await formRef.value.validate();
  if (!result) return;
  form.value.jidubaogao = JSON.stringify(form.value.jidubaogao);
  form.value.niandubaogao = JSON.stringify(form.value.niandubaogao);
  form.value.xieyi = JSON.stringify(form.value.xieyi);
  form.value.lp = JSON.stringify(form.value.lp);
  form.value.id = props.fund.id;
  const res = await fund.manager.save(form.value);
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
