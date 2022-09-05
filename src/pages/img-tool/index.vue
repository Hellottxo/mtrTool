<script setup lang="ts">
import type { UploadFile } from 'ant-design-vue'
import type { FORMAT_OPTIONS } from './config'
import { convertImage } from '~/utils/compress'
import type { ConvertConfig } from '~/utils/compress'
import { getArrayBuffer, getBase64 } from '~/utils/utils.js'

const files = ref<UploadFile[]>([])
const fileChange = ({ fileList }: { fileList: UploadFile[] }) => {
  files.value = [...fileList]
  !active.value && (active.value = files.value[0].uid)
  Promise.all(fileList.map(e => getBase64(e.originFileObj as File)))
    .then((res) => {
      files.value = fileList.map((e, i) => ({ ...e, url: res[i] as string }))
    })
}
const spinning = ref(false)
const convertURL = ref<string[]>([])
const active = ref('')

const handleConvert = (type: string, config: ConvertConfig, outputExt: typeof FORMAT_OPTIONS[number]) => {
  spinning.value = true
  Promise.all(files.value.map(i => getArrayBuffer(i.originFileObj!))).then(async (res) => {
    const list = files.value.map((e, i) => ({ file: e, arrayBuffer: res[i] as string }))
    const output = await convertImage(type, list, outputExt, config)
    convertURL.value = (output || []).map(e => URL.createObjectURL(new Blob([e.buffer])))
    spinning.value = false
  })
}

const activeChange = (id: string) => active.value = id
</script>

<template>
  <a-spin :spinning="spinning" wrapper-class-name="h-full">
    <div flex h-full>
      <Toolbar
        :files="files"
        :active="active"
        @handleConvert="handleConvert"
        @file-change="fileChange"
        @activeChg="activeChange"
      />
      <Preview
        border-l-1 border-gray-1 dark:border-purple-4
        :convert="convertURL"
        :files="files"
        :active="active"
        @file-change="fileChange"
      />
    </div>
  </a-spin>
</template>

<style>
.ant-spin-container {
  height: 100%;
}
</style>
