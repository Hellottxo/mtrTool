<script setup lang="ts" name="Preview">
import type { UploadFile } from 'ant-design-vue'
import { ACCEPT } from '../../config/index'

const props = defineProps<{
  convert: string[]
  files: UploadFile[]
  active: string
  type: 'img' | 'video'
  form: Record<string, string>
  progress: number
}>()
const buttonRef = ref()
const handleUpload = () => {
  buttonRef.value.$el.click()
}
const showConvert = ref(true)

const prevewMtrIndex = computed(() => props.files.findIndex(e => e.uid === props.active))
</script>

<template>
  <div w-full h-full relative bg-gray-1>
    <div v-if="progress >= 0" w-full h-full flex flex-col items-center justify-center>
      <div text-12 font-black mb-10>
        {{ progress }} %
      </div>
      <el-progress
        :percent="progress"
        status="active"
        class="progressbar"
        :show-info="false"
      />
    </div>
    <template v-else>
      <div v-if="!files.length" w-full h-full cursor-pointer @click="handleUpload">
        <div hidden>
          <el-upload
            :file-list="files"
            list-type="picture-card"
            :before-upload="() => false"
            name="file"
            :accept="ACCEPT.join(',')"
            multiple
            @change="$emit('fileChange', $event)"
          >
            <el-button ref="buttonRef" />
          </el-upload>
        </div>
        <div w-full h-full flex flex-col items-center justify-center>
          <div i-fxemoji:milkyway text-30 />
          <div text-12 font-black w-100 m-t-10>
            Video Converter
          </div>
          <div text-6 font-black w-100>
            Drag in or select video or CtrlC+V
          </div>
        </div>
      </div>

      <div v-else flex flex-col justify-center w-full h-full cursor-pointer overflow-hidden>
        <div v-show="!convert.length || !showConvert" flex flex-1 items-center justify-center h-full>
          <video v-if="type === 'video'" :src="files[prevewMtrIndex].url" controls autoplay object-contain />
          <img v-else :src="files[prevewMtrIndex].url">
        </div>
        <div v-show="convert.length && showConvert" flex items-center justify-center overflow-hidden>
          <video v-if="type === 'video' && form.outputExt !== 'gif'" :src="convert[prevewMtrIndex]" controls autoplay object-contain h-full w-auto />
          <img v-else :src="convert[prevewMtrIndex]" object-contain h-full w-auto>
        </div>
        <div m-y-5 text-center>
          <el-radio-group v-if="convert.length" v-model="showConvert">
            <el-radio-button :value="false">
              before
            </el-radio-button>
            <el-radio-button :value="true">
              after
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.progressbar {
  width: 300px;
}
.progressbar .ant-progress-bg {
  height: 40px !important;
}
img, video {
  width: auto;
  height: auto;
  object-fit: contain;
  max-height: 100%;
  max-width: 100%;
}
</style>
