<script setup lang="ts" name="Toolbar">
import type { UploadUserFile } from 'element-plus'
import { ACCEPT } from '~/pages/img-tool/config/index'
import { getBase64 } from '~/utils/utils'

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
    :accept="ACCEPT.join(',')"
    multiple
    :auto-upload="false"
    :show-file-list="false"
    @change="fileChange"
  >
    <div flex items-center>
      <slot>
        <el-button size="small">
          上传
        </el-button>
      </slot>
    </div>
  </el-upload>
</template>
