const namespaced = true

import Vue from 'vue'
import uuid from 'uuid'

const state = {

    geometries: []

}

const getters = {

    geometries: state => {
        return state.geometries
    },

    selectedGeometries: state => {
        return state.geometries.filter(geometry => geometry.properties.selected)
    }

}

const actions = {

    /**
     * Load the stored geometries from local storage
     */
    LOAD_GEOMETRIES ({ commit }) {
        let geometries = Vue.localStorage.get('geometries')

        if(geometries) {
            commit('addGeometries', JSON.parse(geometries))
        }
    },

}

const mutations = {

    addGeometry (state, geometry) {

        geometry.properties.id = uuid.v4()
        geometry.properties.selected = false

        state.geometries.push(geometry)

        Vue.localStorage.set('geometries', JSON.stringify(state.geometries))
    },

    addGeometries (state, geometries) {
        state.geometries = geometries
    },

    /**
     * Delete the geometry with the specified id and update local storage
     * 
     * @param {*} state 
     * @param {*} id 
     */
    deleteGeometry (state, id) {
        state.geometries.splice(state.geometries.findIndex(feature => feature.properties.id == id), 1)

        Vue.localStorage.set('geometries', JSON.stringify(state.geometries))
    },

    /**
     * Toggles the selection of a geometry
     * Updates local storage
     */
    toggleSelected(state, {id, currState}) {
        let index = state.geometries.findIndex(geometry => {
            return geometry.properties.id == id && geometry.properties.selected == currState
        })

        if(index != -1) {
            state.geometries[index].properties.selected = !currState

            Vue.localStorage.set('geometries', JSON.stringify(state.geometries))
        }
    },

}

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}