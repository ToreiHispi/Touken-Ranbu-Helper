define((require, exports, module) => {
  const defaultEventModel = require('../model/event')
  return {
    namespaced: true,
    state () {
      return {
		UIDs: {},
		event_info: defaultEventModel(),
		event_id: null
      }
    },
    mutations: {
	  updateEventID (state, payload) {
		let {event_id} = payload
		if (!state.event_id) {
			Vue.set(state, 'event_id', event_id)
		}
	  },
	  updateEventType (state, payload) {
		let {updateData} = payload
		mergeModel(state.event_info, updateData)
	  }
	}
  }
})