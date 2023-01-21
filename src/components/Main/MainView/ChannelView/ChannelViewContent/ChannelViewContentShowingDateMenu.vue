<template>
  <div :class="$style.container">
    <ChannelViewContentShowingDateMenuItem>
      先週へ
    </ChannelViewContentShowingDateMenuItem>
    <ChannelViewContentShowingDateMenuItem>
      先月へ
    </ChannelViewContentShowingDateMenuItem>
    <ChannelViewContentShowingDateMenuItem>
      最初へ
    </ChannelViewContentShowingDateMenuItem>
  </div>
</template>

<script lang="ts" setup>
import type { ChannelId } from '/@/types/entity-ids'
import ChannelViewContentShowingDateMenuItem from './ChannelViewContentShowingDateMenuItem.vue'

const props = defineProps<{
  channelId: ChannelId
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
