import quests from '@/assets/data/unas_quests.json'
import reps from '@/assets/data/unas_reps.json'

export class Unas {
  getQuests() {
    return quests
  }

  getReputations() {
    return reps
  }

  getQuestsForReputation(name) {
    const out = {}
    const quests = this.getQuests()
    const reputation = this.getReputations()[name]
    for (let quest of reputation.quests) {
      const questName = quest.name
      if (questName in quests) {
        out[questName] = quests[questName]
      }
    }

    return out
  }
}
