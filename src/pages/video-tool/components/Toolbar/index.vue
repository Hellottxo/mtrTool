<script setup lang="ts" name="Toolbar">
import type { UploadFile } from 'ant-design-vue'
import { ACCEPT, FORMAT_OPTIONS } from '~/pages/img-tool/config/index'
// const downMode = ref('zip')
const props = defineProps<{ files: UploadFile[]; active: string }>()

const emit = defineEmits(['handleConvert', 'activeChg'])
const outputExt = ref('jpg')
const quality = ref(60)
const size = reactive({
  width: 1024,
  height: 1024,
})
const handle = (val: string) => {
  const config = {
    quality: outputExt.value === 'png' ? 0 : quality.value,
    width: size.width,
    height: size.height,
  }
  emit('handleConvert', val, config, outputExt.value)
}
</script>

<template>
  <div w-full h-full max-w-lg p-y-4 p-x-4>
    <DisplayList v-if="files.length" :list="files" w-full :active="active" @active-chg="$emit('activeChg', $event)" />

    <a-upload
      :file-list="files"
      list-type="picture-card"
      :before-upload="() => false"
      name="file"
      :accept="ACCEPT.join(',')"
      multiple
      :show-upload-list="false"
      @change="$emit('fileChange', $event)"
    >
      <div i-fxemoji:up text-5 />
    </a-upload>
    <div>
      <div flex items-center p-y-2 rounded-2 m-b-2>
        <span text-4 m-r-4>format</span>
        <a-select
          ref="select"
          v-model:value="outputExt"
          style="width: 120px"
        >
          <a-select-option v-for="item in FORMAT_OPTIONS" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </div>
      <div v-if="outputExt !== 'png'" flex items-center p-y-2 rounded-2 m-b-2>
        <span text-4 m-r-4>quality</span>
        <a-slider v-model:value="quality" class="w-full m-r-4" :tip-formatter="null" />
        <div>{{ quality }}%</div>
      </div>
      <div flex items-center p-y-2 rounded-2 m-b-2>
        <span text-4 m-r-4>size</span>
        <a-input v-model:value="size.width" />
        <span>✖️</span>
        <a-input v-model:value="size.height" />
      </div>
      <div flex items-center p-y-2 rounded-2 m-b-2>
        <a-button @click="handle('convert')">
          convert
        </a-button>
        <!-- <a-button @click="handle('composite')">
          composite
        </a-button> -->
        <!-- <span text-4 m-r-4>quality</span>
        <a-slider v-model:value="quality" class="w-full m-r-4" :tip-formatter="null" />
        <div>{{ quality }}%</div> -->
      </div>
      <!-- <div flex items-center p-y-2 rounded-2>
        <span text-4 m-r-4>download mode</span>
        <a-radio-group v-model:value="downMode" button-style="solid">
          <a-radio-button value="zip">
            zip
          </a-radio-button>
          <a-radio-button value="single">
            single
          </a-radio-button>
        </a-radio-group>
      </div> -->
    </div>
  </div>
</template>
