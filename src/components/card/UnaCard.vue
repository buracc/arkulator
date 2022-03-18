<template>
  <v-card>
    <v-card-title> {{ charName }} ({{ char.ilvl }})</v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col md="1">
          <v-btn text @click="restBonus -= 10">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-col>
        <v-col md="10">
          <v-progress-linear :value="restBonus" height="25" color="green">
            <strong>Rest bonus: {{ restBonus }}/100 </strong>
          </v-progress-linear>
        </v-col>

        <v-col md="1" @click="restBonus += 10">
          <v-btn text>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <span v-if="char.dailies === undefined || Object.entries(char.dailies).length === 0">
        No dailies added, add a daily to start tracking.
      </span>
      <v-list v-else flat>
        <v-list-item v-for="(daily, reputationName) of char.dailies" :key="reputationName">
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
                  Completed: {{ quest.progress }} {{ quest.maxProgress ? '/ ' + quest.maxProgress : '' }}
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

      <v-card-subtitle>Quests completed today: {{ getQuestsCompletedToday() }}/3</v-card-subtitle>

      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  inject: ['unas'],
  props: ['charName'],
  mounted() {
    if (this.restBonus === undefined) {
      this.restBonus = 0
    }

    const char = this.characters[this.charName]
    const restBonusSetDate = char.rest_bonus_set_date
    const resetDate = this.resetDate
    const now = new Date()
    if (restBonusSetDate === undefined) {
      char.rest_bonus_set_date = now
      this.updateAndRefresh(this.charName, this.characters)
    } else {
      const lastRestBonusCalculation = new Date(restBonusSetDate)
      if (now >= resetDate && lastRestBonusCalculation < resetDate) {
        this.restBonus += (3 - this.getQuestsCompletedToday()) * 10
        const idleDays = Math.floor((now - lastRestBonusCalculation) / (1000 * 60 * 60 * 24)) - 1
        this.restBonus += idleDays * 30
        char.rest_bonus_set_date = now
        this.updateAndRefresh(this.charName, this.characters)
      }
    }
  },
  computed: {
    resetDate: {
      get() {
        const resetDate = new Date()
        resetDate.setHours(10, 0, 0, 0)
        return resetDate
      },
    },
    char: {
      get() {
        return this.characters[this.charName]
      },
    },
    restBonus: {
      get() {
        return this.char.rest_bonus
      },
      set(value) {
        if (value < 0) {
          value = 0
        } else if (value > 100) {
          value = 100
        }

        this.characters[this.charName].rest_bonus = value
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
  },
  methods: {
    deleteDaily(charName, repName) {
      const chars = this.characters
      delete chars[charName].dailies[repName]

      this.updateAndRefresh(charName, chars)
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
      const dailies = this.char.dailies
      const daily = dailies[dailyName]
      const quest = daily.quests.filter((q) => q.name === questName)[0]
      const questData = this.quests[questName]
      const prereqs = questData['req_quests']

      if (prereqs !== undefined) {
        for (let questName of prereqs) {
          const quest = daily.quests.filter((q) => q.name === questName)[0]
          if (quest !== null && quest.progress !== quest.maxProgress) {
            return
          }
        }
      }

      if (quest.progress === quest.maxProgress) {
        return
      }

      quest.progress++
      quest.lastCompleted = new Date()

      if (this.restBonus - 20 >= 0) {
        this.restBonus -= 20
      }

      const maxXp = this.getMaxXp(dailyName, daily.rep_level)
      daily.rep_xp += Number.parseInt(this.quests[questName].rewards['Reputation'])

      if (daily.rep_xp >= maxXp && daily.rep_level < this.getMaxRepLvl(dailyName)) {
        daily.rep_xp = 0
        daily.rep_level++
      }

      this.updateAndRefresh(charName, this.characters)
    },
    uncompleteQuest(charName, dailyName, questName) {
      const dailies = this.char.dailies
      const daily = dailies[dailyName]
      const quest = daily.quests.filter((q) => q.name === questName)[0]
      if (quest.progress === 0) {
        return
      }

      quest.progress--
      quest.lastCompleted = null
      daily.rep_xp -= Number.parseInt(this.quests[questName].rewards['Reputation'])
      if (daily.rep_xp < 0) {
        daily.rep_level--
        daily.rep_xp = this.getMaxXp(dailyName, daily.rep_level) - 10
      }

      this.updateAndRefresh(charName, this.characters)
    },
    isQuestMaxed(quest) {
      return quest.maxProgress !== undefined && quest.progress === quest.maxProgress
    },
    canDoQuestToday(quest) {
      if (quest.lastCompleted === null) {
        return true
      }

      const completionTime = new Date(quest.lastCompleted)
      const resetTime = this.resetDate
      return completionTime < resetTime && new Date() > resetTime
    },
    setQuestCompletedToday(charName, quest) {
      if (quest.lastCompleted === null) {
        if (quest.progress === 0) {
          return
        }

        quest.lastCompleted = new Date()
      } else {
        quest.lastCompleted = null
      }

      this.updateAndRefresh(charName, this.characters)
    },
    isIlvlMetForQuest(charName, quest) {
      return this.char.ilvl >= this.quests[quest.name].ilvl
    },
    getQuestsCompletedToday() {
      let total = 0
      const dailies = this.char.dailies
      for (let repName in dailies) {
        const quests = dailies[repName].quests
        for (let quest of quests) {
          if (!this.canDoQuestToday(quest)) {
            total++
          }
        }
      }

      return total
    },
    updateAndRefresh(name, characters) {
      this.characters = characters // updates the store
      this.$forceUpdate()
    },
  },
}
</script>
