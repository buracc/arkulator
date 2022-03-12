<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon> {{ getIconFromType() }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title> {{ amount }} {{ type }}</v-list-item-title>
      <span v-if="desc !== null"> {{ desc }} </span>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
  },
  methods: {
    getIconFromType() {
      switch (this.type) {
        case 'Crystals':
          return '$vuetify.icons.crystalIcon'
        case 'Royal Crystals':
          return '$vuetify.icons.royalCrystalIcon'
        case 'Gold':
          return '$vuetify.icons.goldIcon'
        default:
          return null
      }
    },
  },
}
</script>
