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
        return this.$store.state.characters[this.charName]
      },
    },
  },
  methods: {
    changeUnasRestBonus(value) {
      const current =
        this.char.dailies.unas.rest_bonus.value === undefined ? 0 : this.char.dailies.unas.rest_bonus.value
      if (current + value > 100) {
        this.setUnasRestBonusValue(100)
      } else if (current + value < 0) {
        this.setUnasRestBonusValue(0)
      } else {
        this.setUnasRestBonusValue(current + value)
      }
    },
    setUnasRestBonusValue(value) {
      this.$store.commit('setUnaRestBonus', {
        charName: this.charName,
        property: 'value',
        value: value,
      })
    },
    updateUnasRestBonus(date) {
      this.$store.commit('setUnaRestBonus', {
        charName: this.charName,
        property: 'last_update',
        value: date,
      })
    },
  },
}
</script>
