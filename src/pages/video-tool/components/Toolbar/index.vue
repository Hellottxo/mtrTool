<script setup lang="ts" name="Toolbar">
import party from 'party-js'
import { FORMAT_OPTIONS } from '../../config/index'
import { downloadByURL } from '~/utils/utils'
import { PREDEFINE_COLOR, VIDEO_ACCEPT } from '~/config/index'

// const downMode = ref('zip')
const props = defineProps<{
  active: string
  form: Record<string, any>
  convert: string[]
}>()

const emit = defineEmits(['handleConvert', 'updateForm', 'fileChg'])

const handle = (val: string) => {
  emit('handleConvert', val)
}

const updateFormData = (key: string, val: string) => {
  emit('updateForm', key, val)
}
const download = () => {
  downloadByURL(props.convert[0], `output.${props.form.outputExt}`)
}

const PREDEFINE_SIZE = [
  { width: 720, height: 1280, name: '竖版', id: 1 },
  { width: 1280, height: 720, name: '横版', id: 2 },
]
</script>

<template>
  <div h-full max-w-lg p-x-4>
    <el-divider content-position="left">
      操作
    </el-divider>
    <div flex items-center>
      <Upload :accept="VIDEO_ACCEPT.join(',')" @file-change="$emit('fileChg', $event)">
        <el-button size="small" type="primary">
          上传
        </el-button>
      </Upload>
      <el-divider direction="vertical" />
      <el-button size="small" mr-2 @click="handle('convert')">
        生成
      </el-button>
      <el-divider direction="vertical" />
      <el-button :disabled="!convert.length" size="small" mr-2 @click="party.confetti($event); download()">
        下载
      </el-button>
    </div>
    <div>
      <el-divider content-position="left">
        基础信息
      </el-divider>

      <div flex items-center rounded-2 m-b-2>
        <span mr-2 shrink-0>宽度</span>
        <el-input-number size="small" :model-value="form.width" :min="0" @change="updateFormData('width', $event)" />
      </div>
      <div flex items-center rounded-2 m-b-2>
        <span mr-2 shrink-0>高度</span>
        <el-input-number size="small" :model-value="form.height" :min="0" @change="updateFormData('height', $event)" />
      </div>
      <div flex items-center rounded-2 m-b-2>
        <span mr-2>导出格式</span>
        <el-select
          ref="select"
          :model-value="form.outputExt"
          style="width: 120px"
          size="small"
          @change="updateFormData('outputExt', $event)"
        >
          <el-option v-for="item in FORMAT_OPTIONS" :key="item" :value="item">
            {{ item }}
          </el-option>
        </el-select>
      </div>
      <div flex items-top mb-2>
        <div mr-2 flex-none>
          画布尺寸
        </div>
        <div flex flex-col items-center flex-1 style="margin-top: -4px">
          <div
            v-for="item in PREDEFINE_SIZE"
            :key="item.id"
            w-full p-1 m-1 rounded-1 dark:bg-gray-9 hover:dark:bg-gray-8 bg-gray-1 hover:bg-gray-2
            cursor-pointer
            :class="activeSize === item.id && 'color-primary'"
            @click="activeSize = item.id"
          >
            {{ item.name }}
            {{ item.width }} * {{ item.height }}
          </div>
        </div>
      </div>
      <!-- <div v-if="form.outputExt !== 'png'" flex items-center rounded-2 m-b-2>
        <span mr-2 >品质</span>
        <el-slider
          :value="form.quality"
          class="flex-1"
          :tip-formatter="null"
          @change="updateFormData('quality', $event)"
        />
        <div>{{ form.quality }}%</div>
      </div> -->
      <el-divider content-position="left">
        水印
      </el-divider>
      <div v-if="form.outputExt !== 'png'" flex items-center rounded-2 m-b-2>
        <span mr-2 shrink-0>水印文字</span>
        <el-input
          :value="form.watermarkText"
          placeholder="请添加水印文字"
          size="small"
          @change="updateFormData('watermarkText', $event.target.value)"
        />
      </div>
      <div flex items-center rounded-2 m-b-2>
        <span mr-2 shrink-0>文字颜色</span>
        <el-color-picker :model-value="form.color" size="small" show-alpha :predefine="PREDEFINE_COLOR" @change="$emit('watermarkTextColor', $event)" />
      </div>

      <div flex items-center rounded-2 m-b-2>
        <span mr-2 shrink-0>文字大小</span>
        <el-input-number size="small" :model-value="form.watermarkTextSize" :min="0" @change="$emit('watermarkTextSize', $event)" />
      </div>
    </div>
  </div>
</template>
