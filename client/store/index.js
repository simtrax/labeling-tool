import Vue from 'vue'
import Vuex from 'vuex'

import annotations from './modules/annotations'
import geometries from './modules/geometries'
import models from './modules/models'
import points from './modules/points'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        annotations,
        geometries,
        models,
        points,
    }
})

export default store
