import Vuex from 'vuex'
import CounterModule from '~/store/counter'
import Calendar from '~/store/calendar'

export function createStore() {
  return new Vuex.Store({
    modules: {
      Calendar,
      CounterModule,
    },
  })
}
