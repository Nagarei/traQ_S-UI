import store from '@/store'
import createTree from '@/lib/trieTree'
import { animeEffectSet, sizeEffectSet } from '@traptitech/traq-markdown-it'
import { ComputedRef, onBeforeMount, WritableComputedRef, ref } from 'vue'
import getCaretPosition from '@/lib/caretPosition'
import { EntityEventMap, entityMitt } from '@/store/entities/mitt'

export type Target = {
  word: string
  begin: number
  end: number
  divided: boolean
}

const getCurrentWord = (elm: HTMLTextAreaElement, text: string): Target => {
  text = text.replaceAll('　', ' ')
  const startIndex = elm.selectionStart
  const prevAtMarkIndex = text.lastIndexOf('@', startIndex - 1)
  const prevColonIndex = text.lastIndexOf(':', startIndex - 1)
  const prevPeriodIndex = text.lastIndexOf('.', startIndex - 1)
  const nearest = Math.max(prevAtMarkIndex, prevColonIndex, prevPeriodIndex)
  const begin = nearest < 0 ? 0 : nearest
  const end = elm.selectionEnd
  const word = text.substring(begin, end)
  const prevSpaceIndex = text.lastIndexOf(' ', startIndex - 1)
  const divided = prevSpaceIndex > nearest
  return { word, begin, end, divided }
}

const useWordSuggester = (
  textareaRef: ComputedRef<HTMLTextAreaElement | undefined>,
  value: WritableComputedRef<string>
) => {
  const showSuggester = ref(false)
  const interactingWithList = ref(false)
  const position = ref({ top: 0, left: 0 })
  const target = ref<Target>({
    word: '',
    begin: 0,
    end: 0,
    divided: false
  })
  const suggestedCandidates = ref<string[]>([])

  let tree: ReturnType<typeof createTree>
  const updateTree = () => {
    tree = createTree(
      // ユーザー名とグループ名に重複あり
      // メンションはcase insensitiveでユーザー名を優先
      // 重複を許す場合、優先するものから入れる
      store.getters.entities.allUserNames.map(userName => '@' + userName),
      store.getters.entities.allUserGroupNames.map(
        userGroupName => '@' + userGroupName
      ),
      store.getters.entities.allStampNames.map(
        stampName => ':' + stampName + ':'
      ),
      [...animeEffectSet].map(effectName => '.' + effectName),
      [...sizeEffectSet].map(effectName => '.' + effectName)
    )
  }

  updateTree()

  const events: (keyof EntityEventMap)[] = [
    'setUser',
    'setUsers',
    'deleteUser',
    'setUserGroup',
    'setUserGroups',
    'deleteUserGroup',
    'setStamp',
    'setStamps',
    'deleteStamp'
  ]
  events.forEach(event => {
    entityMitt.on(event, () => {
      updateTree()
    })
  })
  onBeforeMount(() => {
    events.forEach(event => {
      entityMitt.off(event, () => {
        updateTree()
      })
    })
  })

  const onKeyUp = async (e: KeyboardEvent) => {
    if (!textareaRef.value) return
    target.value = getCurrentWord(textareaRef.value, value.value)
    if (target.value.divided || target.value.word.length < 3) {
      showSuggester.value = false
      return
    }
    suggestedCandidates.value = tree.search(
      target.value.word.replaceAll('＠', '@')
    )
    if (suggestedCandidates.value.length === 0) {
      showSuggester.value = false
      return
    }
    position.value = getCaretPosition(textareaRef.value, target.value.begin)
    showSuggester.value = true
  }
  const onBlur = async () => {
    if (interactingWithList.value) {
      interactingWithList.value = false
      return
    }
    showSuggester.value = false
  }
  const onMousedown = async () => {
    interactingWithList.value = true
  }
  return {
    onKeyUp,
    onBlur,
    onMousedown,
    showSuggester,
    position,
    target,
    suggestedCandidates
  }
}

export default useWordSuggester
