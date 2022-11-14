<script setup lang="ts" name="layer">
import draggable from 'vuedraggable'
import { SYMBOL_MAP } from '../../config/index'

const props = defineProps<{ layerList: Record<string, string>[]; activeLayer: Record<string, string>[] }>()
const emit = defineEmits(['updateLayer', 'selectLayer'])

const handleChange = (e: any) => {
  emit('updateLayer', e.moved)
}
</script>

<template>
  <el-divider content-position="left">
    图层
  </el-divider>
  <draggable
    :model-value="layerList"
    tag="transition-group"
    :component-data="{ name: 'fade' }"
    handle=".handle"
    @change="handleChange"
  >
    <template #item="{ element: item }">
      <li
        :key="item.id"
        text-3
        cursor-pointer flex items-center mb-1 p-1 rounded-1 dark:bg-gray-9 hover:dark:bg-gray-8 bg-gray-1 hover:bg-gray-2 justify-between
        :class="activeLayer.find(e => e.id === item.id) && 'color-primary'"
        @click="$emit('selectLayer', [item])"
      >
        <div flex items-center overflow-hidden>
          <div :class="SYMBOL_MAP[item.type].icon" mr-2 />
          <div>|</div>
          <div ml-2 truncate flex-1 :title="item.name">
            {{ item.name || item.text || SYMBOL_MAP[item.type].name }}
          </div>
        </div>
        <div flex items-center flex-none>
          <div i-uil:trash-alt m-x-1 @click.stop="$emit('delLayer', item.id)" />
          <div i-carbon:draggable class="handle" cursor-all-scroll m-x-1 />
        </div>
      </li>
    </template>
  </draggable>
</template>
