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
        return this.$store.state.characters[this.charName]
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
        this.setRestBonus('value', 100)
      } else if (current + value < 0) {
        this.setRestBonus('value', 0)
      } else {
        this.setRestBonus('value', current + value)
      }
    },
    setRestBonus(property, value) {
      this.$store.commit('setCommonDailyRestBonus', {
        charName: this.charName,
        dailyName: this.dailyName,
        property: property,
        value: value,
      })
    },
    updateRestBonus(date) {
      this.setRestBonus('last_update', date)
      this.$store.commit('setCommonDailyCompletions', {
        charName: this.charName,
        dailyName: this.dailyName,
        value: 0,
      })
    },
  },
}
</script>
