define((require, exports, module) => {
  const appRouter = require('app/panel/approuter')
  const store = require('app/data/index')
  const TRHMasterData = require('app/core/master')
  return class TRHRequestRouter {
    static route (action, content) {
      // Log
      console.log(action)
      //appRouter.push({path:'/battle'})
      console.log(content)
      // Route
      if (_.isFunction(this[action])) {
        this[action](content)
      }
      // Common
      //if(action!='party/list')
      this.common(content)
    }

    static updatePartyBattleStatus (partyNo, inBattle) {

    }

    static common (content) {
      if (content.sword) {
        if(!content.sword.serial_id){
        _.each(content.sword, (v, k) => {
          if(v.serial_id){
          v.inBattle = false
          if (v.battleStatus) {
            v.status = v.battleStatus
            delete v.battleStatus
          }
          store.commit('swords/updateSword', {
            serialId: k,
            updateData: v
          })}
        })}
      }
      if (content.resource) {
        store.commit('resource/updateResource', {
          updateData: content.resource
        })
      }
      if (content.currency) {
        store.commit('resource/updateResource', {
          updateData: content.currency
        })
      } else if (content.money) {
        store.commit('resource/updateResource', {
          updateData: _.pick(content, ['money'])
        })
      }
      if (content.party) {
        _.each(content.party, (v, k) => {
          store.commit('party/updateParty', {
            partyNo: k,
            updateData: v
          })
        })
      }
      if (content.player) {
        store.commit('player/updatePlayer', {
          updateData: content.player
        })
      }
      if (content.repair) {
        _.each(content.repair, (v, k) => {
          store.commit('repair/updateRepair', {
            slotNo: k,
            updateData: v
          })
        })
      }
      if (content.forge) {
        _.each(content.forge, (v, k) => {
          store.commit('forge/updateForge', {
            slotNo: k,
            updateData: v
          })
        })
      }
      if (content.duty) {
        store.commit('duty/updateDuty', {
          updateData: content.duty
        })
      }
      if (content.evolution) {
        if (Object.keys(content.evolution).length > 0) {
          let EvoCont = content.evolution.back
          store.commit('evolution/updateEvolution', {
            updateData: {back: {0: {serial_id: EvoCont.serial_id, finished_at: EvoCont.finished_at}}}
          })
        }
      }
      if (content.equip) {
        _.each(content.equip, (v, k) => {
          if (!v.serial_id) return
          store.commit('equip/updateEquip', {
            serialId: v.serial_id,
            updateData: v
          })
        })
      }
      if (content.item_list) {
        _.each(content.item_list, (v, k) => {
          store.commit('item/updateItem', {
            consumableId: v.consumable_id,
            updateData: v
          })
        })
      } else if(content.item) {
        _.each(content.item, (v, k) => {
          store.commit('item/updateItem', {
            consumableId: v.consumable_id,
            updateData: v
          })
        })
      }
    }
    static ['party/list'](content){
      store.commit('swords/clear')
      store.commit('equip/clear')
      appRouter.push({path:'/basic'})
      store.commit('config/updateConfig',{
        activityShow: 'default'
      })
      //store.commit('item/clear')
    }

    static ['shop/list'](content){
      store.commit('item/clear')
    }

    static ['item/add_exp'](content){
      store.commit('swords/updateSword',{
        serialId: content.sword.serial_id,
        updateData: content.sword
      })
    }

    static ['forge'](content){
      store.commit('forge/clear')
      appRouter.push({path:'/basic'})
      store.commit('config/updateConfig',{
        activityShow: 'default'
      })
    }

    static ['repair'](content){
      store.commit('repair/clear')
      appRouter.push({path:'/basic'})
      store.commit('config/updateConfig',{
        activityShow: 'default'
      })
    }
    static ['repair/repair'](content){
      store.commit('swords/updateSword',{
        serialId: content.repair[content.postData.slot_no].sword_serial_id,
        updateData: {status: 1}
      })
    }

    static ['practice/offer'](content){
      _.each(content.enemy_equip, (v,k) => {
        store.commit('practice_enemy/updatePracticeEquip', { 
          serialId: k, 
          updateData: v
        })
      })
      _.each(content.enemy_sword, (v,k) => {
        store.commit('practice_enemy/updatePracticeSword', {
          serialId: k, 
          updateData: v
        })
        store.commit('practice_enemy/updatePracticeSword', {
          serialId: k, 
          updateData: {isEnemy: true}
        })
      })
      _.each(content.enemy_party, (v,k) => {
        store.commit('practice_enemy/updatePracticeParty', {
          partyNo: k, 
          updateData: v
        })
      })
    }

    static ['battle/practicescout'](content){
      store.commit('inBattle')
      store.commit('fatigueToV')
      store.commit('sally/updateSally', {
        updateData: content.postData
      })
      let party = _.get(store, ['state', 'party', 'parties', content.postData.party_no], {})
      _.each(party.slot, (v, k)=>{
        if(v.serial_id)
        store.commit('swords/updateSword', {
          serialId: v.serial_id, 
          updateData: {inBattle: true}
        })
      })
      _.each(store.state.equip.serial, (v, k) => {
        store.commit('equip/updateEquip', {
          serialId: v.serial_id, 
          updateData: {soldier: v.hp_max}
        })
      })
    }

    static ['battle/practicebattle'](content){
      store.commit('inBattle')
      store.commit('battle/updateBattleResult', {
        updateData: content.result
      })
      store.commit('battle/updateBattlePlayer', {
        updateData: content.player
      })
      store.commit('player/updatePlayer', {
        updateData: content.player
      })
      store.commit('battle/updatePracticeBattle', {
        updateData: content
      })
      _.each(_.values(_.get(content, ['result', 'player', 'party', 'slot'])), (v, k) => {
        v.inBattle = true
        if (v.status) {
          v.battleStatus = v.status
          delete v.status
        }
        v.battleFatigue = _.get(store, ['state', 'swords', 'serial', v.serial_id, 'vfatigue'])
        let rank = _.get(content, ['result', 'rank'])
        let mvp = _.get(content, ['result', 'mvp'])
        let leader = _.get(content, ['result', 'player', 'party', 'slot', '1', 'serial_id'])
        if(rank < 6){
          console.log("Rank Win")
          if(v.serial_id == leader) {
            console.log("leader calculate")
            v.battleFatigue += 3
          }
          if(v.serial_id == mvp) {
            console.log("mvp calculate")
            v.battleFatigue += 10
          }
        }
        if(v.battleFatigue >= 100) {
          console.log(">= 100")
          v.battleFatigue = 100
        }
        store.commit('swords/updateSword', {
          serialId: v.serial_id,
          updateData: v
        })
      })
      _.each(_.values(_.get(content, ['battle'])), (v, k) =>{
        if(v.is_skill == true){
          v.battleFatigue = _.get(store, ['state', 'swords', 'serial', v.atk, 'battleFatigue'])
          v.battleFatigue -= 20
          store.commit('swords/updateSword', {
            serialId: v.atk,
            updateData: {battleFatigue : v.battleFatigue}
          })
        }
      })
      _.each(_.values(_.get(content, ['player', 'party'])), (v, k) => {
        let equipUpdate = [{
          serial_id: v.equip_serial_id1,
          soldier: v.soldier1
        }, {
          serial_id: v.equip_serial_id2,
          soldier: v.soldier2
        }, {
          serial_id: v.equip_serial_id3,
          soldier: v.soldier3
        }]
        _.each(_.filter(equipUpdate, o => !isNaN(o.serial_id)), (v) => {
          store.commit('equip/updateEquip', {
            serialId: v.serial_id,
            updateData: v
          })
        })
      })
    }

    static ['battle/alloutbattle'](content){
      let new_square_id = _.get(store, ['state', 'sally', 'square_id']) + 1
        store.commit('sally/updateSally', {
        updateData: {
          square_id: new_square_id,
          party_no: content.postData.party_no
        }
      })
      this['battle/battle'] (content)
      if(content.allout.is_finish == true){
        store.commit('player/updatePlayer', {
          updateData: {
            exp: content.allout.settle_up.player.exp,
            level: content.allout.settle_up.player.level
          }
        })
        _.each(content.allout.settle_up.player.party, (v, k)=>{
          _.each(v.slot, (v1, k1)=>{
            if(v1.serial_id){
              store.commit('swords/updateSword',{
                serialId: v1.serial_id,
                updateData: {
                  exp: v1.exp,
                  level: v1.level
                }
              })
            }
          })
        })
      }
    }

    static ['battle/battle'] (content) {
      console.log("Battle Content: ",content)

      store.commit('inBattle')
      appRouter.push({path:'/battle'})
      store.commit('battle/updateBattleResult', {
        updateData: content.result
      })
      store.commit('battle/updateBattlePlayer', {
        updateData: content.player
      })
      store.commit('player/updatePlayer', {
        updateData: content.player
      })
      store.commit('battle/updateBattleEnemy', {
        updateData: content.enemy
      })
      let sally = _.get(store, ['state', 'sally'], {})
      _.each(_.values(_.get(content, ['enemy', 'party'])), (v, k) => {
        store.commit('log/addEnemyLog', {
          logId: `ID:${v.serial_id}#${sally.episode_id}-${sally.field_id}-${sally.square_id}@${moment(Date.now()).unix()}`,
          serial_id: v.serial_id,
          sword_id: v.sword_id,
          fatigue: v.fatigue,
          episode_id: sally.episode_id,
          field_id: sally.field_id,
          layer_num: sally.layer_num,
          square_id: sally.square_id,
          hp: v.hp,
          hp_max: v.hp_max,
          level: v.level,
          rarity: v.rarity,
          type: v.type,
          type_real: v.type_real,
          name: v.name,
          atk: v.atk,
          def: v.def,
          mobile: v.mobile,
          back: v.back,
          loyalties: v.loyalties,
          scout: v.scout,
          hide: v.hide
        })
      })
      store.commit('battle/updateBattleEnemy', {
        updateData: content.result.enemy.party.slot
      })
      store.commit('battle/updateBattle', {
        updateData: content
      })
      _.each(_.values(_.get(content, ['result', 'player', 'party', 'slot'])), (v, k) => {
        v.inBattle = true
        if (v.status) {
          v.battleStatus = v.status
          delete v.status
        }
        v.battleFatigue = _.get(store, ['state', 'swords', 'serial', v.serial_id, 'battleFatigue'])
        let rank = _.get(content, ['result', 'rank'])
        let mvp = _.get(content, ['result', 'mvp'])
        let leader = _.get(content, ['result', 'player', 'party', 'slot', '1', 'serial_id'])
        if(content.tsukimi){
          if(JSON.stringify(content.tsukimi)!="{}"){
            v.battleFatigue += -6
          }
        }
        if(rank == 1) {
          console.log("Rank ONE_ON_ONE")
          if(v.serial_id == leader) {
            console.log("leader calculate")
            v.battleFatigue += 3
          }
          v.battleFatigue += 1
        }
        else if(rank == 2) {
          console.log("Rank S")
          if(v.serial_id == leader) {
            console.log("leader calculate")
            v.battleFatigue += 3
          }
          v.battleFatigue += 1
        }
        else if(rank == 3) {
          console.log("Rank A")
          if(v.serial_id == leader) {
            console.log("leader calculate")
            v.battleFatigue += 3
          }
          v.battleFatigue += 0
        }
        else if(rank == 4) {
          console.log("Rank B")
          if(v.serial_id == leader) {
            console.log("leader calculate")
            v.battleFatigue += 3
          }
          v.battleFatigue -= 1
        }
        else if(rank == 5) {
          console.log("Rank C")
          if(v.serial_id == leader) {
            console.log("leader calculate")
            v.battleFatigue += 3
          }
          v.battleFatigue -= 2
        }
        else if(rank == 6) {
          console.log("Rank D")
          v.battleFatigue -= 3
        }
        if(v.serial_id == mvp) {
          console.log("mvp calculate")
          v.battleFatigue += 10
        }
        if(v.battleFatigue >= 100) {
          console.log(">= 100")
          v.battleFatigue = 100
        }
        if(v.battleFatigue <= 0) {
          console.log("<= 0")
          v.battleFatigue = 0
        }
        store.commit('swords/updateSword', {
          serialId: v.serial_id,
          updateData: v
        })
      })
      _.each(_.values(_.get(content, ['battle'])), (v, k) =>{
        if(v.is_skill == true){
          v.battleFatigue = _.get(store, ['state', 'swords', 'serial', v.atk, 'battleFatigue'])
          v.battleFatigue -= 20
          store.commit('swords/updateSword', {
            serialId: v.atk,
            updateData: {battleFatigue : v.battleFatigue}
          })
        }
      })
      _.each(_.values(_.get(content, ['player', 'party'])), (v, k) => {
        let equipUpdate = [{
          serial_id: v.equip_serial_id1,
          soldier: v.soldier1
        }, {
          serial_id: v.equip_serial_id2,
          soldier: v.soldier2
        }, {
          serial_id: v.equip_serial_id3,
          soldier: v.soldier3
        }]
        _.each(_.filter(equipUpdate, o => !isNaN(o.serial_id)), (v) => {
          store.commit('equip/updateEquip', {
            serialId: v.serial_id,
            updateData: v
          })
        })
      })
    }

    static ['home'] (content) {
      store.commit('notInBattle')
      appRouter.push({path:'/basic'})
      store.commit('config/updateConfig',{
        activityShow: 'default'
      })
      Object.values(TRHMasterData.Sword).forEach(v => {
        if (v.swordId>=100000) {
          store.commit('enemies/updateEnemy',{
            swordId: v.swordId,
            updateData: v
          })
        }
      })
      //console.log(_.get(store, ['state'], {}))
    }

    static ['home/leave'] (content) {
      let EvoCont = content.evolution.back
      store.commit('evolution/updateEvolution', {
        updateData: {back: {0: {serial_id: EvoCont.serial_id, finished_at: EvoCont.finished_at}}}
      })
    }
    
    static ['home/back'] (content) {
      //Called when sword returns from Kiwame
    }
    
    static ['sally/sally'] (content) {
      store.commit('inBattle')
      appRouter.push({path:'/battle'})
      store.commit('fatigueToVV')
      store.commit('sally/updateSally', {
        updateData: content.postData
      })
      //console.log(content.postData)
      store.commit('sally/updateSally', {
        updateData: content
      })
      let party = _.get(store, ['state', 'party', 'parties', content.postData.party_no], {})
      _.each(party.slot, (v, k)=>{
        if(v.serial_id)
        store.commit('swords/updateSword', {
          serialId: v.serial_id, 
          updateData: {inBattle: true}
        })
      })
      _.each(store.state.equip.serial, (v, k) => {
        store.commit('equip/updateEquip', {
          serialId: v.serial_id, 
          updateData: {soldier: v.hp_max}
        })
      })
      store.commit('battle/clearBattleScout')
      store.commit('battle/clearBattleEnemy')
      if(content.postData.party_no){
        store.commit('config/updateConfig',{
          partySelected: content.postData.party_no
        })
      }
    }
    static ['sally/eventsally'] (content) {
      let evcont = content.postData
      console.log(content,evcont);
      let EID = 0
      if (evcont.event_id!= null) {
        EID = parseInt('-' + evcont.event_id)
      }

      store.commit('event/updateEventID', {
        event_id: EID
      })

      let event_info = {
        episodeId: EID ? EID : null,
        name: _.get(TRHMasterData.getMasterData('Event'), [EID, 'name'], null),
        type: _.get(TRHMasterData.getMasterData('Event'), [EID, 'type'], null)
      }
      store.commit('event/updateEventType', {
        updateData: event_info
      })

      let eventContent = {
        episode_id: null,
        field_id: null,
        layer_num: null
      }
      let eventType = _.get(TRHMasterData.getMasterData('Event'), [content.postData.event_id*(-1), 'type'], 0)
      eventContent.episode_id = content.postData.event_id*(-1)
      eventContent.field_id = content.postData.event_field_id
      eventContent.layer_num = 1
      if(content.postData.event_layer_id){
        eventContent.layer_num = content.postData.event_layer_id
      }
      if(eventType==6){
        eventContent.layer_num = content.select_event_layer_num
      }
      store.commit('sally/updateSally', {
        updateData: eventContent
      })
      this['sally/sally'] (content)
      if(eventType==4){
          store.commit('sally/updateSally', {
          updateData: {square_id: "0"}
        })
      }
    }
    static ['sally/forward'] (content) {
      store.commit('sally/updateSally', {
        updateData: _.pick(content, ['square_id'])
      })
      store.commit('battle/clearBattleScout')
      store.commit('battle/updateBattleScout', {
        updateData: content.scout
      })
      store.commit('battle/clearBattleEnemy')
    }
    static ['sally/eventforward'] (content) {
      store.commit('sally/updateSally', {
        updateData: {square_id: content.square_id}
	    })
	  
      Object.keys(content).forEach(k => {
        if (k=="gimmick") {
          if(content.gimmick.draw){
            //Poison Arrows
            if(content.gimmick.draw==19 || (content.gimmick.draw>=53 && content.gimmick.draw<=55)){
              _.each(content.gimmick.result.effect, (v, k)=>{
                store.commit('swords/updateSword',{
                  serialId: v.serial_id,
                  updateData: {hp: v.value[1] || 1}
                })
              })
            }
            //Bombs
            else if(content.gimmick.draw==20 || (content.gimmick.draw>=60 && content.gimmick.draw<=62)){
              _.each(content.gimmick.result.serial_ids, (v, k)=>{
                store.commit('equip/updateEquip',{
                  serialId: v,
                  updateData: {soldier: '0'}
                })
              })
            }
          }
        }
      })
      //runs sally/forward for Scouting and Node selection
      this['sally/forward'] (content)
    }

    static ['forge/start'] (content) {
      store.commit('forge/updateForge', {
        slotNo: content.slot_no,
        updateData: _.extend(content, content.postData, {status: 2})

      })
    }
    
    static ['forge/complete'] (content) {
      let forgeData = _.get(store, ['state', 'forge', 'slot', content.postData.slot_no], {})
      store.commit('forge/updateForge', {
        slotNo: content.postData.slot_no,
        updateData: {
          slot_no: content.postData.slot_no,
          sword_id: content.sword_id,
          finished_at: forgeData.finished_at,
          status: 1
        }
      })
    }
    static ['forge/fast'] (content) {
      let forgeData = _.get(store, ['state', 'forge', 'slot', content.postData.slot_no], {})
      store.commit('forge/updateForge', {
        slotNo: content.postData.slot_no,
        updateData: {
          slot_no: content.postData.slot_no,
          sword_id: content.sword_id,
          finished_at: forgeData.finished_at,
          status: 1
        }
      })
      store.commit('item/addItem', {
        consumableId: 8, 
        updateData: {
          consumable_id: 8,
          num: -1
        }
      })
    }

    static ['repair/fast'] (content) {
      let repairData = _.get(store, ['state', 'repair', 'slot', content.postData.slot_no], {})
      store.commit('repair/updateRepair', {
        slotNo: content.postData.slot_no,
        updateData: {
          slot_no: content.postData.slot_no,
          finished_at: repairData.finished_at,
          status: 1
        }
      })
      store.commit('item/addItem', {
        consumableId: 8, 
        updateData: {
          consumable_id: 8,
          num: -1
        }
      })
    }

    static ['repair/complete'] (content) {
      let repairData = _.get(store, ['state', 'repair', 'slot', content.postData.slot_no], {})
      store.commit('repair/updateRepair', {
        slotNo: content.postData.slot_no,
        updateData: {
          slot_no: content.postData.slot_no,
          finished_at: repairData.finished_at,
          status: 1
        }
      })
    }

    static ['login/start'] (content) {
      //console.log(_.pick(content, ['name', 'level', 'exp', 'forge_slot', 'repair_slot', 'created_at']))
      store.commit('player/updatePlayer', {
        updateData: _.pick(content, ['name', 'level', 'exp', 'forge_slot', 'repair_slot', 'created_at'])
      })

      let EID = 0
      if (content.event_id) {
        EID = content.event_id*(-1)
      }
      store.commit('event/updateEventID', {
        event_id: EID
      })
      
      let event_info = {
      episodeId: EID ? EID : 0,
      name: _.get(TRHMasterData.getMasterData('Event'), [EID, 'name'], ' '),
      type: _.get(TRHMasterData.getMasterData('Event'), [EID, 'type'], 0)
      }
      store.commit('event/updateEventType', {
        updateData: event_info
      })
      

      let EvoCont = content.evolution.back
      store.commit('evolution/updateEvolution', {
        updateData: {back: {0: {serial_id: EvoCont.serial_id, finished_at: EvoCont.finished_at}}}
      })
    }

    static ['equip/setequip'] (content) {
      store.commit('swords/updateSword', {
        serialId: content.sword.serial_id,
        updateData: content.sword
      })
    }

    static ['equip/removeequip'] (content) {
      store.commit('swords/updateSword', {
        serialId: content.sword.serial_id,
        updateData: content.sword
      })
    }

    static ['equip/removeall'] (content) {
      store.commit('swords/updateSword', {
        serialId: content.sword.serial_id,
        updateData: content.sword
      })
    }

    static ['equip/setitem'] (content) {
      store.commit('swords/updateSword', {
        serialId: content.sword.serial_id,
        updateData: content.sword
      })
    }

    static ['equip/removeitem'] (content) {
      store.commit('swords/updateSword', {
        serialId: content.sword.serial_id,
        updateData: content.sword
      })
    }

    static ['party/setsword'] (content) {
      _.each(_.pick(content, [1, 2, 3, 4]), (v, k) => {
        store.commit('party/updateParty', {
          partyNo: k,
          updateData: v
        })
      })
    }

    static ['party/removesword'] (content) {
      _.each(_.pick(content, [1, 2, 3, 4]), (v, k) => {
        store.commit('party/updateParty', {
          partyNo: k,
          updateData: v
        })
      })
    }

    static ['user/profile'] (content) {
      store.commit('player/updatePlayer', {
          updateData: content
        })
    }

    static ['album/list'] (content) {
      _.each(content.sword, (v, k)=>{
        store.commit('album/updateAlbum', {
          swordId: v.sword_id,
          updateData: v
        })
      })
      store.commit('config/updateConfig',{
        activityShow: 'album'
      })
      appRouter.push({path:'/changes'})
    }

    static ['conquest/complete'](content) {
      store.commit('player/updatePlayer', {
        updateData: content.result
      })
    }

    static ['conquest'](content) {
      let party_no = 1
      if(store.state.party.parties[2].status==1){
        party_no = 2
      }else if(store.state.party.parties[3].status==1){
        party_no = 3
      }else if(store.state.party.parties[4].status==1){
        party_no = 4
      }
      if(store.state.config.partySelected==1 || store.state.party.parties[store.state.config.partySelected].status!=1){
        store.commit('config/updateConfig', {
          partySelected: party_no
        })
      }
    }

    static ['conquest/start'](content) {
      this['conquest'] (content)
    }

    static ['party/partyreplacement'](content){
      _.each(_.pick(content, [1, 2, 3, 4]), (v, k) => {
        store.commit('party/updateParty', {
          partyNo: k,
          updateData: v
        })
      })
    }

    static ['produce/start'](content){
      if(content.success == 1)
      store.commit('equip/updateEquip', {
        serialId: content.serial_id,
        updateData: content
      })
    }

    static ['produce'](content){
      store.commit('equip/clear')
    }

    static ['sally/eventresume'](content){
      let eventContent = {
        episode_id: null,
        field_id: null,
        layer_num: null
      }
      eventContent.episode_id = content.event_id*(-1)
      eventContent.field_id = content.field_id
      eventContent.layer_num = content.layer_num
      store.commit('sally/updateSally', {
        updateData: eventContent
      })
      store.commit('inBattle')
      appRouter.push({path:'/battle'})
      store.commit('sally/updateSally', {
        updateData: content.postData
      })
      //console.log(content.postData)
      store.commit('sally/updateSally', {
        updateData: content
      })
      let party = _.get(store, ['state', 'party', 'parties', content.postData.party_no], {})
      _.each(party.slot, (v, k)=>{
        if(v.serial_id)
        store.commit('swords/updateSword', {
          serialId: v.serial_id, 
          updateData: {inBattle: true}
        })
      })
      let eventId = _.get(store, ['state', 'sally', 'episode_id'])
      let eventType = _.get(TRHMasterData.getMasterData('Event'), [eventId, 'type'], 0)
      let new_square_id = _.get(store, ['state', 'sally', 'square_id']) - 1
      if(eventType == 4){
        store.commit('sally/updateSally', {
          updateData: {square_id: new_square_id}
        })
      }
    }

    static ['mission/reward'] (content) {
      _.each(content.item, v => {
        if(v.item_type == 1){
          let updateItem = {
            consumable_id: null,
            num: null
          }
          updateItem.consumable_id = v.item_id
          updateItem.num = v.item_num
          store.commit('item/addItem', {
            consumableId: updateItem.consumable_id, 
            updateData: updateItem
          })
        }
        if(v.item_type == 4){
          let updateMoney = {
            money: null
          }
          updateMoney.money = v.item_num
          store.commit('resource/addMoney', {
            updateData: updateMoney
          })
        }
      })
    }

    static ['item/use'] (content) {
      let item_num = _.get(store.state, ['item', 'consumable', content.postData.consumable_id, 'num'], 0)
      let item_value = _.get(TRHMasterData.getMasterData('Consumable'), [content.postData.consumable_id, 'value'], 0)
      let updateMoney = {
        money: null
      }
      updateMoney.money = item_num * item_value
      store.commit('resource/addMoney', {
        updateData: updateMoney
      })
    }

    static ['equip/destroy'] (content) {
      let serial_ids = _(content.postData.serial_ids)
        .split('%2C')
        .value()
      _.each(serial_ids, v => {
        store.commit('equip/deleteEquip', {
          serialId: v
        })
      })
    }

    static ['sword/dismantle'] (content) {
      let serial_ids = _(content.postData.serial_id)
        .split('%2C')
        .value()
      _.each(serial_ids, v => {
        store.commit('swords/deleteSword', {
          serialId: v
        })
      })
    }

    static ['composition/compose'] (content) {
      let serial_ids = _(content.postData.material_id)
        .split('%2C')
        .value()
      _.each(serial_ids, v => {
        store.commit('swords/deleteSword', {
          serialId: v
        })
      })
      store.commit('swords/updateSword', {
        serialId: content.sword.serial_id, 
        updateData: content.sword
      })
    }

    static ['composition/union'] (content) {
      let serial_ids = _(content.postData.material_serial_id)
        .split('%2C')
        .value()
      _.each(serial_ids, v => {
        store.commit('swords/deleteSword', {
          serialId: v
        })
      })
      store.commit('swords/updateSword', {
        serialId: content.sword.serial_id, 
        updateData: content.sword
      })
    }
    

    static ['duty/complete'] (content) {
      let finished_at = _.get(store.state, ['duty', 'finished_at'], 0)
      store.commit('duty/updateDuty', {
        updateData: _.extend(content, {finished_at: finished_at})
      })
    }

    static ['duty/start'] (content) {
      let update_ids = {
        horse_id1: '',
        horse_id2: '',
        field_id1: '',
        field_id2: '',
        bout_id1: '',
        bout_id2: ''
      }
      _.each(content.postData, (v,k)=>{
        if(k=='horse_id' || k=='field_id' || k=='bout_id'){
          kk1=k.toString()+'1'
          kk2=k.toString()+'2'
          if(v.match('%2c')!=null){
            let serial_ids = v.split('%2c')
            update_ids[kk1]=serial_ids[0]
            update_ids[kk1]=serial_ids[1]
          }
        }
      })
      store.commit('duty/updateDuty', {
        updateData: _.extend(content, this.update_ids)
      })
    }
  }
})
