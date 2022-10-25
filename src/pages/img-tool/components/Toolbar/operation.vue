<script setup name="commonAttribute" lang="ts">
import party from 'party-js'
import { HISTORY } from '../../config/index'
const props = defineProps<{ config: { prev: number; next: number } }>()
const emit = defineEmits(['operate', 'saveImg'])
</script>

<template>
  <el-divider content-position="left">
    基础操作
  </el-divider>
  <div flex items-center mb-2>
    <div v-for="item in HISTORY" :key="item.type">
      <el-button size="small" :title="item.name" :disabled="config[item.type] <= 0" @click="$emit('operate', item.type)">
        <div :class="item.icon" />
        <span>{{ config[item.type] > 0 ? config[item.type] : '' }}</span>
      </el-button>
      <el-divider direction="vertical" />
    </div>
    <el-button ref="saveBtn" size="small" type="primary" ml-2 title="导出图片" @click="party.confetti($event); $emit('saveImg')">
      <div i-uil:image-download />
    </el-button>
  </div>
</template>

