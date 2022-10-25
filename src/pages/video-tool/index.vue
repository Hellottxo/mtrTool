<script setup lang="ts">
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import type { UploadFile } from 'ant-design-vue'
import Toolbar from './components/Toolbar/index.vue'
import Preview from './components/Preview/index.vue'
import { OUTPUT_TRANSLATE } from './config'
import { getBase64 } from '~/utils/utils.js'
import { generateConvertCommand, generateThreeCommand } from '~/utils/video'
import type { ConvertConfig } from '~/utils/video'

const ffmpeg = createFFmpeg({
  log: true,
})
ffmpeg.load().then(async () => {
  ffmpeg.FS('writeFile', 'font.ttf', await fetchFile('/src/assets/font.ttf'))
})

ffmpeg.setProgress(({ ratio }) => {
  progress.value = ratio === 1 ? -1 : Number((ratio * 100).toFixed(2))
  console.log(progress.value)
  /*
    * ratio is a float number between 0 to 1.
    */
})

const convertURL = ref<string[]>([])
const active = ref('')
const form = reactive<ConvertConfig>({
  outputExt: 'mp4',
  quality: 60,
  width: undefined,
  height: undefined,
  editType: '',
  watermarkText: '',
  watermarkTextColor: 'black',
  watermarkTextSize: 60,
})
const progress = ref(-1)

const files = ref<UploadFile[]>([])
const fileChg = ({ fileList }: { fileList: UploadFile[] }) => {
  console.log(fileList)
  files.value = [...fileList]
  !active.value && (active.value = files.value[0].uid)
  Promise.all(fileList.map(e => getBase64(e.originFileObj as File)))
    .then((res) => {
      files.value = fileList.map((e, i) => ({ ...e, url: res[i] as string }))
    })
}

const handleConvert = async () => {
  progress.value = 0
  const start = Date.now()
  ffmpeg.FS('writeFile', files.value[0].name, await fetchFile(files.value[0].originFileObj as File))
  let input = files.value[0].name
  if (form.editType === 'three') {
    input = `output.${form.outputExt}`
    await ffmpeg.run(...generateThreeCommand(files.value[0].name, form))
    console.log(1)
  }
  else {
    await ffmpeg.run(...generateConvertCommand(files.value[0].name, form))
  }

  const cost = (Date.now() - start) / 1000
  console.log(`耗时: ${cost} s`)
  const data = ffmpeg.FS('readFile', `output.${form.outputExt}`)
  convertURL.value = [URL.createObjectURL(
    new Blob([data.buffer], { type: OUTPUT_TRANSLATE[form.outputExt] }),
  )]
}

const updateForm = (key: string, val: string) => form[key] = val

const activeChg = (id: string) => active.value = id

const delMtr = (id: string) => {
  const index = files.value.findIndex(e => e.uid === id)
  index > -1 && files.value.splice(index, 1)
  id === active.value && (active.value = files.value?.[0]?.uid || '')
}
</script>

<template>
  <div flex h-full>
    <Toolbar
      :files="files"
      :active="active"
      :form="form"
      :convert="convertURL"
      @handleConvert="handleConvert"
      @fileChg="fileChg"
      @activeChg="activeChg"
      @updateForm="updateForm"
      @del="delMtr"
    />
    <Preview
      type="video"
      border-l-1 border-gray-1 dark:border-gray-7
      :convert="convertURL"
      :files="files"
      :active="active"
      :form="form"
      :progress="progress"
      @file-change="fileChg"
    />
  </div>
</template>

<style>
.ant-spin-container {
  height: 100%;
}
</style>
