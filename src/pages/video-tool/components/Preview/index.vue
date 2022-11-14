<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus'
import { IMG_ACCEPT } from '~/config/index'

const props = defineProps<{
  file?: UploadUserFile
  type: string
  maskFile: { up?: UploadUserFile; down?: UploadUserFile }
}>()
const video1 = ref()
const video2 = ref()
const video = ref()
const upMask = ref()

const onClick = (type: 'play' | 'pause') => {
  if (props.type !== 'three')
    return;
  [video1, video2].forEach((e) => {
    if (!e.value)
      return
    type === 'play' && e.value.play()
    type === 'pause' && e.value.pause()
  })
}
</script>

<template>
  <div flex flex-col w-full h-full justify-center items-center dark:bg-gray-9 bg-gray-1 overflow-hidden>
    <div v-if="file" flex flex-col>
      <Upload
        v-if="['mask', 'up-mask'].includes(type)"
        :accept="IMG_ACCEPT.join(',')"
        :class="maskFile.up && 'border-none'" transition-all
        max-w-70 overflow-hidden
        hover:rounded-1 h-30 flex items-center
        justify-center border-2 border-dashed
        dark:border-gray-7
        border-gray
        border-b-none
        @file-change="$emit('fileChg', 'up', $event)"
      >
        <img v-if="maskFile.up" :src="maskFile.up.url" class="avatar">
        <div v-else i-carbon:add text-10 />
      </Upload>
      <div v-if="type.includes('stack')" max-w-70>
        <video ref="video1" height="300" width="300" :src="file.url" />
      </div>
      <div v-if="type.includes('stack')" max-w-70>
        <video ref="video2" height="300" width="300" :src="file.url" />
      </div>
      <div max-w-70>
        <video ref="video" height="300" width="300" controls :src="file.url" @play="onClick('play')" @pause="onClick('pause')" />
      </div>

      <Upload
        v-if="['mask', 'down-mask'].includes(type)"
        :accept="IMG_ACCEPT.join(',')"
        :class="maskFile.down && 'border-none'" transition-all
        max-w-70 overflow-hidden
        hover:rounded-1 h-30 flex items-center
        justify-center border-2 border-dashed
        dark:border-gray-7
        border-gray
        border-t-none
        @file-change="$emit('fileChg', 'down', $event)"
      >
        <img v-if="maskFile.down" :src="maskFile.down.url" class="avatar">
        <div v-else i-carbon:add text-10 />
      </Upload>
    </div>
    <div v-else i-fxemoji:filmprojector text-30 />
  </div>
</template>

