import Vuex from 'vuex'
import CounterModule from '~/store/counter'

export function createStore() {
  return new Vuex.Store({
    modules: {
      CounterModule,
    },
  })
}
