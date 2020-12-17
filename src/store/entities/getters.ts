import { defineGetters } from 'direct-vuex'
import { S } from './state'
import { entities } from './index'
import { moduleGetterContext } from '@/store'
import { User, UserGroup } from '@traptitech/traq'
import { ActiveUser, isActive } from '@/lib/user'
import { DMChannelId, UserId } from '@/types/entity-ids'

const entitiesGetterContext = (args: [unknown, unknown, unknown, unknown]) =>
  moduleGetterContext(args, entities)

export const getters = defineGetters<S>()({
  userByName(state): (name: string) => User | undefined {
    return name => {
      const loweredName = name.toLowerCase()
      return [...state.usersMap.values()].find(
        user => user?.name.toLowerCase() === loweredName
      )
    }
  },
  activeUsersMap(state): Map<string, ActiveUser> {
    return new Map(
      [...state.usersMap.entries()].filter((entry): entry is [
        UserId,
        ActiveUser
      ] => isActive(entry[1]))
    )
  },

  gradeTypeUserGroups(state) {
    return [...state.userGroupsMap.values()].filter(
      group => group.type === 'grade'
    )
  },
  gradeGroupByUserId(...args): (userId: UserId) => UserGroup | undefined {
    const { getters } = entitiesGetterContext(args)
    return userId =>
      getters.gradeTypeUserGroups.find((userGroup: UserGroup) =>
        userGroup.members.some(member => member.id === userId)
      )
  },
  userGroupByName(state): (name: string) => UserGroup | undefined {
    return name => {
      const loweredName = name.toLowerCase()
      return [...state.userGroupsMap.values()].find(
        userGroup => userGroup?.name.toLowerCase() === loweredName
      )
    }
  },

  userNameByDMChannelId(state): (id: DMChannelId) => string | undefined {
    return id => {
      const userId = state.dmChannelsMap.get(id)?.userId
      return userId ? state.usersMap.get(userId)?.name : undefined
    }
  },
  DMChannelUserIdMap(state) {
    return new Map([...state.dmChannelsMap.values()].map(c => [c.userId, c.id]))
  },
  DMChannelIdByUserId(...args): (id: UserId) => DMChannelId | undefined {
    const { getters } = entitiesGetterContext(args)
    return id => getters.DMChannelUserIdMap.get(id)
  }
})
