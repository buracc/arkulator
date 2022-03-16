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
            <v-list v-else>
              <v-list-item v-for="(daily, dailyName) of char.dailies" :key="dailyName">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ dailyName }} - Lvl: {{ daily.rep_level }} ({{
                      getDisplayedXp(dailyName, daily.rep_level, daily.rep_xp)
                    }}/{{ getMaxXp(dailyName, daily.rep_level) }}
                    XP)
                  </v-list-item-title>
                  <v-list-item-content>
                    <v-row v-for="(quest, i) of daily.quests" :key="i">
                      <v-col> {{ quest.name }} </v-col>
                      <v-col>
                        Completed: {{ quest.progress }} {{ quest.maxProgress ? '/ ' + quest.maxProgress : '' }}
                      </v-col>
                      <v-col>
                        <v-btn text small outlined @click="uncompleteQuest(charName, dailyName, quest.name)">
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                        <v-btn text small outlined @click="completeQuest(charName, dailyName, quest.name)">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn text outlined @click="deleteDaily(charName, dailyName)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-divider />

            <span>Select a daily below to start tracking.</span>
            <v-select :items="Object.keys(reputations)" label="Reputation chain" v-model="selectedReputation" />

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
                      <v-list-item-subtitle>
                        {{ quests[quest.name].location['continent'] }}:
                        {{ quests[quest.name].location['area'] }}
                      </v-list-item-subtitle>
                    </v-col>

                    <v-col>
                      <v-list dense>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title> Quest rewards:</v-list-item-title>
                            <span v-for="(amount, item) of quests[quest.name].rewards" :key="item">
                              {{ item }} {{ amount }}x
                            </span>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-list-item>
                </v-row>
              </v-list>
            </v-row>

            <v-btn
              absolute
              bottom
              right
              small
              fab
              color="primary"
              v-if="selectedQuest && selectedReputation"
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
  </v-main>
</template>

<script>
export default {
  inject: ['unas'],
  data: () => ({
    editDialog: {},
    addCharName: '',
    addItemLevel: '',
    selectedReputation: null,
    selectedQuest: null,
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
    saveCharacter(name) {
      const characters = this.characters
      const char = characters[name]

      this.editDialog[name] = false
      console.log(char)
    },
    editCharacter(name) {
      this.editDialog[name] = true
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
      return xp <= maxXp ? xp : maxXp
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
      daily.rep_xp -= Number.parseInt(this.quests[questName].rewards['Reputation'])
      if (daily.rep_xp < 0) {
        daily.rep_level--
        daily.rep_xp = this.getMaxXp(dailyName, daily.rep_level) - 10
      }

      this.refresh(charName, chars)
    },
    refresh(name, characters) {
      this.characters = characters
      this.editDialog[name] = false
      this.$forceUpdate()
    },
  },
}
</script>
