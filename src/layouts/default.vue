<script setup lang="ts">
const { t } = useI18n()
const selectedKeys = ref<string[]>(['2'])
</script>

<template>
  <section class="layout h-full" bg-white dark:text-gray-200 flex flex-col>
    <div flex items-center bg-white justify-between border-b-0 leading-10 p-4 dark:bg-black class=" h-[41px]">
      <div flex items-center>
        <div i-fxemoji:crystalball px-4 />
        materialTool
      </div>
      <HeaderLink />
    </div>
    <div h-full bg-white dark:text-gray-200 dark:bg-black>
      <div h-full w-full border-t-1 border-gray-1 dark:border-purple-4>
        <RouterView />
      </div>
    </div>
  </section>
</template>
