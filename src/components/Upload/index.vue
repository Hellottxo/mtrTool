<script setup lang="ts" name="Toolbar">
import type { UploadUserFile } from 'element-plus'
import { getBase64 } from '~/utils/utils'

const props = defineProps<{ accept: string }>()
const emit = defineEmits(['fileChange'])
const fileChange = async (val: UploadUserFile) => {
  const url = await getBase64(val.raw as File)
  emit('fileChange', { ...val, url })
}
</script>

<template>
  <el-upload
    :before-upload="() => false"
    name="file"
    :accept="accept"
    multiple
    :auto-upload="false"
    :show-file-list="false"
    v-bind="$attrs"
    @change="fileChange"
  >
    <div flex items-center justify-center>
      <slot>
        <el-button size="small">
          上传
        </el-button>
      </slot>
    </div>
  </el-upload>
</template>

