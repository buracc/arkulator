<template>
  <RestBonusBar
    :rest-bonus="char.dailies.unas.rest_bonus"
    :completions="completions"
    :max-completions="3"
    @change="changeUnasRestBonus($event)"
    @update="updateUnasRestBonus($event)"
  />
</template>

<script>
import RestBonusBar from '@/components/progress/RestBonusBar'

export default {
  components: { RestBonusBar },
  props: {
    charName: {
      type: String,
      required: true,
    },
    completions: {
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
    changeUnasRestBonus(value) {
      const current =
        this.char.dailies.unas.rest_bonus.value === undefined ? 0 : this.char.dailies.unas.rest_bonus.value
      if (current + value > 100) {
        this.char.dailies.unas.rest_bonus.value = 100
      } else if (current + value < 0) {
        this.char.dailies.unas.rest_bonus.value = 0
      } else {
        this.char.dailies.unas.rest_bonus.value += value
      }

      this.updateAndRefresh(this.characters)
    },
    updateUnasRestBonus(date) {
      this.char.dailies.unas.rest_bonus.last_update = date
      this.updateAndRefresh(this.characters)
    },
    updateAndRefresh(characters) {
      this.characters = characters // updates the store
      this.$forceUpdate()
    },
  },
}
</script>
