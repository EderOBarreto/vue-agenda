import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import moment from 'moment'

import { IReminder } from '~/core/models/reminder'

@Module({
  name: 'calendar',
  namespaced: true,
  stateFactory: true,
})
export default class Calendar extends VuexModule {
  currentDate = moment()
  reminders: { [key: string]: IReminder[] } = {}
  selectedReminder: IReminder | null = null
  selectedReminderIndex = -1

  @Mutation
  nextMonth(n = 1) {
    this.currentDate = moment(this.currentDate).add(n, 'months')
  }

  @Mutation
  previousMonth(n = 1) {
    this.currentDate = moment(this.currentDate).subtract(n, 'months')
  }

  @Mutation
  saveReminder(reminder: IReminder) {
    this.reminders = {
      ...this.reminders,
      [reminder.date]:
        this.reminders[reminder.date] &&
        this.reminders[reminder.date].length > 0
          ? [...this.reminders[reminder.date], reminder]
          : [reminder],
    }
  }

  @Mutation
  editReminder(reminder: IReminder) {
    this.deleteSelectedReminder()
    this.saveReminder(reminder)
  }

  @Mutation
  deleteSelectedReminder() {
    if (this.selectedReminder && this.selectedReminderIndex >= 0) {
      const date = (this.selectedReminder as IReminder).date
      const index = this.selectedReminderIndex

      this.reminders = {
        ...this.reminders,
        [date]:
          this.reminders[date] && this.reminders[date].length > 1
            ? [
                ...this.reminders[date].slice(0, index),
                ...this.reminders[date].slice(index + 1),
              ]
            : [],
      }
    }
  }

  @Mutation
  setCurrentReminder({
    reminder,
    index,
  }: {
    reminder: IReminder
    index: number
  }) {
    this.selectedReminder = reminder
    this.selectedReminderIndex = index
  }

  @Mutation
  clearSelectedReminder() {
    this.selectedReminder = null
    this.selectedReminderIndex = -1
  }

  get firstDay() {
    return moment(this.currentDate).startOf('month').format('YYYY-MM-DD')
  }

  get lastDayPreviousMonth() {
    return moment(this.currentDate).date(0).format('YYYY-MM-DD')
  }

  get daysInMonth() {
    return moment(this.currentDate).daysInMonth()
  }

  get currentMonthDay() {
    return moment(this.currentDate).format('DD')
  }

  get curReminder() {
    return this.selectedReminder
  }
}
