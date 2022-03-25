<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field label="Name" v-if="editingName" v-model="newName" @keydown="submitName" />
        <span v-else @click="editName">Name: {{ charName }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field label="Item level" v-if="editingIlvl" v-model="newIlvl" @keydown="submitIlvl" />
        <span v-else @click="editIlvl">Item level: {{ ilvl }}</span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    ilvl: {
      type: String,
      required: true,
    },
    charName: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    editingName: false,
    editingIlvl: false,
    newName: '',
    newIlvl: '',
  }),
  methods: {
    editName() {
      this.editingName = true
      this.newName = this.charName
    },
    editIlvl() {
      this.editingIlvl = true
      this.newIlvl = this.ilvl
    },
    submitName(keyEvent) {
      if (keyEvent.key !== 'Enter') return
      this.$emit('change-name', this.newName)
      this.editingName = false
    },
    submitIlvl(keyEvent) {
      if (keyEvent.key !== 'Enter') return
      this.$emit('change-ilvl', this.newIlvl)
      this.editingIlvl = false
    },
  },
}
</script>
