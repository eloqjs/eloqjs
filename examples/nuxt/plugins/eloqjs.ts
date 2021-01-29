/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
import { Plugin } from '@nuxt/types'
import ELOQJS, { Model } from '@eloqjs/core'

import ELOQJSAPI, { AxiosHttpClient, API } from '@eloqjs/api'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $api<M extends typeof Model>(model: M): API<M>
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $api<M extends typeof Model>(model: M): API<M>
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $api<M extends typeof Model>(model: M): API<M>
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $api<M extends typeof Model>(model: M): API<M>
  }
}

const myPlugin: Plugin = ({ $axios }, inject) => {
  ELOQJS.use(ELOQJSAPI, { httpClient: new AxiosHttpClient($axios) })

  inject('api', (model: typeof Model) => new API(model))
}

export default myPlugin
