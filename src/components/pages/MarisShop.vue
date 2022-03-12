<template>
  <v-card>
    <v-row style="padding: 1%">
      <v-col md="4">
        <v-card>
          <v-card-title>Tier 1 materials</v-card-title>

          <v-card-text>
            <v-list>
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_8_251.webp"
                name="Guardian stone fragment"
                amount="80"
                price="72"
                amount-multiplier="10"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_8_250.webp"
                name="Destruction stone fragment"
                amount="30"
                price="120"
                amount-multiplier="10"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_8_231.webp"
                name="Harmony shard pouch (S)"
                amount="5"
                price="23"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_8_232.webp"
                name="Harmony shard pouch (M)"
                amount="15"
                price="141"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_10_25.webp"
                name="Harmony leapstone"
                amount="5"
                price="5"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_7_169.webp"
                name="Star's breath"
                amount="10"
                price="30"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="4">
        <v-card>
          <v-card-title>Tier 2 materials</v-card-title>

          <v-card-text>
            <v-list>
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_7_16.webp"
                name="Guardian stone"
                amount="40"
                price="80"
                amount-multiplier="10"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_7_15.webp"
                name="Destruction stone fragment"
                amount="15"
                price="84"
                amount-multiplier="10"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_8_229.webp"
                name="Life shard pouch (S)"
                amount="5"
                price="23"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_10_24.webp"
                name="Life leapstone"
                amount="40"
                price="56"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_7_167.webp"
                name="Moon's breath"
                amount="5"
                price="30"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_9_69.webp"
                name="Caldarr fusion material"
                amount="10"
                price="70"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="4">
        <v-card>
          <v-card-title>Tier 3 materials</v-card-title>

          <v-card-text>
            <v-list>
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_6_104.webp"
                name="Guardian stone crystal"
                amount="20"
                price="60"
                amount-multiplier="10"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_6_105.webp"
                name="Destruction stone crystal"
                amount="30"
                price="240"
                amount-multiplier="10"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_8_225.webp"
                name="Honor shard pouch (S)"
                amount="10"
                price="56"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_7_155.webp"
                name="Honor leapstone"
                amount="10"
                price="20"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_7_155.webp"
                name="Great Honor leapstone"
                amount="5"
                price="50"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_7_161.webp"
                name="Solar grace"
                amount="20"
                price="80"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_7_162.webp"
                name="Solar blessing"
                amount="15"
                price="150"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_7_163.webp"
                name="Solar protection"
                amount="3"
                price="150"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_9_70.webp"
                name="Simple Oreha fusion material"
                amount="10"
                price="30"
              />
              <ShopItem
                image-url="https://lostarkcodex.com/icons/use_9_71.webp"
                name="Basic Oreha fusion material"
                amount="10"
                price="40"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import ShopItem from '@/components/list/ShopItem'

export default {
  components: { ShopItem },
}
</script>
