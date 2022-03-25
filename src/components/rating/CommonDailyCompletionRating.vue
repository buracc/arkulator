<template>
  <v-row>
    <v-col>
      Completions:
      <v-rating
        length="2"
        :value="characters[charName].dailies.common[dailyName].max_completions"
        v-model="completions"
        clearable
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    dailyName: {
      type: String,
      required: true,
    },
    charName: {
      type: String,
      required: true,
    },
  },
  computed: {
    completions: {
      get() {
        return this.characters[this.charName].dailies.common[this.dailyName].completions
      },
      set(value) {
        this.characters[this.charName].dailies.common[this.dailyName].completions = value
        this.updateAndRefresh(this.characters)
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
    updateAndRefresh(characters) {
      this.characters = characters // updates the store
      this.$forceUpdate()
    },
  },
}
</script>
