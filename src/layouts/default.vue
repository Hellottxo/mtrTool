<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const MENU = [
  { path: '/psd-translate', name: '素材翻译' },
  { path: '/video-tool', name: '视频创编' },
  { path: '/img-tool', name: '图片创编' },
]
const currentPath = ref('/img-tool')
const handleChange = (e: string) => {
  currentPath.value = e
  router.push({ path: e })
}

watch(() => route.path, () => {
  if (route.path !== currentPath.value)
    currentPath.value = route.path as string
}, { immediate: true })
</script>

<template>
  <section class="layout h-full" dark:text-gray-200 flex flex-col text-3>
    <div flex items-center justify-between border-b-0 leading-10 p-4 class=" h-[41px]">
      <div flex items-center>
        <div px-4 i-fxemoji:blossom />
        <span text-4>创编工具</span>
        <el-select ref="select" v-model="currentPath" size="small" style="width: 120px" ml-4 @change="handleChange">
          <el-option v-for="item in MENU" :key="item.path" :value="item.path" :label="item.name" />
        </el-select>
      </div>
      <HeaderLink />
    </div>
    <div overflow-hidden flex-1 dark:text-gray-200>
      <div h-full w-full border-t-1 border-gray-1 dark:border-gray-7>
        <RouterView />
      </div>
    </div>
  </section>
</template>
