<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">Arkulator</div>

      <template v-slot:extension>
        <v-tabs centered v-model="currentTab">
          <v-tab v-for="(tab, i) in tabs" :key="i"> {{ tab.title }} </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main color="tertiary">
      <v-tabs-items v-model="currentTab">
        <v-tab-item v-for="(tab, i) in tabs" :key="i">
          <component v-bind:is="tab.component"></component>
        </v-tab-item>
      </v-tabs-items>
    </v-main>
  </v-app>
</template>

<script>
import MarisShop from '@/pages/MarisShop'
import CurrencyExchange from '@/pages/CurrencyExchange'
import DailiesTracker from '@/pages/DailiesTracker'
import CharacterSettings from '@/pages/CharacterSettings'

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
        title: 'Dailies tracker',
        component: DailiesTracker,
      },
      {
        title: 'Currencies',
        component: CurrencyExchange,
      },
      {
        title: 'Characters',
        component: CharacterSettings,
      },
    ],
  }),
}
</script>
