const namespaced = true

import Vue from 'vue'
import uuid from 'uuid'

const state = {
    annotations: [],
    types: [
        {title: 'Good (plants)', 'id': 'good'},
        {title: 'Bad (soil, roads, etc.)', id: 'bad'}
    ],
    type: 'good',
}

const getters = {
    annotations: state => { return state.annotations },
    types: state => { return state.types },
    type: state => { return state.type },
}

const actions = {

    /**
     * Load the stored annotations from local storage
     */
    LOAD_ANNOTATIONS ({ commit }) {
        let annotations = Vue.localStorage.get('annotations')

        if(annotations) {
            commit('addAnnotations', JSON.parse(annotations))
        }
    },

}

// mutations
const mutations = {
    setCurrentType(state, type) {
        state.type = type
    },

    addAnnotations(state, annotations) {
        state.annotations = annotations
    },

    addAnnotation(state, payload) {

        state.annotations.push({
            "type": "Feature",
            "properties": {
                id: uuid.v4(),
                type: state.type,
                geometry_id: payload.geometry_id,
                color: state.type == 'good' ? 'yellow' : 'red',
            },
            "geometry": {
                "type": "Point",
                "coordinates": [ payload.coords.lng, payload.coords.lat ]
            }
        })

        Vue.localStorage.set('annotations', JSON.stringify(state.annotations))
    },

    /**
     * Delete the annotation with the specified id and update local storage
     * 
     * @param {*} state 
     * @param {*} id 
     */
    deleteAnnotation (state, id) {
        state.annotations.splice(state.annotations.findIndex(feature => feature.properties.id == id), 1)

        Vue.localStorage.set('annotations', JSON.stringify(state.annotations))
    },

    /**
     * When a geometry is deleted we also delete all annotations related to it
     * 
     * @param {*} state 
     * @param {*} id 
     */
    deleteRelatedAnnotations(state, id) {
        state.annotations = state.annotations.filter(annotation => annotation.properties.geometry_id != id )

        Vue.localStorage.set('annotations', JSON.stringify(state.annotations))
    }
}

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}