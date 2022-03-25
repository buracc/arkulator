<template>
  <v-btn small absolute bottom right fab color="primary" @click="clicked()">
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<script>
export default {
  methods: {
    clicked() {
      this.$emit('clicked')
    },
  },
}
</script>
