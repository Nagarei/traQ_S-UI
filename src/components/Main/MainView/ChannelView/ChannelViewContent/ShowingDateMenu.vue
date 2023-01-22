<template>
  <div :class="$style.container">
    <showing-date-menu-item :date="lastWeekDate" :channel-id="channelId">
      先週へ
    </showing-date-menu-item>
    <showing-date-menu-item :date="lastMonthDate" :channel-id="channelId">
      先月へ
    </showing-date-menu-item>
    <showing-date-menu-item :date="firstDate" :channel-id="channelId">
      最初へ
    </showing-date-menu-item>
  </div>
</template>

<script lang="ts" setup>
import type { ChannelId } from '/@/types/entity-ids'
import ShowingDateMenuItem from './ShowingDateMenuItem.vue'
import { computed } from 'vue'

defineProps<{
  channelId: ChannelId
}>()

const lastWeekDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date
})
const lastMonthDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  return date
})
const firstDate = undefined
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
