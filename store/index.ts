import Vuex from 'vuex'
import { getModule } from 'vuex-module-decorators'
import CounterModule from '~/store/counter'
import Calendar from '~/store/calendar'

export function createStore() {
  return new Vuex.Store({
    modules: {
      calendar: getModule(Calendar),
      CounterModule,
    },
  })
}
