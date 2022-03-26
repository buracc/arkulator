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
    },
  },
  data: () => ({
    addCharName: '',
    addItemLevel: '',
    addClass: '',
  }),
  methods: {
    deleteCharacter(name) {
      this.$store.commit('deleteCharacter', name)
    },
    addCharacter() {
      const char = {
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

      this.$store.commit('setCharacter', {
        name: this.addCharName,
        char: char,
      })
    },
    changeName(oldName, newName) {
      if (oldName === newName) {
        return
      }
      const characters = this.characters
      const oldChar = characters[oldName]
      const newChar = (characters[newName] = oldChar)
      this.$store.commit('setCharacter', {
        name: newName,
        char: newChar,
      })
      this.$store.commit('deleteCharacter', oldName)
    },
    changeProperty(charName, property, value) {
      const char = this.characters[charName]
      char[property] = value
      this.$store.commit('setCharacter', {
        name: charName,
        char: char,
      })
    },
  },
}
</script>
