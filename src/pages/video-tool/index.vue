<script setup lang="ts">
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import type { UploadUserFile } from 'element-plus'
import Toolbar from './components/Toolbar/index.vue'
import VideoTemplate from './components/VideoTemplate/index.vue'
import Preview from './components/Preview/index.vue'
import { OUTPUT_TRANSLATE } from './config'
import { generateConvertCommand, generateThreeCommand } from '~/utils/video'
import type { ConvertConfig } from '~/utils/video'

const progress = ref(-1)
const file = ref<UploadUserFile>()
const maskFile = reactive<{ up?: UploadUserFile; down?: UploadUserFile }>({})

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

const handleConvert = async () => {
  progress.value = 0
  if (!file.value)
    return
  const start = Date.now()
  ffmpeg.FS('writeFile', file.value.name, await fetchFile(file.value.raw as File))
  let input = file.value.name
  if (form.editType.includes('stack')) {
    input = `output.${form.outputExt}`
    await ffmpeg.run(...generateThreeCommand(file.value.name, form))
    console.log(1)
  }
  else {
    await ffmpeg.run(...generateConvertCommand(file.value.name, form))
  }

  const cost = (Date.now() - start) / 1000
  console.log(`耗时: ${cost} s`)
  const data = ffmpeg.FS('readFile', `output.${form.outputExt}`)
  convertURL.value = [URL.createObjectURL(
    new Blob([data.buffer], { type: OUTPUT_TRANSLATE[form.outputExt] }),
  )]
}

const updateForm = (key: string, val: string) => form[key] = val

const fileChg = (item: UploadUserFile) => file.value = item

const activeChg = (type: ConvertConfig['editType']) => form.editType = type

const updateMaskFile = (key: 'up' | 'down', val: UploadUserFile) => maskFile[key] = val
</script>

<template>
  <div flex h-full>
    <VideoTemplate

      :type="form.editType"
      @active-chg="activeChg"
    />
    <Preview
      :file="file"
      :type="form.editType"
      :mask-file="maskFile"
      @fileChg="updateMaskFile"
    />
    <Toolbar
      border-l-1 border-color w-80
      :file="file"
      :active="active"
      :form="form"
      :convert="convertURL"
      @handleConvert="handleConvert"
      @fileChg="fileChg"
      @updateForm="updateForm"
    />
  </div>
</template>

<style>
.ant-spin-container {
  height: 100%;
}
</style>
