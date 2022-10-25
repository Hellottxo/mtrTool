<script setup lang="ts" name="Preview">
import type { UploadFile } from 'ant-design-vue'
import { ACCEPT } from '~/pages/img-tool/config/index'

const props = defineProps<{ convert: string[]; files: UploadFile[]; active: string }>()
const buttonRef = ref()
const handleUpload = () => {
  console.log(1)
  buttonRef.value.$el.click()
}

const prevewMtrIndex = computed(() => props.files.findIndex(e => e.uid === props.active))
</script>

<template>
  <div w-full h-full relative bg-gray-1>
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
          Image Converter
        </div>
        <div text-6 font-black w-100>
          Drag in or select images or CtrlC+V
        </div>
      </div>
    </div>

    <div v-else flex flex-col w-full h-full cursor-pointer>
      <div v-show="convert.length" flex flex-1 items-center justify-center overflow-auto>
        <img :src="convert[prevewMtrIndex]">
      </div>
    </div>
  </div>
</template>
