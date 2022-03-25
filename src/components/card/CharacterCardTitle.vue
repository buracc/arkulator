<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field label="Name" v-if="editing['name']" v-model="edit['name']" @keydown="submit('name', $event)" />
        <span v-else @click="editProperty('name', charName)">Name: {{ charName }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Item level"
          v-if="editing['ilvl']"
          v-model="edit['ilvl']"
          @keydown="submit('ilvl', $event)"
        />
        <span v-else @click="editProperty('ilvl', ilvl)">Item level: {{ ilvl }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Class"
          v-if="editing['class']"
          v-model="edit['class']"
          @keydown="submit('class', $event)"
        />
        <span v-else @click="editProperty('class', charClass)">Class: {{ charClass }}</span>
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
    charClass: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    edit: { name: '', ilvl: '', class: '' },
    editing: { class: false, name: false, ilvl: false },
  }),
  methods: {
    editProperty(property, defaultValue) {
      this.editing[property] = true
      this.edit[property] = defaultValue
    },
    submit(field, keyEvent) {
      if (keyEvent.key !== 'Enter') return
      this.editing[field] = false
      this.$emit(`change-${field}`, this.edit[field])
    },
  },
}
</script>
