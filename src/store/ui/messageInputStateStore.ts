import { defineStore, acceptHMRUpdate } from 'pinia'
import type { Ref } from 'vue'
import { computed, unref, toRef, ref } from 'vue'
import type { AttachmentType } from '/@/lib/basic/file'
import { convertToRefsStore } from '/@/store/utils/convertToRefsStore'
import type { ChannelId } from '/@/types/entity-ids'
import useIndexedDbValue, { key } from '/@/composables/utils/useIndexedDbValue'
import { promisifyRequest } from 'idb-keyval'

/**
 * 基本的に直接利用しないで`/@/composables/messageInputState`を利用する
 */

/**
 * ChannelIdの代わりに一意となるもの
 *
 * share-target: Web Share Target APIで使う画面で利用
 */
const VIRTUAL_IDS = ['share-target'] as const
export type VirtualChannelId = (typeof VIRTUAL_IDS)[number]
const virtualIds: ReadonlySet<string> = new Set(VIRTUAL_IDS)

export interface MessageInputState {
  text: string
  attachments: Attachment[]
}

export type Attachment = {
  file: File
  type: AttachmentType
  thumbnailDataUrl?: string
}

export type MessageInputStateKey = Ref<ChannelId> | ChannelId | VirtualChannelId

export const createDefaultValue = () => ({ text: '', attachments: [] })

const useMessageInputStateStorePinia = defineStore(
  'ui/messageInputStateStore',
  () => {
    const initialValue = {
      messageInputState: new Map<
        ChannelId,
        MessageInputState
      >()
    }

    const [state, restoring, restoringPromise] = useIndexedDbValue(
      'store/ui/messageInputStateStore',
      1,
      {
        1: async getStore => {
          const store = getStore()
          const setReq = store.put(initialValue, key)
          await promisifyRequest(setReq)
        }
      },
      initialValue
    )

    const states = toRef(() => state.messageInputState)
    const inputChannels = computed(() => [...states.value])
    const hasInputChannel = computed(() => inputChannels.value.length > 0)
    const virtualChannelStates = ref(
      new Map<VirtualChannelId, MessageInputState>()
    )

    const getStore = (cId: MessageInputStateKey) => {
      const cId_ = unref(cId)
      const st =  (virtualIds.has(cId_) ? virtualChannelStates : states)
      return st.value.get(cId_)
    }
    const setStore = (cId: MessageInputStateKey, v: MessageInputState) => {
      const cId_ = unref(cId)
      const st =  (virtualIds.has(cId_) ? virtualChannelStates : states)
      // 空のときは削除、空でないときはセット
      if (v && (v.text !== '' || v.attachments.length > 0)) {
        // コピーしないと参照が変わらないから上書きされる
        // toRawしちゃうとreactiveで包めなくなるので、そうはしない
        st.value.set(cId_, { ...v })
      } else {
        st.value.delete(cId_)
      }
    }

    return { inputChannels, hasInputChannel, getStore, setStore }
  }
)

export const useMessageInputStateStore = convertToRefsStore(
  useMessageInputStateStorePinia
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useMessageInputStateStorePinia, import.meta.hot)
  )
}
