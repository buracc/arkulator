<template>
  <v-row>
    <v-col md="1">
      <v-btn text @click="changeRestBonus(-10)">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-col>
    <v-col md="10">
      <v-progress-linear :value="restBonus" height="25" color="green">
        <strong>{{ title }} Rest bonus: {{ restBonus }}/100 </strong>
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
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    changeRestBonus(value) {
      this.$emit('change', value)
    },
  },
}
</script>
