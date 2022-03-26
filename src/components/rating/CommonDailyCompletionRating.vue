<template>
  <v-row>
    <v-col>
      <v-rating
        :length="characters[charName].dailies.common[dailyName].max_completions"
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
        const currentCompletions = this.characters[this.charName].dailies.common[this.dailyName].completions
        this.$store.commit('setCommonDailyCompletions', {
          charName: this.charName,
          dailyName: this.dailyName,
          value: value,
        })
        for (let i = 0; i < value - currentCompletions; i++) {
          const currentRestBonus = this.characters[this.charName].dailies.common[this.dailyName].rest_bonus.value
          if (currentRestBonus > 10) {
            this.$store.commit('setCommonDailyRestBonus', {
              charName: this.charName,
              dailyName: this.dailyName,
              property: 'value',
              value: currentRestBonus - 20,
            })
          }
        }
      },
    },
    characters: {
      get() {
        return this.$store.state.characters
      },
    },
  },
}
</script>
