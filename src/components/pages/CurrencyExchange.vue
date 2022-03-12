<template>
  <v-card>
    <v-row style="padding: 1%">
      <v-col md="3">
        <v-card>
          <v-card-title>Crystal conversion rate</v-card-title>
          <v-card-text>
            <v-text-field label="Recommended sale price" v-model="recSalePrice" />
            <v-text-field label="Min. transaction amount" v-model="minTxAmount" />
            <span>The in-game conversion rate.</span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="3">
        <v-card>
          <v-card-title>Prices</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field label="Gold amount" v-model="goldAmount" />
                <v-text-field label="Royal crystal amount" v-model="royalAmount" />
              </v-col>
              <v-col
                ><v-text-field label="Gold price" v-model="goldPrice" prefix="$" />
                <v-text-field label="Royal crystal price" v-model="royalPrice" prefix="$" />
              </v-col>
            </v-row>
            <span>The current sale prices for gold (gold sellers) and royal crystals (Steam store).</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row style="padding: 1%">
      <v-col md="9">
        <v-card>
          <v-card-title>Exchange rates</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field label="Amount of money" v-model="moneyConversion" prefix="$" />
                <span>${{ moneyConversion }} converts into...</span>

                <v-list>
                  <CurrencyItem
                    type="Gold"
                    :amount="moneyToGold(moneyConversion)"
                    desc="When buying from gold sellers"
                  />
                  <CurrencyItem
                    type="Crystals"
                    :amount="goldPurchaseToCrystals(moneyConversion)"
                    desc="When buying gold & converting to crystals"
                  />
                  <CurrencyItem
                    type="Crystals"
                    :amount="royalCrystalPurchaseToCrystals(moneyConversion)"
                    desc="When buying royal crystals through Steam & converting to gold"
                  />
                </v-list>
              </v-col>
              <v-col>
                <v-text-field label="Amount of gold" v-model="goldConversion" suffix="G" />
                <span>{{ goldConversion }}G converts into...</span>

                <v-list>
                  <CurrencyItem :amount="goldToCrystals(goldConversion)" type="Crystals" />
                </v-list>
              </v-col>
              <v-col>
                <v-text-field label="Amount of Royal Crystals" v-model="rcConversion" suffix="RC" />
                <span>{{ rcConversion }} Royal crystals convert into...</span>

                <v-list>
                  <CurrencyItem :amount="royalToGold(rcConversion)" type="Gold" />
                  <CurrencyItem
                    :amount="royalToCrystals(rcConversion)"
                    type="Crystals"
                    desc="Convert to gold, then gold to crystals"
                  />
                </v-list>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <span>Price for 1 crystal:</span>
                <li>${{ getCrystalToGoldSellerPrice().toLocaleString() }} if purchasing gold</li>
                <li>${{ getCrystalToSteamPrice().toLocaleString() }} if purchasing Royal crystals and converting</li>
                <li>{{ getCrystalToGoldPrice().toLocaleString() }} Gold</li>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import CurrencyItem from '@/components/list/CurrencyItem'
export default {
  components: { CurrencyItem },
  computed: {
    recSalePrice: {
      get() {
        return this.$store.getters.getSalePrice
      },
      set(value) {
        this.$store.commit('setSalePrice', value)
      },
    },
    minTxAmount: {
      get() {
        return this.$store.getters.getMinTxAmount
      },
      set(value) {
        this.$store.commit('setMinTxAmount', value)
      },
    },
  },
  data: () => ({
    goldAmount: 1000,
    goldPrice: 1.2,
    royalAmount: 12000,
    royalPrice: 100,

    moneyConversion: 100,
    goldConversion: 1000,
    rcConversion: 12000,
  }),
  methods: {
    goldPurchaseToCrystals(money) {
      return (money / this.getCrystalToGoldSellerPrice()).toLocaleString()
    },
    royalCrystalPurchaseToCrystals(money) {
      return (money / this.getCrystalToSteamPrice()).toLocaleString()
    },
    goldToCrystals(gold) {
      return (gold / this.getCrystalToGoldPrice()).toLocaleString()
    },
    royalToCrystals(royal) {
      return (royal * this.getRoyalCrystalToCrystal()).toLocaleString()
    },
    royalToGold(royal) {
      return (royal * this.getRoyalCrystalToGold()).toLocaleString()
    },
    moneyToGold(money) {
      return ((this.goldAmount / this.goldPrice) * money).toLocaleString()
    },

    getRoyalCrystalToGold() {
      return this.recSalePrice / this.minTxAmount
    },
    getRoyalCrystalToCrystal() {
      return 95 / this.minTxAmount
    },
    getCrystalToGoldPrice() {
      return this.recSalePrice / 95
    },
    getCrystalToGoldSellerPrice() {
      return (this.goldPrice / this.goldAmount) * this.getCrystalToGoldPrice()
    },
    getCrystalToSteamPrice() {
      return ((this.royalPrice / this.royalAmount) * this.minTxAmount) / 95
    },
  },
}
</script>
