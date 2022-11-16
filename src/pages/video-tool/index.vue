<script setup lang="ts">
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import type { UploadUserFile } from 'element-plus'
import Toolbar from './components/Toolbar/index.vue'
import VideoTemplate from './components/VideoTemplate/index.vue'
import Preview from './components/Preview/index.vue'
import { OUTPUT_TRANSLATE } from './config'
import {
  generateHtoVCommand,
  generateMaskCommand,
  generatePadCommand,
  generateThreeCommand,
} from '~/utils/video'
import type { ConvertConfig } from '~/utils/video'

const initial = {
  outputExt: 'mp4',
  quality: 60,
  width: 720,
  height: 1280,
  editType: 'htov',
  watermarkText: '',
  watermarkTextColor: 'black',
  watermarkTextSize: 60,
} as ConvertConfig

const moduleLoading = ref(true)
const progress = ref(-1)
const file = ref<UploadUserFile>()
const maskFile = reactive<{ up?: UploadUserFile; down?: UploadUserFile }>({})
const videoRatio = ref(1)
const convertURL = ref<string[]>([])
const active = ref('')
const form = reactive<ConvertConfig>({ ...initial })
const loading = reactive({
  count: 0,
  current: 0,
})

const ffmpeg = createFFmpeg({
  log: true,
})
ffmpeg.load().then(async () => {
  moduleLoading.value = false
  ffmpeg.FS('writeFile', 'font.ttf', await fetchFile('/src/assets/font.ttf'))
})

ffmpeg.setProgress(({ ratio }) => {
  progress.value = ratio === 1 ? -1 : Number((ratio * 100).toFixed(2))
  console.log(progress.value)
  /*
    * ratio is a float number between 0 to 1.
    */
})

const reset = () => {
  progress.value = -1
  maskFile.up = undefined
  maskFile.down = undefined
  videoRatio.value = 1
  convertURL.value = []
  active.value = ''
  Object.entries(initial).forEach(([key, val]) => form[key] = val)
}

const handleConvert = async () => {
  progress.value = 0
  if (!file.value)
    return
  const start = Date.now()
  let outputFileName = 'output'
  ffmpeg.FS('writeFile', file.value.name, await fetchFile(file.value.raw as File))
  let input = file.value.name
  // 三联屏
  if (form.editType.includes('stack')) {
    loading.count = 1
    loading.current = 1
    input = `output.${form.outputExt}`
    await ffmpeg.run(...generateThreeCommand([file.value.name, file.value.name, file.value.name], form))
  }
  const videoHeight = form.height! / videoRatio.value

  if (form.editType === 'up-mask') {
    if (!maskFile.up)
      return ElMessage.warning('请添加上蒙版！')
    loading.count = 4
    loading.current = 1
    ffmpeg.FS('writeFile', maskFile.up?.name, await fetchFile(maskFile.up?.raw as File))
    await ffmpeg.run(...(`-i ${file.value.name} -vf scale=${form.height}:-2 main.mp4`.split(' ')))
    loading.current++
    await ffmpeg.run(...generatePadCommand('up-mask', 'main.mp4', form))
    loading.current++
    await ffmpeg.run(...(`-i ${maskFile.up.name} -vf scale=${form.height}:${1280 - videoHeight} up.png`.split(' ')))
    loading.current++
    await ffmpeg.run(...generateMaskCommand('pad.mp4', 'up-mask', 0))
    outputFileName = form.editType
  }

  if (form.editType === 'down-mask') {
    if (!maskFile.down)
      return ElMessage.warning('请添加下蒙版！')
    loading.count = 4
    loading.current = 1
    ffmpeg.FS('writeFile', maskFile.down?.name, await fetchFile(maskFile.down?.raw as File))
    await ffmpeg.run(...(`-i ${file.value.name} -vf scale=${form.height}:-2 main.mp4`.split(' ')))
    loading.current++
    await ffmpeg.run(...generatePadCommand('down-mask', 'main.mp4', form))
    loading.current++
    await ffmpeg.run(...(`-i ${maskFile.down.name} -vf scale=${form.height}:${1280 - videoHeight} down.png`.split(' ')))
    loading.current++
    await ffmpeg.run(...generateMaskCommand('pad.mp4', 'down-mask', videoHeight))
    outputFileName = form.editType
  }

  if (form.editType === 'mask') {
    if (!maskFile.up || !maskFile.down)
      return ElMessage.warning('请添加上下蒙版！')
    loading.count = 6
    const imgHeight = (1280 - videoHeight) / 2
    ffmpeg.FS('writeFile', maskFile.down?.name, await fetchFile(maskFile.down?.raw as File))
    ffmpeg.FS('writeFile', maskFile.up?.name, await fetchFile(maskFile.up?.raw as File))
    await ffmpeg.run(...(`-i ${file.value.name} -vf scale=${form.height}:-2 main.mp4`.split(' ')))
    loading.current++
    await ffmpeg.run(...generatePadCommand('mask', 'main.mp4', form))
    loading.current++
    await ffmpeg.run(...(`-i ${maskFile.down.name} -vf scale=${form.height}:${imgHeight} down.png`.split(' ')))
    loading.current++
    await ffmpeg.run(...(`-i ${maskFile.up.name} -vf scale=${form.height}:${imgHeight} up.png`.split(' ')))
    loading.current++
    await ffmpeg.run(...generateMaskCommand('pad.mp4', 'up-mask', 0))
    loading.current++
    await ffmpeg.run(...generateMaskCommand('up-mask.mp4', 'down-mask', videoHeight + imgHeight))
    outputFileName = 'down-mask'
  }

  if (form.editType === 'htov') {
    loading.count = 1
    loading.current = 1
    await ffmpeg.run(...generateHtoVCommand(file.value.name, form))
  }

  const cost = (Date.now() - start) / 1000
  console.log(`耗时: ${cost} s`)
  const data = ffmpeg.FS('readFile', `${outputFileName}.${form.outputExt}`)
  convertURL.value = [URL.createObjectURL(
    new Blob([data.buffer], { type: OUTPUT_TRANSLATE[form.outputExt] }),
  )]
  loading.count = 0
  loading.current = 0
}

const updateForm = (key: string, val: string) => form[key] = val

const fileChg = (item: UploadUserFile) => file.value = item

const activeChg = (type: ConvertConfig['editType']) => form.editType = type

const updateMaskFile = (key: 'up' | 'down', val: UploadUserFile) => maskFile[key] = val
</script>

<template>
  <div v-loading="moduleLoading" flex h-full element-loading-text="依赖加载中，请稍等...">
    <VideoTemplate
      :type="form.editType"
      @active-chg="activeChg"
    />
    <Preview
      v-loading="loading.count !== 0"
      element-loading-text="`全力以赴处理中，请稍等...`"
      :file="file"
      :type="form.editType"
      :mask-file="maskFile"
      :convert="convertURL"
      :form="form"
      @fileChg="updateMaskFile"
      @updateRatio="videoRatio = $event"
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
      @reset="reset"
    />
  </div>
</template>

<style>
.ant-spin-container {
  height: 100%;
}
</style>
