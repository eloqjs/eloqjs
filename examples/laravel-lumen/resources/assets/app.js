import 'element-ui/lib/theme-chalk/index.css'

import ELOQJSAPI, { AxiosHttpClient } from '@eloqjs/api'
import ELOQJS from '@eloqjs/core'
import axios from 'axios'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import Vue from 'vue'

import Task from './components/Task.vue'
import TaskList from './components/TaskList.vue'

ELOQJS.use(ELOQJSAPI, { httpClient: new AxiosHttpClient(axios) })

Vue.component('task-list', TaskList)
Vue.component('task', Task)

Vue.use(ElementUI, { locale })

new Vue({
  el: '#app'
})
