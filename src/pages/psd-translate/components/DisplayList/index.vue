<script lang="ts" setup name="PreviewList">
import type { UploadFile } from 'ant-design-vue/es/upload'

const props = defineProps<{ list: UploadFile[]; active: string }>()
const emit = defineEmits(['activeChg'])

const showHover = ref('')

const handleActive = (id: string) => {
  emit('activeChg', id)
}
</script>

<template>
  <div flex items-center w-full flex-wrap>
    <div
      v-for="item in list"
      :key="item.uid"
      cursor-pointer w-28 h-24 shrink-0 border-gray-1 border-1 flex-nowrap relative m-r-2 m-b-2 hover:border-gray-7 hover:border-2 hover:border-dashed
      :class="active === item.uid && 'border-gray-7 border-dashed border-2'"
      @click="handleActive(item.uid)"
    >
      <div relative w-full h-full bg-gray-1>
        <div i-carbon:close-filled absolute right-1 top-1 transition-all color-gray-4 hover:color-primary />
        <img :src="item.url" object-contain w-full h-full>
      </div>
    </div>
  </div>
</template>
