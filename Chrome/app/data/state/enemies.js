define((require, exports, module) => {
    const defaultEnemyModel = require('../model/enemy')
    return {
      namespaced: true,
      state () {
        return {
          id: {}
        }
      },
      mutations: {
        updateEnemy (state, payload) {
          let { swordId, updateData } = payload
          if (!state.id[swordId]) {
            Vue.set(state.id, swordId, defaultEnemyModel())
          }
          mergeModel(state.id[swordId], updateData)
        }
      }
    }
  })
  