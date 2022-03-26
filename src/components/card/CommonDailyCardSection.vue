<template>
  <v-card>
    <v-card-title> Common dailies</v-card-title>

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
                  >{{ dailyName }} ({{ daily.completions ? daily.completions : 0 }}/{{ daily.max_completions }})
                </v-card-subtitle>
                <CommonDailyRestBonusBar
                  :daily-name="dailyName"
                  :char-name="charName"
                  :completions="daily.completions ? daily.completions : 0"
                  :max-completions="daily.max_completions"
                />
              </v-list-item-content>

              <v-list-item-action>
                <CommonDailyCompletionRating :char-name="charName" :daily-name="dailyName" />
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
import CommonDailyCompletionRating from '@/components/rating/CommonDailyCompletionRating'

export default {
  components: { CommonDailyCompletionRating, CommonDailyRestBonusBar },
  props: {
    charName: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    completions: 0,
  }),
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
    },
    now: {
      get() {
        return new Date().getTime()
      },
    },
  },
  methods: {
    deleteDaily(charName, dailyName) {
      this.$store.commit('deleteCommonDaily', { charName: charName, dailyName: dailyName })
    },
  },
}
</script>
