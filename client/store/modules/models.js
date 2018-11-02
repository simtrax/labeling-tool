
const namespaced = true

const state = {
    models: [],
}

const getters = {
    models: state => { return state.models },
}

const actions = {
    LOAD_MODELS:({ commit }) => {
        axios.get('/api/model')
        .then(response => {
            commit('addModels', response.data)
        })
    },

    /**
     * Train a new model
     */
    TRAIN_MODEL ({ commit }, payload) {
        let trainingData = payload.geometries.map(geometry => {
            return {
                geometry: geometry,
                annotations: payload.annotations.filter(annotation => {
                    return annotation.properties.geometry_id == geometry.properties.id
                })
            }
        })

        axios.post('/api/train', trainingData)
        .then(response => {
            commit('addModel', response.data)
        })
    },
}

// mutations
const mutations = {
    addModels(state, data) { state.models = data },

    addModel(state, data) { state.models.push(data)}
}

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}