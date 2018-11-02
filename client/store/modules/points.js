const namespaced = true

const state = {
    points: [],
}

const getters = {
    points: state => { return state.points },
}

const actions = {
    DETECT_PLANTS({ commit }, payload) {
        axios.post('/api/detect_areas', payload)
        .then(response => {
            commit('addPoints', response.data)
        })
    }
}

// mutations
const mutations = {
    addPoints(state, data) { 
        // Reset points to make sure other components catches the update
        state.points = []
        
        state.points = data 
    },

    removePoints(state) {
        state.points = []
    },
}

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}