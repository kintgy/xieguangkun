<template>
  <div>
    <div v-for="(item, index) in list" :key="index">
      <div class="arr-item">
        <div class="arr-item__left">
          <SearchForm :className="className" v-bind:formItems="item" @change="handelChange($event, index)" />
        </div>
        <div class="arr-item__right">
          <el-button text type="danger" plain @click="handelRemove(index)"
            >删除
          </el-button>
        </div>
      </div>
    </div>
    <div class="arr-item__right" @click="handelAdd">
      <el-button type="success">添加</el-button>
    </div>
  </div>
</template>

<script setup name="SearchFormArray">
import SearchForm from "./SearchForm";

import { ref, defineProps, computed, defineEmits, watch, onMounted } from "vue";
// import { ref, defineProps, computed, defineEmits, onMounted } from "vue";

const props = defineProps({
  options: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
  className: {default: ""},
});

const emit = defineEmits(["refresh"]);

const list = ref([]);

const handelAdd = () => {
  list.value.push(JSON.parse(JSON.stringify(defaultItem.value)));
  emit("refresh", list.value);
};

const handelRemove = (index) => {
  list.value.splice(index, 1);
  emit("refresh", list.value);
};

const handelChange = (item, index) => {
  if (!list.value[index]) return;
  for (let key in item) {
    list.value[index][key].value = item[key];
  }
  emit("refresh", list.value);
};

const defaultItem = computed(() => {
  let obj = {};
  props.options.forEach((item) => {
    obj[item.key] = {
      type: item.type_name,
      label: item.lable,
      value: "",
    };
  });
  return obj;
});

let isDone = false;

watch(
  () => props.modelValue,
  (data) => {
    if (!isDone && Array.isArray(data) && data.length) {
      list.value = JSON.parse(JSON.stringify(data));
      isDone = true;
    }
  }
);

onMounted(() => {
  if (Array.isArray(props.modelValue)) {
    list.value = JSON.parse(JSON.stringify(props.modelValue));
  }
});
</script>

<style scoped>
.arr-item {
  display: flex;
  width: 100%;
}

.arr-item__left {
  flex: 1;
}

.arr-item__right {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
