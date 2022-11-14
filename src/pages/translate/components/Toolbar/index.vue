<script setup lang="ts" name="Toolbar">
import Tesseract from 'tesseract.js'
import type { UploadUserFile } from 'element-plus'
import List from '../DisplayList/index.vue'
import { IMG_ACCEPT } from '~/config/index'
import { downloadByURL } from '~/utils/utils'

// const downMode = ref('zip')
const props = defineProps<{ convert: string[]; files: UploadUserFile[]; active: string }>()

const emit = defineEmits(['handleConvert', 'activeChg'])
const outputExt = ref('jpg')
const quality = ref(60)
const size = reactive({
  width: '',
  height: '',
})
const text = ref('')
const handle = (val: string) => {
  const config = {
    quality: outputExt.value === 'png' ? 0 : quality.value,
    width: size.width,
    height: size.height,
  }
  emit('handleConvert', val, config, outputExt.value)
}
const download = () => {
  downloadByURL(props.convert[0], `output.${outputExt.value}`)
}
const getText = async () => {
  const list = props.convert.slice(0, 1).map(e =>
    Tesseract.recognize(
      e,
      'chi_sim',
      { logger: m => console.log(m) },
    ))
  Promise.all(list).then((res) => {
    text.value = res[0].data.text
  })
}
</script>

<template>
  <div w-full h-full max-w-lg p-y-4 p-x-4>
    <List
      v-if="files.length"
      type="img"
      :list="files"
      w-full
      :active="active"
      :convert="convert"
      @active-chg="$emit('activeChg', $event)"
    />

    <el-upload
      :file-list="files"
      list-type="picture-card"
      :before-upload="() => false"
      name="file"
      accept=".psd"
      multiple
      :show-upload-list="false"
      @change="$emit('fileChange', $event)"
    >
      <div i-fxemoji:up text-5 />
    </el-upload>
    <div>
      <div flex items-center p-y-2 rounded-2 m-b-2>
        <el-button v-if="convert.length" @click="getText">
          提取文字
        </el-button>
      </div>
    </div>
    <div>{{ text }}</div>
  </div>
</template>
