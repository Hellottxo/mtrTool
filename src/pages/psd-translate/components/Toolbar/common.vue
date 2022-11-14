<script setup name="commonAttribute" lang="ts">
import { PREDEFINE_COLOR } from '~/config/'
const props = defineProps<{ attribute: Record<string, any> }>()
const emit = defineEmits(['shadowChg', 'commonAttributeChg'])
</script>

<template>
  <el-divider content-position="left">
    基础信息
  </el-divider>
  <div flex items-center mb-2>
    <div mr-2>
      颜色
    </div>
    <el-color-picker :model-value="attribute.fill" size="small" show-alpha :predefine="PREDEFINE_COLOR" @change="$emit('commonAttributeChg', 'fill', $event)" />
  </div>
  <div flex items-center mb-2>
    <div mr-2>
      边框宽度
    </div>
    <el-input-number size="small" :model-value="attribute.strokeWidth" :min="0" @change="$emit('commonAttributeChg', 'strokeWidth', $event)" />
  </div>
  <div flex items-center mb-2>
    <div mr-2>
      边框颜色
    </div>
    <el-color-picker :model-value="attribute.stroke" size="small" show-alpha :predefine="PREDEFINE_COLOR" @change="$emit('commonAttributeChg', 'stroke', $event)" />
  </div>
  <el-divider content-position="left">
    阴影
  </el-divider>
  <div flex items-center mb-2>
    <div mr-2>
      颜色
    </div>
    <el-color-picker :model-value="attribute.shadow.color" size="small" show-alpha :predefine="PREDEFINE_COLOR" @change="$emit('shadowChg', 'color', $event)" />
  </div>
  <div flex items-center mb-2>
    <div mr-2>
      模糊
    </div>
    <el-input-number size="small" :model-value="attribute.shadow.blur" :min="0" @change="$emit('shadowChg', 'blur', $event)" />
  </div>
  <div flex items-center mb-2>
    <div mr-2 w-6>
      x 轴
    </div>
    <el-input-number size="small" :model-value="attribute.shadow.offsetX" :min="0" @change="$emit('shadowChg', 'offsetX', $event)" />
  </div>
  <div flex items-center mb-2>
    <div mr-2 w-6>
      y 轴
    </div>
    <el-input-number size="small" :model-value="attribute.shadow.offsetY" :min="0" @change="$emit('shadowChg', 'offsetY', $event)" />
  </div>
</template>

