import { Ref, ref, computed } from '@vue/composition-api'
import usePictureInPicture from './usePictureInPicture'

const useAudio = (audioRef: Ref<HTMLAudioElement | null>) => {
  const isPlay = ref(false)
  const currentTime = ref(0)
  const displayCurrentTime = computed(() => setDisplayTime(currentTime))
  const duration = ref(0)
  const displayDuration = computed(() => setDisplayTime(duration))
  const timeWidth = ref(0)
  let isAddedEvent = false
  const volume = ref(1.0)

  const togglePlay = () => {
    // 更新処理を追加してないなら追加(refはreactiveでないため)
    if (!isAddedEvent && audioRef.value) {
      audioRef.value?.addEventListener('timeupdate', e => {
        currentTime.value = Math.floor(audioRef.value?.currentTime ?? 0)
        if (duration.value === 0) {
          duration.value = Math.round(audioRef.value?.duration ?? 0)
          measureTimeWidth()
        }
      })
      isAddedEvent = true
    }
    if (isPlay.value) {
      stop()
    } else {
      start()
    }
  }
  const start = () => {
    audioRef.value?.play()
    isPlay.value = true
  }
  const stop = () => {
    audioRef.value?.pause()
    isPlay.value = false
  }
  const changeVolume = (vol: number) => {
    if (audioRef.value) {
      audioRef.value.volume = vol / 100
      volume.value = vol / 100
    }
  }
  const changeTime = (time: number) => {
    if (audioRef.value && duration.value) {
      if (duration.value < time) return
      audioRef.value.currentTime = time
    }
  }
  const measureTimeWidth = () => {
    const maxWidthEle = document.createElement('span')
    const d = displayDuration.value
    maxWidthEle.appendChild(document.createTextNode(d.replace(/[0-9]/g, '0')))
    maxWidthEle.style.fontSize = '0.8rem'
    document.body.append(maxWidthEle)
    timeWidth.value = maxWidthEle.getClientRects()[0].width ?? 0
    maxWidthEle.remove()
  }
  const setDisplayTime = (time: Ref<number>) => {
    if (isNaN(time.value)) {
      return '0:00'
    }
    return `${Math.floor(time.value / 60)}:${(
      '0' + Math.floor(time.value % 60)
    ).slice(-2)}`
  }
  const startPinP = async (iconId: string) => {
    const { showPictureInPictureWindow } = usePictureInPicture()
    showPictureInPictureWindow(audioRef, iconId, duration, ct => {
      changeTime(Math.floor(ct))
      currentTime.value = Math.floor(ct)
    })
  }
  return {
    isPlay,
    currentTime,
    displayCurrentTime,
    duration,
    displayDuration,
    timeWidth,
    volume,
    changeVolume,
    changeTime,
    togglePlay,
    startPinP
  }
}

export default useAudio
