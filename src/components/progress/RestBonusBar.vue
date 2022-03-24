<template>
  <v-row>
    <v-col md="1">
      <v-btn text @click="changeRestBonus(-10)">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-col>
    <v-col md="10">
      <v-progress-linear :value="restBonus.value" height="25" color="green">
        <strong>Rest bonus: {{ restBonus.value }}/100 </strong>
      </v-progress-linear>
    </v-col>
    <v-col md="1" @click="changeRestBonus(10)">
      <v-btn text>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    restBonus: {
      type: Object,
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
  mounted() {
    let restBonus = this.restBonus
    const lastUpdate = restBonus.last_update
    const resetDate = this.resetDate
    const now = new Date()
    if (lastUpdate === undefined) {
      this.updateRestBonus(now)
    } else {
      const lastRestBonusCalculation = new Date(lastUpdate)
      if (now >= resetDate && lastRestBonusCalculation < resetDate) {
        this.changeRestBonus((this.maxCompletions - this.completions) * 10)
        const idleDays = Math.floor((now - lastRestBonusCalculation) / (1000 * 60 * 60 * 24)) - 1
        if (idleDays > 0) {
          this.changeRestBonus(idleDays * (this.maxCompletions * 10))
        }

        this.updateRestBonus(now)
      }
    }
  },
  computed: {
    resetDate: {
      get() {
        const now = new Date()
        return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 10))
      },
    },
  },
  methods: {
    changeRestBonus(value) {
      if (this.restBonus.value + value > 100) {
        this.$emit('change', 0)
      } else if (this.restBonus.value + value < 0) {
        this.$emit('change', 0)
      } else {
        this.$emit('change', value)
      }
    },
    updateRestBonus(date) {
      this.$emit('update', date)
    },
  },
}
</script>
