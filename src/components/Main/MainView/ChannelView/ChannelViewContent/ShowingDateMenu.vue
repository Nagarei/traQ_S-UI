<template>
  <div :class="$style.container">
    <showing-date-menu-item
      v-if="lastWeekMessageId"
      :message-id="lastWeekMessageId"
      @click="emit('click')"
    >
      先週へ
    </showing-date-menu-item>
    <showing-date-menu-item
      v-if="lastMonthMessageId"
      :message-id="lastMonthMessageId"
      @click="emit('click')"
    >
      先月へ
    </showing-date-menu-item>
    <showing-date-menu-item
      v-if="firstMessageId"
      :message-id="firstMessageId"
      @click="emit('click')"
    >
      最初へ
    </showing-date-menu-item>
  </div>
</template>

<script lang="ts" setup>
import ShowingDateMenuItem from './ShowingDateMenuItem.vue'

defineProps<{
  lastWeekMessageId: string | null
  lastMonthMessageId: string | null
  firstMessageId: string | null
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<style lang="scss" module>
.container {
  @include background-primary;
  @include drop-shadow-default;
  display: grid;
  width: max-content;
  border-radius: 4px;
}
</style>
