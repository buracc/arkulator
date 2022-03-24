<template>
  <v-card>
    <v-card-title> Common dailies </v-card-title>

    <v-card-text>
      <v-row>
        <v-col>
          <span v-if="Object.entries(char.dailies.common).length === 0">
            No dailies added, add a daily to start tracking.
          </span>
          <v-list v-else outlined>
            <v-list-item v-for="(daily, dailyName) of char.dailies.common" :key="dailyName">
              <v-list-item-content>
                <v-card-subtitle
                  >{{ dailyName }} ({{ daily.completions ? daily.completions : 0 }}/{{
                    daily.max_completions
                  }})</v-card-subtitle
                >
                <CommonDailyRestBonusBar
                  :daily-name="dailyName"
                  :char-name="charName"
                  :completions="daily.completions ? daily.completions : 0"
                  :max-completions="daily.max_completions"
                />
                <v-btn @click="completeDaily(charName, dailyName)"> Complete </v-btn>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn text outlined @click="deleteDaily(charName, dailyName)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
import CommonDailyRestBonusBar from '@/components/progress/CommonDailyRestBonusBar'

export default {
  components: { CommonDailyRestBonusBar },
  props: {
    charName: {
      type: String,
      required: true,
    },
  },
  computed: {
    resetDate: {
      get() {
        const now = new Date()
        return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 10))
      },
    },
    char: {
      get() {
        return this.characters[this.charName]
      },
    },
    characters: {
      get() {
        return this.$store.state.characters
      },
      set(value) {
        this.$store.commit('setCharacters', value)
      },
    },
    now: {
      get() {
        return new Date().getTime()
      },
    },
  },
  methods: {
    completeDaily(charName, dailyName) {
      const currentCompletions = this.char.dailies.common[dailyName].completions
      const maxCompletions = this.char.dailies.common[dailyName].max_completions
      if (currentCompletions && currentCompletions === maxCompletions) {
        return
      }

      this.characters[charName].dailies.common[dailyName].completions += 1
      this.updateAndRefresh(this.characters)
    },
    deleteDaily(charName, dailyName) {
      const chars = this.characters
      delete chars[charName].dailies.common[dailyName]

      this.updateAndRefresh(chars)
    },
    updateAndRefresh(characters) {
      this.characters = characters // updates the store
      this.$forceUpdate()
    },
  },
}
</script>
