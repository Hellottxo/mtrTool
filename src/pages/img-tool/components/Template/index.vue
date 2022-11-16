<script setup lang="ts">
import lemon from '~/assets/img/lemon.png'
import icecream from '~/assets/img/icecream.png'

const emit = defineEmits(['activeChg'])
const TEMPLATE = [
  { src: lemon, id: 'lemon' },
  { src: icecream, id: 'icecream' },
]
</script>

<template>
  <div id="img-template" h-full max-w-lg p-x-4 w-56>
    <el-divider content-position="left">
      模板
    </el-divider>
    <div flex flex-wrap items-center justify-between style="margin: 0 -8px">
      <div v-for="item in TEMPLATE" :key="item.id" transition-all cursor-pointer hover:scale-x-105 @click="$emit('addJson', item.id)">
        <img :src="item.src" w-24 rounded-1>
      </div>
    </div>
  </div>
</template>
