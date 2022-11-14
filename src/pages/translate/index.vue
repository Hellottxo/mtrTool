<script setup lang="ts">
import type { UploadUserFile } from 'element-plus'
import type { FORMAT_OPTIONS } from './config'
import Toolbar from './components/Toolbar/index.vue'
import Preview from './components/Preview/index.vue'
import { convertImage } from '~/utils/translate'
import type { ConvertConfig } from '~/utils/translate'
import { getArrayBuffer, getBase64 } from '~/utils/utils.js'

const files = ref<UploadFile[]>([])

const spinning = ref(false)
const convertURL = ref<string[]>([])
const active = ref('')

const handleConvert = (type: string, config: ConvertConfig, outputExt: typeof FORMAT_OPTIONS[number]) => {
  spinning.value = true
  Promise.all(files.value.map(i => getArrayBuffer(i.raw!))).then(async (res) => {
    const list = files.value.map((e, i) => ({ file: e, arrayBuffer: res[i] as string }))
    const output = await convertImage(type, list, outputExt, config)
    if (!output) {
      spinning.value = false
      return
    }
    console.log(output)
    convertURL.value = (output || []).map(e => URL.createObjectURL(new Blob([e.buffer])))
    files.value = convertURL.value
      .map((_, i) => new File([output[i].buffer], `output-${i}.jpg`, { type: 'image/jpg' }))
    spinning.value = false
  })
}

const fileChange = (file: UploadUserFile) => {
  files.value = [file]
  console.log(file)
  !active.value && (active.value = file.uid)
  Promise.all([getBase64(file.raw)])
    .then((res) => {
      files.value = [file].map((e, i) => ({ ...e, url: res[i] as string }))
    })
  handleConvert('convert', {}, 'png')
  // handleConvert('readInfo', {}, 'png')
}

const activeChange = (id: string) => active.value = id
</script>

<template>
  <div v-loading="spinning" flex h-full>
    <Toolbar
      :files="files"
      :active="active"
      :convert="convertURL"
      @handleConvert="handleConvert"
      @file-change="fileChange"
      @activeChg="activeChange"
    />
    <Preview
      border-l-1 border-gray-1 dark:border-gray-7
      :convert="convertURL"
      :files="files"
      :active="active"
      @file-change="fileChange"
    />
  </div>
</template>

<style>
.ant-spin-container {
  height: 100%;
}
</style>
