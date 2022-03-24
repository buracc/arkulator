<template>
  <v-card>
    <v-card-title> Una's dailies</v-card-title>

    <v-card-text>
      <UnasRestBonusBar :char-name="charName" :completions="this.getQuestsCompletedToday()" />
      <v-row>
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span v-if="Object.entries(char.dailies.unas.reputations).length === 0">
            No dailies added, add a daily to start tracking.
          </span>
          <v-list v-else flat>
            <v-list-item v-for="(daily, reputationName) of char.dailies.unas.reputations" :key="reputationName">
              <v-list-item-content>
                <v-list-item-title>
                  <b>Reputation:</b> {{ reputationName }} - Lvl: {{ daily.rep_level }} ({{
                    getDisplayedXp(reputationName, daily.rep_level, daily.rep_xp)
                  }})
                </v-list-item-title>
                <v-list-item-content>
                  <v-row v-for="(quest, i) of daily.quests" :key="i">
                    <v-col>
                      {{ quest.name }}
                      <v-list-item-subtitle>
                        {{ quests[quest.name].location['continent'] }}:
                        {{ quests[quest.name].location['area'] }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle color="red" v-if="!isIlvlMetForQuest(charName, quest)">
                        Required Item Level: {{ quests[quest.name].ilvl }}
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col>
                      Completed: {{ quest.progress }} {{ quest.max_progress ? '/ ' + quest.max_progress : '' }}
                      <v-list-item-subtitle>
                        Today:
                        <v-icon x-small @click="setQuestCompletedToday(charName, quest)">
                          {{ isQuestMaxed(quest) || !canDoQuestToday(quest) ? '✅' : '❌' }}
                        </v-icon>
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col>
                      <v-btn text small outlined @click="uncompleteQuest(charName, reputationName, quest.name)">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      <v-btn text small outlined @click="completeQuest(charName, reputationName, quest.name)">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn text outlined @click="deleteDaily(charName, reputationName)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-card-subtitle v-if="Object.entries(char.dailies.unas.reputations).length > 0">
            Quests completed today: {{ getQuestsCompletedToday() }}/3
          </v-card-subtitle>
        </v-col>
      </v-row>

      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
import UnasRestBonusBar from '@/components/progress/UnasRestBonusBar'

export default {
  components: { UnasRestBonusBar },
  inject: ['unas'],
  props: ['charName'],
  computed: {
    resetDate: {
      get() {
        const now = new Date()
        return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 10))
      },
    },
    char: {
      get() {
        return this.characters[this.charName]
      },
    },
    unasRestBonus: {
      get() {
        return this.char.dailies.unas.rest_bonus.value
      },
      set(value) {
        this.char.dailies.unas.rest_bonus.value = value
      },
    },
    quests: {
      get() {
        return this.unas.getQuests()
      },
    },
    reputations: {
      get() {
        return this.unas.getReputations()
      },
    },
    characters: {
      get() {
        return this.$store.state.characters
      },
      set(value) {
        this.$store.commit('setCharacters', value)
      },
    },
    now: {
      get() {
        return new Date().getTime()
      },
    },
  },
  methods: {
    deleteDaily(charName, repName) {
      const chars = this.characters
      delete chars[charName].dailies.unas.reputations[repName]

      this.updateAndRefresh(chars)
    },
    getDisplayedXp(repName, lvl, xp) {
      const maxXp = this.getMaxXp(repName, lvl)
      return (xp <= maxXp ? xp : maxXp) + '/' + maxXp + ' XP'
    },
    getMaxXp(repName, lvl) {
      const rep = this.reputations[repName]
      const levels = rep.levels
      return levels[lvl].xp
    },
    getMaxRepLvl(repName) {
      const rep = this.reputations[repName]
      return Math.max(...Object.keys(rep.levels))
    },
    completeQuest(charName, dailyName, questName) {
      const reps = this.char.dailies.unas.reputations
      const reputation = reps[dailyName]
      const quest = reputation.quests.filter((q) => q.name === questName)[0]
      const questData = this.quests[questName]
      const prereqs = questData['req_quests']

      if (prereqs !== undefined) {
        for (let questName of prereqs) {
          const quest = reputation.quests.filter((q) => q.name === questName)[0]
          if (quest !== null && quest.progress !== quest.max_progress) {
            return
          }
        }
      }

      if (quest.progress === quest.max_progress) {
        return
      }

      quest.progress++
      quest.last_completed = this.now

      if (this.unasRestBonus - 20 >= 0) {
        this.unasRestBonus -= 20
      }

      const maxXp = this.getMaxXp(dailyName, reputation.rep_level)
      reputation.rep_xp += Number.parseInt(this.quests[questName].rewards['Reputation'])

      if (reputation.rep_xp >= maxXp && reputation.rep_level < this.getMaxRepLvl(dailyName)) {
        reputation.rep_xp = 0
        reputation.rep_level++
      }

      this.updateAndRefresh(this.characters)
    },
    uncompleteQuest(charName, dailyName, questName) {
      const reps = this.char.dailies.unas.reputations
      const reputation = reps[dailyName]
      const quest = reputation.quests.filter((q) => q.name === questName)[0]
      if (quest.progress === 0) {
        return
      }

      quest.progress--
      quest.last_completed = null
      reputation.rep_xp -= Number.parseInt(this.quests[questName].rewards['Reputation'])
      if (reputation.rep_xp < 0) {
        reputation.rep_level--
        reputation.rep_xp = this.getMaxXp(dailyName, reputation.rep_level) - 10
      }

      this.updateAndRefresh(this.characters)
    },
    isQuestMaxed(quest) {
      return quest.max_progress !== undefined && quest.progress === quest.max_progress
    },
    canDoQuestToday(quest) {
      if (quest.last_completed === null) {
        return true
      }

      const completionTime = quest.last_completed
      const resetTime = this.resetDate
      return completionTime < resetTime && this.now > resetTime
    },
    setQuestCompletedToday(charName, quest) {
      if (quest.last_completed === null) {
        if (quest.progress === 0) {
          return
        }

        quest.last_completed = this.now
      } else {
        quest.last_completed = null
      }

      this.updateAndRefresh(this.characters)
    },
    isIlvlMetForQuest(charName, quest) {
      return this.char.ilvl >= this.quests[quest.name].ilvl
    },
    getQuestsCompletedToday() {
      let total = 0
      const reputations = this.char.dailies.unas.reputations
      for (let repName in reputations) {
        const quests = reputations[repName].quests
        for (let quest of quests) {
          if (!this.canDoQuestToday(quest)) {
            total++
          }
        }
      }

      return total
    },
    updateAndRefresh(characters) {
      this.characters = characters // updates the store
      this.$forceUpdate()
    },
  },
}
</script>
