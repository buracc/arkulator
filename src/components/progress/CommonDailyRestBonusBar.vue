<template>
  <RestBonusBar
    :rest-bonus="char.dailies.common[dailyName].rest_bonus"
    :completions="completions"
    :max-completions="maxCompletions"
    @change="changeRestBonus($event)"
    @update="updateRestBonus($event)"
  />
</template>

<script>
import RestBonusBar from '@/components/progress/RestBonusBar'

export default {
  components: { RestBonusBar },
  props: {
    dailyName: {
      type: String,
      required: true,
    },
    charName: {
      type: String,
      required: true,
    },
    completions: {
      type: Number,
      required: true,
    },
    maxCompletions: {
      type: Number,
      required: true,
    },
  },
  computed: {
    char: {
      get() {
        return this.characters[this.charName]
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
    changeRestBonus(value) {
      const current =
        this.char.dailies.common[this.dailyName].rest_bonus.value === undefined
          ? 0
          : this.char.dailies.common[this.dailyName].rest_bonus.value
      if (current + value > 100) {
        this.char.dailies.common[this.dailyName].rest_bonus.value = 100
      } else if (current + value < 0) {
        this.char.dailies.common[this.dailyName].rest_bonus.value = 0
      } else {
        this.char.dailies.common[this.dailyName].rest_bonus.value += value
      }

      this.updateAndRefresh(this.characters)
    },
    updateRestBonus(date) {
      this.char.dailies.common[this.dailyName].rest_bonus.last_update = date
      this.updateAndRefresh(this.characters)
    },
    updateAndRefresh(characters) {
      this.characters = characters // updates the store
      this.$forceUpdate()
    },
  },
}
</script>
