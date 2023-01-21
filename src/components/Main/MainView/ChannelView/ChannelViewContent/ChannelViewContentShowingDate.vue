<template>
  <button :class="$style.container">
    {{ showingDate }}
    <a-icon name="chevron-down" mdi />
  </button>
</template>

<script lang="ts" setup>
import AIcon from '/@/components/UI/AIcon.vue'
defineProps<{
  showingDate: string
}>()
</script>

<style lang="scss" module>
.container {
  position: absolute;
  inset: 12px 0 auto;
  margin: 0 auto;
  padding: 4px 8px;
  width: 140px;
  background-color: white;
  border-radius: 24px;
  text-align: center;
  font-weight: bold;
  border: 1px solid $theme-ui-tertiary-default;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  z-index: $z-index-showing-message-date;
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  &:hover {
    background-color: $theme-background-secondary-default;
  }
}
</style>
