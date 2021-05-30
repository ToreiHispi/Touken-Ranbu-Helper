define((require, exports, module) => {
  let TRHMasterData = require('app/core/master')
  const TRH = require('app/core/const/index')
  return () => {
    return {
		num_id: [],
		enemy_equip: {},
		enemy_sword: {},
		enemy_party: {}
	}
  }
})
