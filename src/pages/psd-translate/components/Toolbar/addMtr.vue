<script setup name="addMtr" lang="ts">
import type { UploadUserFile } from 'element-plus'
import { MTR_SYMBOL } from '../../config/index'

const emit = defineEmits(['addImg', 'addMtr'])

const fileChange = async (val: UploadUserFile) => {
  emit('addImg', val)
}
</script>

<template>
  <el-divider content-position="left">
    添加元素
  </el-divider>
  <div flex items-center>
    <Upload accept=".psd" @file-change="fileChange($event)">
      <el-button size="small" title="添加图片">
        <div class="i-uil:image-plus" />
      </el-button>
    </Upload>
    <template v-for="item in MTR_SYMBOL.slice(1)" :key="item.type">
      <el-divider direction="vertical" />
      <el-button size="small" :title="`添加${item.name}`" @click="$emit('addMtr', item.type)">
        <div :class="item.icon" />
      </el-button>
    </template>
  </div>
</template>

