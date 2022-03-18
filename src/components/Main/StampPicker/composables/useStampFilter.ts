import { reactive, computed, ref } from 'vue'
import { Stamp } from '@traptitech/traq'
import { compareStringInsensitive } from '/@/lib/basic/string'
import { getMatchedWithPriority } from '/@/lib/basic/array'
import { useStampsStore } from '/@/store/entities/stamps'

const emojiAltnameTable = import('/@/assets/emoji_altname_table.json')

declare const altNameSymbol: unique symbol
type AltName = string & { nominalTyping: typeof altNameSymbol }

const useStampFilter = () => {
  const { stampsMap } = useStampsStore()

  const stamps = computed(() => [...stampsMap.value.values()])
  const stampNames = computed(() => stamps.value.map(stamp => stamp.name))
  const stampsTable = computed(() =>
    Object.fromEntries(stamps.value.map(stamp => [stamp.name, stamp]))
  )

  const altNameTable = ref<Record<AltName, string>>({})
  const altNames = ref<AltName[]>([])
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const altNameToName = (altName: AltName) => altNameTable.value[altName]!
  emojiAltnameTable.then(({ default: tables }) => {
    const {
      altNameTable: strictAltNameTable,
      unicodeTable: strictUnicodeTable
    } = tables
    altNameTable.value = {
      ...strictAltNameTable,
      ...strictUnicodeTable
    }
    altNames.value = [...(Object.keys(altNameTable.value) as AltName[])]
  })

  const oneLetterNames = computed(() =>
    stampNames.value.filter(name => name.length === 1)
  )
  const oneLetterAltNames = altNames.value.filter(name => name.length === 1)

  const getStamps = (stampNames: Iterable<string>) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [...new Set(stampNames)].map(name => stampsTable.value[name]!)
  }

  const state = reactive({
    query: '',
    filteredItems: computed((): readonly Stamp[] => {
      if (state.query.length === 0) {
        return stamps.value
      }

      const query = state.query.toLowerCase()
      if (state.query.length === 1) {
        const altNameMatched = oneLetterAltNames
          .filter(altName => altName.toLowerCase() === query)
          .map(altNameToName)
        const matched = oneLetterNames.value.filter(
          name => name.toLowerCase() === query
        )
        const res = [...altNameMatched, ...matched].sort(
          compareStringInsensitive
        )
        return getStamps(res)
      }

      const altNameRes = getMatchedWithPriority(altNames.value, query)
      const res = getMatchedWithPriority(stampNames.value, query)

      const result = [
        ...altNameRes.map(r => ({
          value: altNameToName(r.value),
          priority: r.priority
        })),
        ...res
      ]
        .map(r => ({ value: r.value, sortKey: `${r.priority}${r.value}` }))
        .sort((a, b) => compareStringInsensitive(a.sortKey, b.sortKey))
        .map(r => r.value)

      return getStamps(result)
    })
  })
  return {
    filterState: state
  }
}

export default useStampFilter