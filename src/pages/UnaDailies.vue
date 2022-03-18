<template>
  <v-main>
    <v-row dense style="padding-bottom: 2%; padding-left: 1%; padding-right: 1%">
      <v-col md="6" v-for="(char, charName) of characters" :key="charName">
        <UnaCard :charName="charName">
          <v-btn
            small
            absolute
            bottom
            right
            fab
            color="primary"
            v-if="selectedReputation && canAddReputation(charName, selectedReputation)"
            @click="addDaily(charName, selectedReputation)"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </UnaCard>
      </v-col>
    </v-row>

    <v-row dense style="padding-bottom: 2%; padding-left: 1%; padding-right: 1%">
      <v-card>
        <v-card-title> Track a daily</v-card-title>
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
        </v-card-text>
      </v-card>
    </v-row>
  </v-main>
</template>

<script>
export default {
  inject: ['unas'],
  data: () => ({
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

      this.updateAndRefresh(charName, chars)
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
    updateAndRefresh(name, characters) {
      this.characters = characters // updates the store
      this.$forceUpdate()
    },
  },
}
</script>
