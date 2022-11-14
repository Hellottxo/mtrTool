<script setup lang="ts">
const router = useRouter()
const route = useRoute()

watch(() => route.path, () => {
  if (route.path === '/')
    router.push({ path: '/img-tool' })
}, { immediate: true })
</script>

<template>
  <RouterView />
</template>

