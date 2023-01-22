<template>
  <div :class="$style.container">
    <div :class="$style.innerContainer">
      <button :class="$style.button" @click="handleTogglePopupMenu">
        {{ showingDate }}
        <a-icon name="chevron-down" mdi />
      </button>
      <click-outside
        v-if="isPopupMenuShown"
        stop
        @click-outside="closePopupMenu"
      >
        <showing-date-menu
          :class="$style.toolsMenu"
          :last-week-message-id="lastWeekMessageId"
          :last-month-message-id="lastMonthMessageId"
          :first-message-id="firstMessageId"
          @click="closePopupMenu"
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
import ShowingDateMenu from './ShowingDateMenu.vue'
import apis from '/@/lib/apis'
import { ref } from 'vue'
import { useMessagesView } from '/@/store/domain/messagesView'

const props = defineProps<{
  channelId: ChannelId
  showingDate: string
}>()

const { messageIdsWithSpecifiedDateMap } = useMessagesView()

const fetchMessageByDate = async (date: Date | null) => {
  const messages = (
    await apis.getMessages(
      props.channelId,
      1,
      undefined,
      date?.toISOString() ?? undefined,
      undefined,
      true,
      'asc'
    )
  ).data
  if (messages[0] === undefined) {
    return null
  }
  const messageId = messages[0].id
  return messageId
}

const lastWeekMessageId = ref<string | null>(null)
const lastMonthMessageId = ref<string | null>(null)
const firstMessageId = ref<string | null>(null)

const handleTogglePopupMenu = async () => {
  const messagesWithSpecifiedDate = messageIdsWithSpecifiedDateMap.value.get(
    props.channelId
  )
  if (messagesWithSpecifiedDate !== undefined) {
    lastWeekMessageId.value = messagesWithSpecifiedDate.lastWeekMessageId
    lastMonthMessageId.value = messagesWithSpecifiedDate.lastMonthMessageId
    firstMessageId.value = messagesWithSpecifiedDate.firstMessageId
  } else {
    const date = new Date()
    const lastWeekDate = new Date()
    lastWeekDate.setDate(date.getDate() - 7)
    const lastMonthDate = new Date()
    lastMonthDate.setMonth(date.getMonth() - 1)

    lastWeekMessageId.value = await fetchMessageByDate(lastWeekDate)
    lastMonthMessageId.value = await fetchMessageByDate(lastMonthDate)
    firstMessageId.value = await fetchMessageByDate(null)

    messageIdsWithSpecifiedDateMap.value.set(props.channelId, {
      lastWeekMessageId: lastWeekMessageId.value,
      lastMonthMessageId: lastMonthMessageId.value,
      firstMessageId: firstMessageId.value
    })
  }
  openPopupMenu()
}

const {
  value: isPopupMenuShown,
  open: openPopupMenu,
  close: closePopupMenu
} = useToggle(false)
</script>

<style lang="scss" module>
.container {
  position: absolute;
  inset: 12px 0 auto;
  margin: 0 auto;
  width: 152px;
  z-index: $z-index-showing-message-date;
}
.innerContainer {
  position: relative;
}
.button {
  background-color: white;
  border-radius: 24px;
  padding: 4px 16px;
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
