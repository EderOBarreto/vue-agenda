<template>
  <div class="calendar-page">
    <h1 class="title">Calendar</h1>
    <div>&#60; <span>Month</span> <span>Year</span> &#62;</div>
    <table class="table">
      <thead class="header">
        <th v-for="weekday in weekdays" :key="weekday" class="title">
          {{ weekday }}
        </th>
      </thead>
      <tbody class="body">
        <tr v-for="(week, index) of getWeeks" :key="index" class="row">
          <td
            v-for="d of week"
            :key="d.day"
            :class="['day', { '-empty': d.isCurrentMonth }]"
          >
            {{ d.day }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'

import { chunkArray } from '~/utils/chunckArray'

@Component
class Index extends Vue {
  weekdays = moment.weekdays()

  firstDaysOfMonth() {
    let previousDays: any = []
    const firstDay = Number(moment().startOf('month').format('d'))
    const lastDayPreviousMonth = Number(moment().date(0).format('DD'))

    for (let i = 0; i < firstDay; i++) {
      previousDays = [
        {
          day: lastDayPreviousMonth - i,
          isCurrentMonth: false,
          isCurrentDay: false,
        },
        ...previousDays,
      ]
    }

    return previousDays
  }

  daysInMonth() {
    const days = moment().daysInMonth()
    let arrDays: any = []
    for (let i = days; i > 0; i--) {
      arrDays = [
        {
          day: i,
          isCurrentMonth: true,
          isCurrentDay: i === Number(moment().format('DD')),
        },
        ...arrDays,
      ]
    }
    return arrDays
  }

  getSlots() {
    let totalSlots = [...this.firstDaysOfMonth(), ...this.daysInMonth()]
    const calendarRest = totalSlots.length % 7

    if (calendarRest > 0) {
      for (let i = 1; i <= 7 - calendarRest; i++) {
        totalSlots = [
          ...totalSlots,
          { day: i, isCurrentMonth: false, isCurrentDay: false },
        ]
      }
    }

    return totalSlots
  }

  get getWeeks() {
    return chunkArray(this.getSlots(), 7)
  }
}

export default Index
</script>

<style lang="scss" scoped>
.calendar-page {
  background: white;
}

.calendar-page > .title {
  font-size: 32px;
}

.calendar-page > .table > .header {
  background-color: #2f74b5;
  color: white;
  position: relative;
}

.calendar-page > .table > .header > .title {
  width: calc(100% / 7);
}

.calendar-page > .table > .body > .row > .day {
  height: 100px;
  text-align: center;

  &.-empty {
    background: #2f74b5;
  }
}
</style>
