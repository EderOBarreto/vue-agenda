import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import moment from 'moment'

@Module({
  name: 'calendar',
  namespaced: true,
  stateFactory: true,
})
export default class Calendar extends VuexModule {
  currentDate = moment()

  get firstDay() {
    return moment(this.currentDate).startOf('month').format('d')
  }

  get lastDayPreviousMonth() {
    return moment(this.currentDate).date(0).format('DD')
  }

  get daysInMonth() {
    return moment(this.currentDate).daysInMonth()
  }

  get currentMonthDay() {
    return moment(this.currentDate).format('DD')
  }

  @Mutation
  nextMonth(n = 1) {
    this.currentDate = moment(this.currentDate).add(n, 'months')
  }

  @Mutation
  previousMonth(n = 1) {
    this.currentDate = moment(this.currentDate).subtract(n, 'months')
  }
}
