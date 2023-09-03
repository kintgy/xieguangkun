<template>
  <search-form-content :fetch-data="fetchList" :form-items="searchItems" :fields="fields">
    <template #buttons>
      <el-button @click="selected = {}, editable = true">新增角色</el-button>
    </template>
    <template #operations>
      <el-table-column header-align="center" align="center" show-overflow-tooltip fixed="right" label="操作">
        <template #default="scope">
          <el-space>
            <el-link @click="selected = scope.row, editable = false" size="small">查看</el-link>
            <el-link @click="selected = scope.row, editable = true" type="primary" size="small">编辑</el-link>
            <el-link @click="deleteRole(scope.row)" type="danger" size="small">删除</el-link>
          </el-space>
        </template>
      </el-table-column>
    </template>
  </search-form-content>
  <edit-role v-if="undefined !== selected"
             :editable="editable"
             :role="selected"
             @close="selected=undefined"/>
</template>

<script setup>
import {ref} from "vue";
import EditRole from "@/views/admin/user/role/EditRole";
import user from "@/request/api/admin/user";
import {ElMessage, ElMessageBox} from "element-plus";
import SearchFormContent from "@/components/SearchFormContent";

const searchItems = {name: {label: '角色名', type: 'input'}}
const fields = [
  {id: 'name', label: '角色名'}, {id: 'code', label: '角色编码'}
]

const fetchList = async (params = {}) => {
  return await user.role.index(params)
}

const deleteRole = (row) => {
  ElMessageBox.confirm(
      '确定删除角色：' + row.name + '?',
      '删除角色',
      {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}
  ).then(() => {
    user.role.delete(row.id).then(res => {
      if (res) return ElMessage.success({
        message: '删除成功', duration: 1000, onClose: () => {
          location.reload()
        }
      })

      ElMessage.error({message: '删除失败', duration: 1000})
    })
  }).catch(() => {
  })
}

const selected = ref(undefined)
const editable = ref(false)
</script>