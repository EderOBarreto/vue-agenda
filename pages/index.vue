<template>
  <div class="calendar-page">
    <h1 class="title">Vue Agenda</h1>
    <div class="control">
      <button class="button previous" @click="previousMonth">&#60;</button>
      <button class="button next" @click="nextMonth">&#62;</button>
      <span class="title">{{ getMonthName }}, {{ getYear }}</span>
    </div>
    <table class="table">
      <thead class="header">
        <th v-for="weekday in weekdays" :key="weekday" class="title">
          {{ weekday }}
        </th>
      </thead>
      <tbody class="body">
        <tr v-for="(week, index) of getWeeks" :key="index" class="row">
          <calendar-day
            v-for="d of week"
            :key="d.day"
            :date="d.day"
            :is-current-month="d.isCurrentMonth"
            :is-current-day="d.isCurrentDay"
            :is-weekend="d.isWeekend"
            @open-modal="openModal"
            @create-reminder="createReminder"
            @show-reminder="openModal"
          />
        </tr>
      </tbody>
    </table>
    <modal ref="modal">
      <reminder :date="remindDate" @close-modal="closeModal" />
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'

import { getModule } from 'vuex-module-decorators'
import Calendar from '~/store/calendar'
import { chunkArray } from '~/utils/chunckArray'

import { IDay } from '~/core/models/days'
// import { IReminder } from '~/core/models/reminder'

import CalendarDay from '~/components/CalendarDay.vue'
import Reminder from '~/components/Reminder.vue'
import Modal from '~/components/Modal.vue'

@Component({
  components: { CalendarDay, Modal, Reminder },
})
class Index extends Vue {
  $refs!: {
    modal: Modal
  }

  calInstance = getModule(Calendar, this.$store)

  weekdays = moment.weekdays()
  // selectedRemind!: IReminder
  remindDate = ''

  created() {
    this.remindDate = moment(this.calInstance.currentDate).format('YYYY-MM-DD')
  }

  private openModal() {
    this.$refs.modal.openModal()
  }

  clearSelectedReminder() {
    this.calInstance.clearSelectedReminder()
  }

  closeModal() {
    this.$refs.modal.closeModal()
  }

  createReminder(date: string) {
    this.openModal()
    this.remindDate = date
  }

  previousMonth() {
    this.calInstance.previousMonth()
  }

  nextMonth() {
    this.calInstance.nextMonth()
  }

  get getMonthName() {
    return moment(this.calInstance.currentDate).format('MMMM')
  }

  get getYear() {
    return moment(this.calInstance.currentDate).format('YYYY')
  }

  get firstDaysOfMonth() {
    let previousDays: IDay[] = []
    const firstDayofWeek = moment(this.calInstance.firstDay).day()
    const lastDayPreviousMonth = this.calInstance.lastDayPreviousMonth

    for (let i = 0; i < firstDayofWeek; i++) {
      previousDays = [
        {
          day: moment(lastDayPreviousMonth)
            .subtract(i, 'days')
            .format('YYYY-MM-DD'),
          isCurrentMonth: false,
          isCurrentDay: false,
        },
        ...previousDays,
      ]
    }

    return previousDays
  }

  get daysInMonth() {
    const daysInMonth = this.calInstance.daysInMonth
    let monthDays: IDay[] = []
    for (let i = daysInMonth; i > 0; i--) {
      monthDays = [
        {
          day: moment(this.calInstance.lastDayPreviousMonth)
            .add(i, 'day')
            .format('YYYY-MM-DD'),
          isCurrentMonth: true,
          isCurrentDay: i === Number(this.calInstance.currentMonthDay),
        },
        ...monthDays,
      ]
    }
    return monthDays
  }

  get getSlots() {
    let totalSlots = [...this.firstDaysOfMonth, ...this.daysInMonth]
    const calendarRest = totalSlots.length % 7
    const lastMonthDay = totalSlots[totalSlots.length - 1]

    if (calendarRest > 0) {
      for (let i = 1; i <= 7 - calendarRest; i++) {
        totalSlots = [
          ...totalSlots,
          {
            day: moment(lastMonthDay.day).add(i, 'days').format('YYYY-MM-DD'),
            isCurrentMonth: false,
            isCurrentDay: false,
          },
        ]
      }
    }

    return totalSlots
  }

  get getWeeks() {
    const mat = chunkArray(this.getSlots, 7)
    return mat.map((week) => {
      const rest = week.slice(1, -1)
      const first = week[0]
      const last = week[6]
      return [
        { ...first, isWeekend: true },
        ...rest.map((date) => ({ ...date, isWeekend: false })),
        { ...last, isWeekend: true },
      ]
    })
  }
}

export default Index
</script>

<style lang="scss" scoped>
.calendar-page {
  display: grid;
  background: white;
}

.calendar-page > .title {
  font-size: 32px;
  text-align: center;
}

.calendar-page > .control {
  height: 60px;
  display: flex;
  padding: 0 20px;
  align-items: center;
}

.calendar-page > .control > .button {
  background: white;
  border: none;
  margin-right: 10px;
  font-size: 20px; // TODO: remove later
  cursor: pointer;

  &:hover {
    background-color: darken(#fff, 10%);
  }
}

.calendar-page > .control > .title {
  font-weight: 500;
}

.calendar-page > .table {
  border-collapse: collapse;
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
