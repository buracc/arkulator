<template>
  <v-container fluid>
    <v-row>
      <v-col md="4" v-for="(char, charName) of characters" :key="charName">
        <v-card>
          <v-card-title>
            <CharacterCardTitle
              :char-name="charName"
              :ilvl="char.ilvl"
              :char-class="char.class"
              @change-name="changeName(charName, $event)"
              @change-ilvl="changeProperty(charName, 'ilvl', $event)"
              @change-class="changeProperty(charName, 'class', $event)"
            />
            <v-spacer />
            <v-btn text @click="deleteCharacter(charName)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="6">
        <v-card>
          <v-card-title> Add new character</v-card-title>
          <v-card-text>
            <v-text-field label="Character name" v-model="addCharName" />
            <v-text-field label="Item level" v-model="addItemLevel" />
            <v-text-field label="Class" v-model="addClass" />
            <v-btn @click="addCharacter()">Add character</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CharacterCardTitle from '@/components/card/CharacterCardTitle'
export default {
  components: { CharacterCardTitle },
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
    addClass: '',
  }),
  methods: {
    deleteCharacter(name) {
      const characters = this.characters
      delete characters[name]

      this.updateAndRefresh(characters)
    },
    addCharacter() {
      const characters = this.characters
      characters[this.addCharName] = {
        ilvl: this.addItemLevel,
        class: this.addClass,
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

      this.updateAndRefresh(characters)
    },
    updateAndRefresh(characters) {
      this.characters = characters // updates the store
      this.$forceUpdate()
    },
    changeName(oldName, newName) {
      if (oldName === newName) {
        return
      }
      const characters = this.characters
      characters[newName] = characters[oldName]
      delete characters[oldName]

      this.updateAndRefresh(characters)
    },
    changeProperty(charName, property, value) {
      const characters = this.characters
      characters[charName][property] = value

      this.updateAndRefresh(characters)
    },
  },
}
</script>
