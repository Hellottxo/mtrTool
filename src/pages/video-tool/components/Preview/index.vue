<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus'
import { IMG_ACCEPT } from '~/config/index'
import type { ConvertConfig } from '~/utils/video'

const props = defineProps<{
  form: ConvertConfig
  convert: string[]
  file?: UploadUserFile
  type: string
  maskFile: { up?: UploadUserFile; down?: UploadUserFile }
}>()
const emit = defineEmits(['updateRatio'])
const video = ref()

const onLoaded = () => {
  const ratio = video.value.clientWidth / video.value.clientHeight
  emit('updateRatio', ratio)
}
</script>

<template>
  <div class="video-preview" flex flex-col w-full h-full justify-center items-center dark:bg-gray-9 bg-gray-1 overflow-hidden>
    <div v-if="file" flex flex-col justify-center :style="`height: ${form.height / 2}px; width: ${form.width / 2}px`">
      <Upload
        v-if="['mask', 'up-mask'].includes(type) && !convert.length"
        :accept="IMG_ACCEPT.join(',')"
        :class="maskFile.up && 'border-none'" transition-all
        overflow-hidden w-full flex-1 h-full
        hover:rounded-1 h-30 flex items-center
        justify-center border-2 border-dashed
        dark:border-gray-7
        border-gray
        border-b-none
        @file-change="$emit('fileChg', 'up', $event)"
      >
        <img v-if="maskFile.up" :src="maskFile.up.url" class="avatar" w-full h-full>
        <div v-else i-carbon:add text-10 />
      </Upload>
      <div w-full>
        <video ref="video" controls :src="convert[0] || file.url" @canplay="onLoaded" @play="onClick('play')" @pause="onClick('pause')" />
      </div>

      <Upload
        v-if="['mask', 'down-mask'].includes(type) && !convert.length"
        :accept="IMG_ACCEPT.join(',')"
        :class="maskFile.down && 'border-none'" transition-all
        overflow-hidden w-full flex-1 h-full
        hover:rounded-1 h-30 flex items-center
        justify-center border-2 border-dashed
        dark:border-gray-7
        border-gray
        border-t-none
        @file-change="$emit('fileChg', 'down', $event)"
      >
        <img v-if="maskFile.down" :src="maskFile.down.url" class="avatar" w-full h-full>
        <div v-else i-carbon:add text-10 />
      </Upload>
    </div>
    <div v-else i-fxemoji:filmprojector text-30 />
  </div>
</template>

<style>
.video-preview .el-upload, .video-preview .el-upload > div {
  height: 100%;
  width: 100%;
}
</style>
