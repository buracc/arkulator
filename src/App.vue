<template>
  <v-app>
    <v-app-bar app color="tertiary" dark>
      <div class="d-flex align-center">Arkulator</div>

      <template v-slot:extension>
        <v-tabs centered v-model="currentTab">
          <v-tab v-for="tab in tabs" :key="tab"> {{ tab.title }} </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <v-tabs-items v-model="currentTab">
        <v-tab-item v-for="tab in tabs" :key="tab">
          <component v-bind:is="tab.component"></component>
        </v-tab-item>
      </v-tabs-items>
    </v-main>
  </v-app>
</template>

<script>
import MarisShop from '@/components/pages/MarisShop'
import CurrencyExchange from '@/components/pages/CurrencyExchange'

export default {
  name: 'App',

  data: () => ({
    currentTab: null,
    tabs: [
      {
        title: "Mari's shop",
        component: MarisShop,
      },
      {
        title: 'Currency Exchange',
        component: CurrencyExchange,
      },
    ],
  }),
}
</script>
