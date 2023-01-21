<template>
  <div :class="$style.container">
    <div :class="$style.innerContainer">
      <button :class="$style.button" @click="togglePopupMenu">
        {{ showingDate }}
        <a-icon name="chevron-down" mdi />
      </button>
      <click-outside v-if="isPopupMenuShown" @click-outside="closePopupMenu">
        <channel-view-content-showing-date-menu
          :class="$style.toolsMenu"
          :channel-id="channelId"
        />
      </click-outside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AIcon from '/@/components/UI/AIcon.vue'
import type { ChannelId } from '/@/types/entity-ids'
import ClickOutside from '/@/components/UI/ClickOutside'
import useToggle from '/@/composables/utils/useToggle'
import ChannelViewContentShowingDateMenu from './ChannelViewContentShowingDateMenu.vue'

defineProps<{
  channelId: ChannelId
  showingDate: string
}>()

const {
  value: isPopupMenuShown,
  toggle: togglePopupMenu,
  close: closePopupMenu
} = useToggle(false)
</script>

<style lang="scss" module>
.container {
  position: absolute;
  inset: 12px 0 auto;
  margin: 0 auto;
  width: 140px;
  z-index: $z-index-showing-message-date;
}
.innerContainer {
  position: relative;
}
.button {
  background-color: white;
  border-radius: 24px;
  padding: 4px 8px;
  text-align: center;
  font-weight: bold;
  border: 1px solid $theme-ui-tertiary-default;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  &:hover {
    background-color: $theme-background-secondary-default;
  }
}
.toolsMenu {
  position: absolute;
  right: 0;
  top: 36px;
  z-index: $z-index-showing-message-date-menu;
}
</style>
