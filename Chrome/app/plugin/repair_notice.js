define((require, exports, module) => {
  let TRH = require('app/core/const/index')
  return (store) => {
    store.subscribe((mutation, state) => {
      if (mutation.type === 'repair/updateRepair'){
        let slotNo = mutation.payload.updateData.slot_no
        let slot = _.get(state, ['repair', 'slot', mutation.payload.updateData.slot_no])
        let swordSerialId = mutation.payload.updateData.sword_serial_id
        let sword = _.get(state, ['swords', 'serial', swordSerialId])
        let swordName = (/^[A-Za-z]+/.test(sword.name) ? sword.name.replace('·🥝','') : (TRH.SwordENGName[sword.sword_id] ? TRH.SwordENGName[sword.sword_id][sword.sword_id] : sword.name))
        
        if(slot.isIntervalSet  == false || slot.isIntervalSet == null){
          let check = setInterval(function isRepairFinished(){
            if(state.repair.slot=={}){
              clearInterval(check)
            }else{
              slot.isIntervalSet = true
              slot.left_time = moment.utc(slot.finished_at).diff(moment.utc(Date.now()), 'hours').toString().padStart(2,'0')+moment.utc(slot.finished_at-Date.now()).format(':mm:ss')
              if(moment(parseValues(slot.finished_at)).isBefore(Date.now())){
                slot.left_time = '00:00:00'
                if(slot.isNoticed == false || slot.isNoticed == null){
                  if(state.config.repair_notice == true){
                    store.dispatch('notice/addNotice', {
                      title: `Ongoing Repair：${swordName} `,
                      message: moment(parseValues(mutation.payload.updateData.finished_at)).isBefore() ? 'Finished！' : 'Please wait patiently or use a Help Token.',
                      context: `End Time: ${moment(parseValues(mutation.payload.updateData.finished_at)).format('MM/DD HH:mm:ss')}`,
                      tag: sword.sword_id,
                      renotify: true,
                      swordBaseId: sword.sword_id,
                      icon: `static/sword/${sword.sword_id}.png`
                    })
                  }
                  slot.isNoticed = true
                }
                clearInterval(check)
                slot.isIntervalSet = false
              }
            }
            if(slot.status != 2){
              slot.isNoticed = false
              slot.isIntervalSet = false
              clearInterval(check)
            }
          },1000)
        }
      }
    })
  }
})
