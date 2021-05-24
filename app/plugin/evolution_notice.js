define((require, exports, module) => {
  let TRH = require('app/core/const/index')
  return (store) => {
    store.subscribe((mutation, state) => {
      if (state.config.evolution_notice == true) {
        if (mutation.type === 'evolution/updateEvolution') {
          let serial_id = mutation.payload.updateData.back[0] && mutation.payload.updateData.back[0].serial_id
          if (!serial_id) return
          let finished_at = moment(parseValues(mutation.payload.updateData.back.finished_at))
          console.log(finished_at)
          let sword_id = _.get(state, ['swords', 'serial', serial_id, 'sword_id'], 0)
          let sword_name = _.get(state, ['swords', 'serial', serial_id, 'name'], '-') == '-' ? '-' : (TRH.SwordENGName[sword_id] ? TRH.SwordENGName[sword_id][sword_id] : _.get(state, ['swords', 'serial', serial_id, 'name'], '-'))
          if(state.evolution.back[0].isIntervalSet == false || state.evolution.back[0].isIntervalSet == null){
            let check = setInterval(function isEvolutionFinished(){
              state.evolution.back[0].isIntervalSet = true
              if(finished_at != null) {
                if(finished_at.isBefore(Date.now())){
                  store.dispatch('notice/addNotice', {
                    title: `${sword_name}'s Kiwame Training has ended`,
                    message: 'Return to Honmaru to see him return!',
                    context: `End Time： ${finished_at.format('HH:mm:ss')}`,
                    renotify: true,
                    disableAutoClose: true,
                    swordBaseId: sword_id,
                    icon: `static/sword/${sword_id}.png`
                  })
                  clearInterval(check)
                  state.evolution.back.isIntervalSet = false
                  console.log(finished_at.format())
                }
              } else {
                clearInterval(check)
                state.evolution.back.isIntervalSet = false
              }
            }, 1000)
          }
        }
      }
    })
  }
})