import { ref } from 'vue'
import { useLiveKitSDK } from '/@/composables/qall/useLiveKitSDK'
import { useMeStore } from '/@/store/domain/me'
import { useToastStore } from '/@/store/ui/toast'
import type { LocalAudioTrack, LocalVideoTrack } from 'livekit-client'
import AutoReconnectWebSocket from '/@/lib/websocket/AutoReconnectWebSocket'
import type { Channel, User } from '@traptitech/traq'
import { useChannelsStore } from '/@/store/entities/channels'
import { useUsersStore } from '/@/store/entities/users'
import { messageMitt } from '/@/store/entities/messages'
import { useTts } from '/@/store/app/tts'
import { useRtcSettings } from '/@/store/app/rtcSettings'

type RoomsWithParticipants =
  | {
      roomId: string
      participants: { identity: string; joinedAt: string }[] | null
    }[]
  | null

type Participant = { user: User; joinedAt: string }
type Room = {
  channel: Channel
  participants: Participant[]
}
type Rooms = Room[]

const rooms = ref<Rooms>([])
const callingChannel = ref('')

const {
  joinRoom,
  leaveRoom,
  addScreenShareTrack,
  removeVideoTrack,
  addCameraTrack,
  setLocalTrackMute,
  publishData,
  tracksMap,
  screenShareTrackSidMap,
  qallMitt
} = useLiveKitSDK()
const { myId } = useMeStore()
const { addErrorToast } = useToastStore()
const { channelsMap } = useChannelsStore()
const { findUserByName, usersMap } = useUsersStore()
const { addQueue } = useTts()

const meStore = useMeStore()
const rtcSettings = useRtcSettings()

const purifyRoomData = (data: RoomsWithParticipants): Rooms => {
  if (!data) return []
  return data
    .filter(room => room.participants)
    .map(room => {
      return {
        channel: channelsMap.value.get(room.roomId),
        participants:
          room.participants
            ?.map(p => ({
              joinedAt: p.joinedAt,
              user: findUserByName(p.identity.slice(0, -37))
            }))
            .filter((p): p is Participant => !!p.user) ?? []
      }
    })
    .filter((room): room is Room => {
      if (!room.channel) return false
      return !room.channel.archived
    })
}
const ws = new AutoReconnectWebSocket(
  'wss://qall-microservice-for-livekit.trap.show/api/ws',
  undefined,
  {
    maxReconnectionDelay: 3000,
    minReconnectionDelay: 1000
  }
)
ws.connect()
ws.addEventListener('message', event => {
  try {
    const data: RoomsWithParticipants = JSON.parse(event.detail as string)
    rooms.value = purifyRoomData(data)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[WebSocket] Failed to parse: ', e)
  }
})

fetch('https://qall-microservice-for-livekit.trap.show/api/rooms').then(res => {
  res
    .json()
    .then(data => {
      if (!data) return
      rooms.value = purifyRoomData(data)
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse: ', e)
    })
})

const setSpeakerMute = (track: LocalAudioTrack, muted: boolean) => {
  setLocalTrackMute(track, muted)
}

const setVideoMute = (track: LocalVideoTrack, muted: boolean) => {
  setLocalTrackMute(track, muted)
}

messageMitt.on('addMessage', ({ message }) => {
  if (!rtcSettings.isTtsEnabled.value) return
  if (callingChannel.value !== message.channelId) return
  if (meStore.myId.value === message.userId) return

  const userDisplayName =
    usersMap.value.get(message.userId)?.displayName ?? 'はてな'
  addQueue({
    channelId: message.channelId,
    userDisplayName,
    text: message.content
  })
})

export const useQall = () => {
  const joinQall = (channelName: string) => {
    if (callingChannel.value) {
      leaveRoom()
    }
    if (!myId.value) {
      addErrorToast('接続に失敗しました')
      return
    }
    joinRoom(channelName, myId.value)

    callingChannel.value = channelName
  }
  const leaveQall = () => {
    leaveRoom()
    callingChannel.value = ''
  }
  return {
    callingChannel,
    rooms,
    joinQall,
    leaveQall,
    addScreenShareTrack,
    addCameraTrack,
    removeVideoTrack,
    publishData,
    setSpeakerMute,
    tracksMap,
    screenShareTrackSidMap,
    qallMitt
  }
}
