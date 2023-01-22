<template>
  <button :class="$style.container" @click="toMessage"><slot /></button>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import useChannelMessageFetcher from '/@/components/Main/MainView/ChannelView/ChannelViewContent/composables/useChannelMessageFetcher'

import type { ChannelId } from '/@/types/entity-ids'

const props = defineProps<{
  channelId: ChannelId
  date: Date | undefined
}>()

const router = useRouter()
const { fetchMessagesByChannelId } = useChannelMessageFetcher(undefined, {
  channelId: props.channelId
})

const toMessage = async () => {
  const { messages } = await fetchMessagesByChannelId({
    channelId: props.channelId,
    limit: 1,
    order: 'desc',
    since: props.date
  })
  if (messages[0] === undefined) return
  const messageId = messages[0].id

  router.push({
    name: 'channel',
    params: {
      channelId: props.channelId
    },
    query: {
      messageId
    }
  })
}
</script>

<style lang="scss" module>
.container {
  @include color-ui-primary;
  display: flex;
  cursor: pointer;
  padding: 12px 20px;
  &:hover {
    @include background-secondary;
  }
}
.label {
  font: {
    size: 1rem;
  }
}
</style>
