<template>
  <div :class="$style.container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ HTMLAttributes {}

defineProps<Props>()
</script>

<style lang="scss" module>
.container {
  @include color-ui-tertiary;
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>
