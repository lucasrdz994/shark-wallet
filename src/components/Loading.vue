<script setup>
  // Props
  defineProps({
    color: {
      type: String,
      default: '#1989fa'
    }
  })
</script>

<template>
  <div class="loading">
    <van-loading :color="color" />
  </div>
</template>
