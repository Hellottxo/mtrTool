<script setup name="textAttribute" lang="ts">
import { PREDEFINE_COLOR } from '../../config/index'
const props = defineProps<{ attribute: Record<string, any> }>()
const emit = defineEmits(['textAttributeChg'])

const ALIGN = {
  left: 'i-uil:align-left',
  center: 'i-uil:align-center',
  right: 'i-uil:align-right',
}
</script>

<template>
  <el-divider content-position="left">
    文字
  </el-divider>
  <div flex items-center mb-2>
    <div mr-2>
      大小
    </div>
    <el-input-number size="small" :model-value="attribute.fontSize" :min="0" @change="$emit('textAttributeChg', 'fontSize', $event)" />
  </div>
  <div flex items-center mb-2>
    <div mr-2>
      对齐
    </div>
    <el-radio-group :model-value="attribute.textAlign" size="small" @change="$emit('textAttributeChg', 'textAlign', $event)">
      <el-radio-button v-for="(value, key) in ALIGN" :key="key" :label="key">
        <div :class="value" />
      </el-radio-button>
    </el-radio-group>
  </div>
  <div flex items-center mb-2>
    <div mr-2>
      背景颜色
    </div>
    <el-color-picker :model-value="attribute.textBackgroundColor" size="small" show-alpha :predefine="PREDEFINE_COLOR" @change="$emit('textAttributeChg', 'textBackgroundColor', $event)" />
  </div>
  <div flex items-center mb-2>
    <div mr-2>
      间距
    </div>
    <el-input-number size="small" :model-value="attribute.charSpacing" :min="0" @change="$emit('textAttributeChg', 'charSpacing', $event)" />
  </div>
  <div flex items-center mb-2>
    <div mr-2>
      行高
    </div>
    <el-input-number size="small" :model-value="attribute.lineHeight" :min="0" @change="$emit('textAttributeChg', 'lineHeight', $event)" />
  </div>
</template>
