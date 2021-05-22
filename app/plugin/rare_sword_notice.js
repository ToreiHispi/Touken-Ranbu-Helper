define((require, exports, module) => {
  let TRHMasterData = require('app/core/master')
  return (store) => {
    store.subscribe((mutation, state) => {
      if (state.config.rare_sword_notice == true) {
        if (mutation.type === 'battle/updateBattle' || mutation.type === 'battle/updatePracticeBattle') {
          let { updateData } = mutation.payload
          let getSwordId = _.get(updateData, ['result', 'get_sword_id'])
          console.log('ID: ',getSwordId)
          let super_rare = [3, 5, 9, 13, 15, 17, 31, 33, 35, 37, 43, 51, 53, 57, 63, 67, 69, 71, 77, 103, 105, 120, 124, 136, 140, 144, 150]
          let rare = [7, 11, 25, 55, 59, 65, 73, 79, 91, 97, 107, 112, 116, 118, 122, 128, 130, 132, 134, 138] //List of rare swords
          let drops = super_rare.concat(rare)
          let non_drops = [21, 75, 142, 146, 148, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188, 190, 192, 194, 196, 198, 200] //These swords be event drops only (ie Nankai or Hizen)
          if (drops.indexOf(parseInt(getSwordId, 10)) == -1 && non_drops.indexOf(parseInt(getSwordId, 10)) == -1 && (parseInt(getSwordId, 10) > 0)) {
            console.log("not rare!")
            return
          }
          let swordName = _.get(TRHMasterData.getMasterData('Sword'), [getSwordId, 'name'], '无')
          console.log(swordName)
          let timeout = _.get(state, ['config', 'timeout'], 3)*1000
          if (timeout<3000){
            timeout = 3000
          }
          if (swordName){
            store.dispatch('notice/addNotice', {
              title: `发现稀有刀！`,
              message: `恭喜！`,
              context: `掉落：${swordName}！`,
              renotify: true,
              timeout: timeout,
              swordBaseId: getSwordId,
              icon: `static/sword/${getSwordId}.png`,
            })
          }
        }
      }
    })
  }
})
