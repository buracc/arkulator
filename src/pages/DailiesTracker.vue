<template>
  <v-container>
    <v-row>
      <v-col>
        <div>
          <v-card-title>My characters</v-card-title>
          <v-expansion-panels multiple>
            <v-expansion-panel v-for="(char, charName) of characters" :key="charName">
              <v-expansion-panel-header>
                <h3>{{ char.class }}: {{ charName }} ({{ char.ilvl }})</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  <v-row>
                    <v-col>
                      <CommonDailyCardSection :char-name="charName">
                        <AddDailyButton
                          v-if="selectedCommonDaily && canAddCommonDaily(charName, selectedCommonDaily)"
                          @clicked="addCommonDaily(charName, selectedCommonDaily)"
                        />
                      </CommonDailyCardSection>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <UnaCardSection :charName="charName">
                        <AddDailyButton
                          v-if="selectedReputation && canAddReputation(charName, selectedReputation)"
                          @clicked="addReputation(charName, selectedReputation)"
                        />
                      </UnaCardSection>
                    </v-col>
                  </v-row>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title> Track a daily </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-select
                  :items="Object.keys(commonDailies)"
                  label="Common dailies (Chaos, Guardian)"
                  v-model="selectedCommonDaily"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-divider />
                <v-select
                  :items="Object.keys(reputations)"
                  label="Una's Reputation questline"
                  v-model="selectedReputation"
                />

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
                          <v-list-item-title class="text-wrap"> {{ quest.name }}</v-list-item-title>
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
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UnaCardSection from '@/components/card/UnaCardSection'
import CommonDailyCardSection from '@/components/card/CommonDailyCardSection'
import AddDailyButton from '@/components/button/AddDailyButton'

export default {
  components: { AddDailyButton, CommonDailyCardSection, UnaCardSection },
  inject: ['unas'],
  data: () => ({
    selectedReputation: null,
    selectedCommonDaily: null,
    commonDailies: {
      'Chaos Dungeon': {
        rest_bonus: {
          value: 0,
          last_update: new Date().getTime(),
        },
        completions: 0,
        max_completions: 2,
      },
      'Guardian Raid': {
        rest_bonus: {
          value: 0,
          last_update: new Date().getTime(),
        },
        completions: 0,
        max_completions: 2,
      },
    },
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
    },
  },
  methods: {
    addReputation(charName, repName) {
      const reputation = this.reputations[repName]
      const quests = reputation.quests.map((q) => {
        return {
          name: q.name,
          progress: 0,
          max_progress: q.req_completions,
          last_completed: null,
        }
      })

      this.$store.commit('setUnaReputation', {
        charName: charName,
        repName: repName,
        reputation: {
          rep_level: 1,
          rep_xp: 0,
          quests: quests,
        },
      })
    },
    addCommonDaily(charName, dailyName) {
      this.$store.commit('setCommonDaily', {
        charName: charName,
        dailyName: dailyName,
        daily: this.commonDailies[dailyName],
      })
    },
    canAddCommonDaily(charName, dailyName) {
      return this.characters[charName].dailies.common[dailyName] === undefined
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

      return this.characters[charName].dailies.unas.reputations[repName] === undefined
    },
  },
}
</script>
