<template>
  <v-main>
    <v-row dense style="padding-bottom: 2%; padding-left: 1%; padding-right: 1%">
      <v-col md="4" v-for="(char, charName) of characters" :key="charName">
        <v-card>
          <v-card-title>
            {{ charName }} ({{ char.ilvl }})
            <v-spacer />
            <v-btn text @click="deleteCharacter(charName)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
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
                          <v-icon x-small @click="setQuestCompletedToday(quest)">
                            {{ !canDoQuestToday(quest) ? '✅' : '❌' }}
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

            <v-btn
              absolute
              bottom
              right
              small
              fab
              color="primary"
              v-if="selectedReputation && canAddReputation(charName, selectedReputation)"
              @click="addDaily(charName, selectedReputation)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="3">
        <v-card>
          <v-card-title> Add new character</v-card-title>
          <v-card-text>
            <v-text-field label="Character name" v-model="addCharName" />
            <v-text-field label="Item level" v-model="addItemLevel" />
            <v-btn @click="addCharacter">Add character</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense style="padding-bottom: 2%; padding-left: 1%; padding-right: 1%">
      <v-col md="4">
        <v-card>
          <v-card-title> Track a daily </v-card-title>
          <v-card-text>
            <v-select :items="Object.keys(reputations)" label="Reputation questline" v-model="selectedReputation" />

            <v-row dense v-if="selectedReputation">
              <v-col>
                <h2>Reputation rewards</h2>
                <v-list dense>
                  <v-list-item v-for="(rep, level) of reputations[selectedReputation].levels" :key="level">
                    <v-list-item-content>
                      <v-list-item-title> Level {{ level }} ({{ rep.xp }} XP):</v-list-item-title>
                      <span v-for="(amount, item) of rep.rewards" :key="item"> {{ item }} {{ amount }}x </span>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>

            <v-row dense v-if="selectedReputation">
              <v-list dense>
                <h2>Associated daily quests</h2>
                <v-row v-for="(quest, i) of reputations[selectedReputation].quests" :key="i">
                  <v-list-item>
                    <v-col md="5">
                      <v-list-item-title class="text-wrap"> {{ quest.name }} </v-list-item-title>
                      <v-list-item-subtitle v-if="quests[quest.name]">
                        {{ quests[quest.name].location['continent'] }}:
                        {{ quests[quest.name].location['area'] }}
                      </v-list-item-subtitle>
                    </v-col>

                    <v-col>
                      <v-list dense>
                        <v-list-item v-if="quests[quest.name]">
                          <v-list-item-content>
                            <v-list-item-title> Quest rewards:</v-list-item-title>
                            <span v-for="(amount, item) of quests[quest.name].rewards" :key="item">
                              {{ item }} {{ amount }}x
                            </span>
                          </v-list-item-content>
                        </v-list-item>
                        <span v-else> Quest has not been mapped yet </span>
                      </v-list>
                    </v-col>
                  </v-list-item>
                </v-row>
              </v-list>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
export default {
  inject: ['unas'],
  data: () => ({
    addCharName: '',
    addItemLevel: '',
    selectedReputation: null,
  }),
  computed: {
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
    addCharacter() {
      const characters = this.characters
      characters[this.addCharName] = {
        ilvl: this.addItemLevel,
        dailies: {},
      }

      this.refresh(this.addCharName, characters)
    },
    deleteCharacter(name) {
      const characters = this.characters
      delete characters[name]

      this.refresh(name, characters)
    },
    addDaily(charName, repName) {
      const reputation = this.reputations[repName]
      const quests = reputation.quests.map((q) => {
        return {
          name: q.name,
          progress: 0,
          maxProgress: q.req_completions,
          lastCompleted: null,
        }
      })

      const chars = this.characters
      chars[charName].dailies[repName] = {
        rep_level: '1',
        rep_xp: 0,
        quests: quests,
      }

      this.refresh(charName, chars)
    },
    deleteDaily(charName, repName) {
      const chars = this.characters
      delete chars[charName].dailies[repName]

      this.refresh(charName, chars)
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
      const chars = this.characters
      const char = chars[charName]
      const dailies = char.dailies
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
      const maxXp = this.getMaxXp(dailyName, daily.rep_level)
      daily.rep_xp += Number.parseInt(this.quests[questName].rewards['Reputation'])

      if (daily.rep_xp >= maxXp && daily.rep_level < this.getMaxRepLvl(dailyName)) {
        daily.rep_xp = 0
        daily.rep_level++
      }

      this.refresh(charName, chars)
    },
    uncompleteQuest(charName, dailyName, questName) {
      const chars = this.characters
      const char = chars[charName]
      const dailies = char.dailies
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

      this.refresh(charName, chars)
    },
    canDoQuestToday(quest) {
      if (quest.maxProgress !== undefined && quest.progress === quest.maxProgress) {
        return false
      }

      if (quest.lastCompleted === null) {
        return true
      }

      const completionTime = new Date(quest.lastCompleted)
      const resetTime = new Date()
      resetTime.setHours(10, 0, 0, 0)
      return completionTime < resetTime && new Date() > resetTime
    },
    canAddReputation(charName, repName) {
      const quests = this.reputations[repName].quests
      if (quests === undefined) {
        return false
      }

      for (let quest of quests) {
        if (this.quests[quest.name] === undefined) {
          return false
        }
      }

      return this.characters[charName].dailies[repName] === undefined
    },
    setQuestCompletedToday(quest) {
      if (quest.lastCompleted === null) {
        quest.lastCompleted = new Date()
      } else {
        quest.lastCompleted = null
      }
    },
    isIlvlMetForQuest(charName, quest) {
      const char = this.characters[charName]
      return char.ilvl >= this.quests[quest.name].ilvl
    },
    refresh(name, characters) {
      this.characters = characters
      this.$forceUpdate()
    },
  },
}
</script>
