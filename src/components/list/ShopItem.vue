<template>
  <v-list-item>
    <v-list-item-icon>
      <v-img :src="imageUrl" />
    </v-list-item-icon>
    <v-list-item-content>
      <div>
        <v-list-item-title> {{ name }} x{{ amount }} ({{ amountMultiplier }})</v-list-item-title>
      </div>

      <v-row>
        <v-col>
          <v-chip outlined>
            {{ price }}
            <v-icon right small>$vuetify.icons.crystalIcon</v-icon>
          </v-chip>
        </v-col>

        <v-col>
          <v-chip outlined>
            {{ (getGoldPrice() * amount).toLocaleString() }}
            <v-icon right small>$vuetify.icons.goldIcon</v-icon>
          </v-chip>
        </v-col>

        <v-col>
          <v-chip outlined>
            {{ getGoldPrice().toLocaleString() }}/ea <v-icon right small>$vuetify.icons.goldIcon</v-icon>
          </v-chip>
        </v-col>
      </v-row>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  computed: {
    recSalePrice: {
      get() {
        return this.$store.state.recSalePrice
      },
    },
  },

  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    amountMultiplier: {
      type: Number,
      default: 1,
      required: false,
    },
  },

  methods: {
    getGoldPrice() {
      return ((this.recSalePrice / 95) * this.price) / this.amount
    },
  },
}
</script>
