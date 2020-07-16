<template>
  <div class="calendar-page">
    <h1 class="title">Vue agenda</h1>
    <div>TOTAL: {{ counterModuleInstance.count }}</div>
    <button class="add" @click="add">+</button>
    <button class="subtract" @click="subtract">-</button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CounterModule from '~/store/counter'

@Component
class CalendarPage extends Vue {
  counterModuleInstance = getModule(CounterModule, this.$store)

  add() {
    this.counterModuleInstance.increment(1)
  }

  subtract() {
    this.counterModuleInstance.decrement(1)
  }
}

export default CalendarPage
</script>

<style lang="scss" scoped>
.calendar-page {
  height: 100vh;
  background-color: green;
}

.calendar-page > .title {
  font-size: 32px;
  color: white;
}

.calendar-page > .add {
  background: red;
  color: white;
}

.calendar-page > .subtract {
  background: white;
  color: black;
}
</style>
