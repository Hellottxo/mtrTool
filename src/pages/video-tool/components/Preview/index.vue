<script setup lang="ts" name="Preview">
import type { UploadFile } from 'ant-design-vue'
import { ACCEPT } from '~/pages/img-tool/config/index'

const props = defineProps<{ convert: string[]; files: UploadFile[]; active: string }>()
const buttonRef = ref()
const handleUpload = () => {
  buttonRef.value.$el.click()
}
const showConvert = ref(true)

const prevewMtrIndex = computed(() => props.files.findIndex(e => e.uid === props.active))
</script>

<template>
  <div w-full h-full relative bg-gray-1>
    <div v-if="!files.length" w-full h-full cursor-pointer @click="handleUpload">
      <div hidden>
        <a-upload
          :file-list="files"
          list-type="picture-card"
          :before-upload="() => false"
          name="file"
          :accept="ACCEPT.join(',')"
          multiple
          @change="$emit('fileChange', $event)"
        >
          <a-button ref="buttonRef" />
        </a-upload>
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
      <div v-show="!convert.length || !showConvert" flex flex-1 items-center justify-center>
        <img :src="files[prevewMtrIndex].url">
      </div>
      <div v-show="convert.length && showConvert" flex flex-1 items-center justify-center overflow-auto>
        <img :src="convert[prevewMtrIndex]">
      </div>
      <div m-y-5 text-center>
        <a-radio-group v-if="convert.length" v-model:value="showConvert">
          <a-radio-button :value="false">
            before
          </a-radio-button>
          <a-radio-button :value="true">
            after
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>
