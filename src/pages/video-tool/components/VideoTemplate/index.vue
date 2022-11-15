<script setup lang="ts">
import { VIDEO_EDIT_OPTIONS } from '../../config/index'
const props = defineProps<{ type: string }>()
const emit = defineEmits(['activeChg'])
</script>

<template>
  <div h-full max-w-lg p-x-4 w-88 border-r-1 border-color>
    <el-divider content-position="left">
      模板
    </el-divider>
    <div flex flex-wrap items-center justify-between style="margin: 0 -8px">
      <div
        v-for="item in VIDEO_EDIT_OPTIONS" :key="item.value"
        class="w-[50%]"
        @click="$emit('activeChg', item.value)"
      >
        <div
          flex flex-col justify-center items-center
          :class="`${type === item.value && 'text-primary border-primary'} `"
          border-1 border-box m-1
          p-2 transition-all
          rounded-2 cursor-pointer
          border-color
          hover:color-primary
          hover:border-primary
        >
          <div v-if="item.value !== type" i-fxemoji:monkeysee mb-2 text-6 />
          <div v-else i-fxemoji:monkeyhear mb-2 text-6 />
          <div text-1>
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
