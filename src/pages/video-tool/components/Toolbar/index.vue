<script setup lang="ts" name="Toolbar">
import type { UploadFile } from 'ant-design-vue'
import { ACCEPT, FORMAT_OPTIONS, VIDEO_EDIT_OPTIONS } from '../../config/index'
import { downloadByURL } from '~/utils/utils'

// const downMode = ref('zip')
const props = defineProps<{
  files: UploadFile[]
  active: string
  form: Record<string, any>
  convert: string[]
}>()

const emit = defineEmits(['handleConvert', 'activeChg', 'updateForm', 'fileChg', 'del'])

const handle = (val: string) => {
  emit('handleConvert', val)
}

const updateFormData = (key: string, val: string) => {
  emit('updateForm', key, val)
}
const download = () => {
  downloadByURL(props.convert[0], `output.${props.form.outputExt}`)
}
</script>

<template>
  <div w-full h-full max-w-lg p-y-4 p-x-4>
    <DisplayList
      v-if="files.length"
      type="video"
      :list="files"
      w-full
      :active="active"
      @active-chg="$emit('activeChg', $event)"
      @del="$emit('del', $event)"
    />

    <el-upload
      :file-list="files"
      list-type="picture-card"
      :before-upload="() => false"
      name="file"
      :accept="ACCEPT.join(',')"
      multiple
      :open-file-dialog-on-click="true"
      :show-upload-list="false"
      @change="$emit('fileChg', $event)"
    >
      <div i-fxemoji:up text-5 />
    </el-upload>
    <div>
      <div flex items-center p-y-2 rounded-2 m-b-2>
        <span text-4 m-r-4 w-20>格式</span>
        <el-select
          ref="select"
          :value="form.outputExt"
          style="width: 120px"
          @change="updateFormData('outputExt', $event)"
        >
          <el-option v-for="item in FORMAT_OPTIONS" :key="item" :value="item">
            {{ item }}
          </el-option>
        </el-select>
      </div>
      <!-- <div v-if="form.outputExt !== 'png'" flex items-center p-y-2 rounded-2 m-b-2>
        <span text-4 m-r-4 w-20>品质</span>
        <el-slider
          :value="form.quality"
          class="flex-1"
          :tip-formatter="null"
          @change="updateFormData('quality', $event)"
        />
        <div>{{ form.quality }}%</div>
      </div> -->
      <div v-if="form.outputExt !== 'png'" flex items-center p-y-2 rounded-2 m-b-2>
        <span text-4 m-r-4 w-20 shrink-0>水印文字</span>
        <el-input
          :value="form.watermarkText"
          placeholder="请添加水印文字"
          flex-1
          @change="updateFormData('watermarkText', $event.target.value)"
        />
      </div>
      <div v-if="form.outputExt !== 'png'" flex items-center p-y-2 rounded-2 m-b-2>
        <span text-4 m-r-4 w-20 shrink-0>文字颜色</span>
        <el-input
          :value="form.watermarkTextColor"
          type="color"
          @change="updateFormData('watermarkTextColor', $event.target.value)"
        />
        <span text-4 m-r-4 w-20 shrink-0 m-l-4>文字大小</span>
        <el-input
          :value="form.watermarkTextSize"
          addon-after="px"
          @change="updateFormData('watermarkTextSize', $event.target.value)"
        />
      </div>
      <div flex items-center p-y-2 rounded-2 m-b-2>
        <span text-4 m-r-4 w-20 shrink-0>宽</span>
        <el-input
          placeholder="auto"
          :value="form.width" w-4
          @change="updateFormData('width', $event.target.value)"
        />
        <span text-4 m-r-4 w-20 shrink-0 m-l-4>高</span>
        <el-input
          placeholder="auto"
          :value="form.height" w-4
          @change="updateFormData('height', $event.target.value)"
        />
      </div>
      <div flex items-center p-y-2 rounded-2 m-b-2>
        <span text-4 m-r-4 w-20>编辑</span>
        <el-radio-group
          :value="form.editType" :options="VIDEO_EDIT_OPTIONS"
          @change="updateFormData('editType', $event.target.value)"
        />
      </div>
      <div flex items-center p-y-2 rounded-2 m-b-2>
        <el-button @click="handle('convert')">
          生成
        </el-button>
        <el-button v-if="convert.length" @click="download">
          下载
        </el-button>
        <!-- <el-button @click="handle('composite')">
          composite
        </el-button> -->
        <!-- <span text-4 m-r-4 w-20>quality</span>
        <el-slider v-model="quality" class="w-full m-r-4" :tip-formatter="null" />
        <div>{{ quality }}%</div> -->
      </div>
      <!-- <div flex items-center p-y-2 rounded-2>
        <span text-4 m-r-4 w-20>download mode</span>
        <el-radio-group v-model="downMode" button-style="solid">
          <el-radio-button value="zip">
            zip
          </el-radio-button>
          <el-radio-button value="single">
            single
          </el-radio-button>
        </el-radio-group>
      </div> -->
    </div>
  </div>
</template>
