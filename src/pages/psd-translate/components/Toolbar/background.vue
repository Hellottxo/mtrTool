<script setup name="background" lang="ts">
import { IMG_ACCEPT, PREDEFINE_COLOR } from '~/config/index'

const props = defineProps<{
  background: { color: string; img: string; width: number; height: number }
}>()
const emit = defineEmits(['updateConfig'])

const updateBackground = (key: string, val: string | null) => {
  emit('updateConfig', key, val)
}

const color = computed({
  get: () => props.background.color,
  set: (val: string) => updateBackground('color', val),
})

const PREDEFINE_SIZE = [
  { width: 900, height: 1200, name: '竖版', id: 1 },
  { width: 1200, height: 900, name: '横版', id: 2 },
]

const activeSize = computed({
  get: () => PREDEFINE_SIZE.find(e => e.width === props.background.width && e.height === props.background.height)?.id,
  set: (val) => {
    const { width, height } = PREDEFINE_SIZE.find(e => e.id === val)
    emit('updateConfig', 'size', width, height)
  },
})
</script>

<template>
  <el-divider content-position="left">
    画布
  </el-divider>
  <div flex items-center mb-2>
    <div mr-2>
      背景颜色
    </div>
    <el-color-picker v-model="color" size="small" show-alpha :predefine="PREDEFINE_COLOR" />
  </div>
  <div flex items-center mb-2>
    <div mr-2>
      背景图片
    </div>
    <Upload :accept="IMG_ACCEPT.join(',')" @file-change="updateBackground('img', $event)" />
  </div>
  <!-- <div flex items-center mb-2>
    <div mr-2 flex-none>
      画布尺寸
    </div>
    <div flex items-center>
      <el-input size="small" placeholder="宽" :value="background.width" />
      <div i-uil:asterisk text-4 mx-2 />
      <el-input size="small" placeholder="高" :value="background.height" />
    </div>
    <div />
  </div> -->
  <div flex items-top mb-2>
    <div mr-2 flex-none>
      画布尺寸
    </div>
    <div flex flex-col items-center flex-1 style="margin-top: -4px">
      <div
        v-for="item in PREDEFINE_SIZE"
        :key="item.id"
        w-full p-1 m-1 rounded-1 dark:bg-gray-9 hover:dark:bg-gray-8 bg-gray-1 hover:bg-gray-2
        cursor-pointer
        :class="activeSize === item.id && 'color-primary'"
        @click="activeSize = item.id"
      >
        {{ item.name }}
        {{ item.width }} * {{ item.height }}
      </div>
    </div>
    <div />
  </div>
</template>
