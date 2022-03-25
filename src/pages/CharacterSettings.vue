<template>
  <v-main>
    <v-row>
      <v-col md="3" v-for="(char, charName) of characters" :key="charName">
        <v-card>
          <v-card-title>
            {{ charName }} ({{ char.ilvl }})
            <v-spacer />
            <v-btn text @click="deleteCharacter(charName)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

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
  </v-main>
</template>

<script>
export default {
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
  data: () => ({
    addCharName: '',
    addItemLevel: '',
  }),
  methods: {
    deleteCharacter(name) {
      const characters = this.characters
      delete characters[name]

      this.updateAndRefresh(name, characters)
    },
    addCharacter() {
      const characters = this.characters
      characters[this.addCharName] = {
        ilvl: this.addItemLevel,
        dailies: {
          unas: {
            rest_bonus: {
              value: 0,
              last_update: new Date().getTime(),
            },
            reputations: {},
          },
          common: {},
        },
      }

      this.updateAndRefresh(this.addCharName, characters)
    },
    updateAndRefresh(name, characters) {
      this.characters = characters // updates the store
      this.$forceUpdate()
    },
  },
}
</script>
