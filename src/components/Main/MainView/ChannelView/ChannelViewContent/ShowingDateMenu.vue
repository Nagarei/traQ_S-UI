<template>
  <div :class="$style.container">
    <showing-date-menu-item
      v-if="messageIds.lastWeek"
      :message-id="messageIds.lastWeek"
      @click="emit('click')"
    >
      先週へ
    </showing-date-menu-item>
    <showing-date-menu-item
      v-if="messageIds.lastMonth"
      :message-id="messageIds.lastMonth"
      @click="emit('click')"
    >
      先月へ
    </showing-date-menu-item>
    <showing-date-menu-item
      v-if="messageIds.first"
      :message-id="messageIds.first"
      @click="emit('click')"
    >
      最初へ
    </showing-date-menu-item>
  </div>
</template>

<script lang="ts" setup>
import ShowingDateMenuItem from './ShowingDateMenuItem.vue'
import type { messageIdWithSpecifiedDate } from '/@/store/domain/messagesView'

defineProps<{
  messageIds: messageIdWithSpecifiedDate
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
