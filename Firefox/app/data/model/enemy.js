define((require, exports, module) => {
    let TRHMasterData = require('app/core/master')
    const TRH = require('app/core/const/index')
    
    return () => {
      return {
        swordId: null,
        rarity: null,
        hp: null,
        atk: null,
        def: null,
        mobile: null,
        back: null,
        scout: null,
        hide: null,
        loyalties: null,
        name: null,
        type: null,
        get baseId () {
          return _.get(TRHMasterData.getMasterData('Sword'), [this.swordId, 'baseId'], 0)
        },
        get typeName () {
          let type = _.get(TRHMasterData.getMasterData('Sword'), [this.swordId, 'type'], 0)
          return TRH.SwordType[type]
        }
      }
    }
  })
  