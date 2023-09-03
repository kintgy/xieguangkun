<template>
  <el-card class="mb-20">
    <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :inline="inline"
        :label-position="labelPosition"
        :label-width="labelWidth"
        class="search-form"
    >
      <slot name="before"></slot>
      <template v-for="(item, name) in items" :key="name">
        <el-form-item
            v-if="(item.type && 'hidden' !== item.type) || !item.type"
            :prop="name"
            :class="className"
        >
          <template #label>
            {{ item.label ? item.label : "" }}
            <el-tooltip
                v-if="item.tips"
                class="item"
                effect="dark"
                :content="item.tips"
                placement="top"
            >
              <el-icon>
                <info-filled></info-filled>
              </el-icon>
            </el-tooltip>
          </template>
          <template v-if="!item.type || 'input' === item.type">
            <el-input
                v-if="!item.remote"
                v-model="form[name]"
                clearable
                autosize
            />
            <el-autocomplete v-else
                             :fetch-suggestions="(val, callback) => {fetchOptionsByRemote(val, item, name, callback)}"
                             value-key="name"
                             v-model="form[name]"
                             clearable autosize>
            </el-autocomplete>
          </template>
          <el-input
              v-if="'textarea' === item.type"
              v-model="form[name]"
              type="textarea"
              clearable
              :row="3"
          />
          <el-date-picker
              v-if="['daterange', 'monthrange'].indexOf(item.type) >= 0"
              v-model="form[name]"
              size="default"
              :value-format="item.format ? item.format : 'x'"
              :shortcuts="getDefaultSeasonDate(item.shortcuts)"
              unlink-panels
              :type="item.type"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabledDate="item.disableDate ? item.disableDate : disableDate"
          />
          <el-date-picker
              v-if="['date', 'month', 'year'].indexOf(item.type) >= 0"
              v-model="form[name]"
              :type="item.type"
              :value-format="item.format ? item.format : 'x'"
              placeholder="选择日期"
              :shortcuts="item.shortcuts ? item.shortcuts : []"
              :disabled-date="item.disableDate ? item.disableDate : disableDate"
          />
          <el-select
              v-if="'selector' === item.type"
              v-model="form[name]"
              :remote="item.remote ? true : false"
              :remote-method="item.remote ? (val) => {fetchOptionsByRemote(val, item, name)} : null"
              :placeholder="item.placeholder ? item.placeholder : ''"
              clearable
              filterable
          >
            <el-option
                v-for="(subItem,subIndex) in getItemOptions(item.options)"
                :key="subIndex"
                :label="subItem.name"
                :value="subItem.id"
            />
          </el-select>
          <el-tree-select
              v-if="'tree' === item.type"
              v-model="form[name]"
              :data="getItemOptions(item.options)"
              :node-key="item.node ? item.node : 'node'"
              clearable
          >
            <template #default="{ data }">
              <el-option
                  :label="data.name"
                  :value="data[item.node ? item.node : 'node']"
              ></el-option>
            </template>
          </el-tree-select>
          <el-checkbox v-if="'checkbox' === item.type" v-model="form[name]" :true-label="1" :false-label="0">
          </el-checkbox>
          <el-radio-group v-if="'radio' === item.type" v-model="form[name]">
            <el-radio
                v-for="item in getItemOptions(item.options)"
                :key="item.id"
                :label="item.id"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
          <template v-if="'array' === item.type">
            <SearchFormArray
                :options="item.options"
                v-model="form[name]"
                @refresh="form[name] = $event"
            />
          </template>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button
            v-if="'{}' !== JSON.stringify(items) && fetchData"
            type="primary"
            @click="fetchData(form)"
        >
          搜索
        </el-button>
        <slot name="buttons"></slot>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup name="SearchForm">
import {
  onMounted,
  ref,
  defineProps,
  defineEmits,
  defineExpose,
  watch,
} from "vue";
import filters from "@/base/filters/base";
import {InfoFilled} from "@element-plus/icons-vue";
import SearchFormArray from "./SearchFormArray";

const props = defineProps({
  fetchData: {type: Function},
  formItems: {
    default() {
      return {};
    },
  },
  inline: {default: true},
  labelPosition: {default: "right"},
  labelWidth: {default: ""},
  className: {default: ""},
});

const emit = defineEmits(["refresh", "change"]);

const formRef = ref(null);
const form = ref({});
const rules = ref({});
const items = ref({});
const initForm = async (params = undefined) => {
  let defaultParams = params ? params : props.formItems;
  form.value = {};
  items.value = {};
  if (defaultParams) {
    for (const item in defaultParams) {
      if (
          defaultParams[item].options &&
          defaultParams[item].options instanceof Function
      ) {
        await defaultParams[item].options().then((data) => {
          defaultParams[item].options = data;
        });
      }

      items.value[item] = defaultParams[item];
      form.value[item] = defaultParams[item].value
          ? defaultParams[item].value
          : null;
      if (defaultParams[item].rule) {
        rules.value[item] = defaultParams[item].rule;
      }
    }

    if (!props.fetchData) {
      emit("refresh", form.value);
    } else {
      props.fetchData(form.value);
    }
    console.log('items', items.value)
  }
};

const disableDate = () => {
  return false;
};

const getDefaultSeasonDate = (defaultDuration) => {
  let defaults = [
    {text: "当前季度", value: filters.defaultDuration("season", 0)},
    {text: "上一季度", value: filters.defaultDuration("season", 1)},
    {text: "近15天", value: filters.defaultDuration("day", 15)},
    {text: "近7天", value: filters.defaultDuration("day", 7)},
    {text: "本月", value: filters.defaultDuration("month", 0)},
    {text: "上月", value: filters.defaultDuration("month", 1)},
    {text: "本周", value: filters.defaultDuration("week", 0)},
    {text: "上周", value: filters.defaultDuration("week", 1)},
  ];

  if (!defaultDuration) return defaults;
  return defaultDuration.concat(defaults);
};

const getItemOptions = (options) => {
  if (undefined === options || !(options instanceof Array)) return [];
  return options.length > 0 ? options : [];
};

const getSearchForm = () => {
  return form.value;
};

const fetchOptionsByRemote = async (val, item, name, callback = false) => {
  if (!item.remote) return

  const res = await item.remote(val, name.split('_')[0])
  item.options = res && res.length > 0 ? res : []
  if (callback) callback(res)
}

onMounted(() => {
  initForm();
});

watch(
    () => props.formItems,
    () => {
      initForm();
    },
    {deep: true}
);

watch(
    () => form.value,
    (value) => {
      value && emit("change", value);
    },
    {deep: true}
);

defineExpose({formRef, getSearchForm});
</script>