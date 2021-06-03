define((require, exports, module) => {
    let TRHMasterData = require('app/core/master')
    return () => {
      return {
        logId: null,
        serial_id: null,
        sword_id: null,
        fatigue: null,
        episode_id: null,
        field_id: null,
        square_id: null,
        layer_num: null,
        hp: null,
        hp_max: null,
        level: null,
        rarity: null,
        type: null,
        type_real: null,
        get name(){
            if (this.serial_id>0) {
                return _.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'name'], '-')
            }
        },
        //Impact/Attack
        get atk(){
            if (this.serial_id>0) {
                return _.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'atk'], 0)
            }
        },
        //Leadership
        get def(){
            if (this.serial_id>0) {
                return _.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'def'], 0)
            }
        },
        //Mobility
        get mobile(){
            if (this.serial_id>0) {
                return _.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'mobile'], 0)
            }
        },
        //Impulse/Force
        get back(){
            if (this.serial_id>0) {
                return _.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'back'], 0)
            }
        },
        //Killing Blow/Shinken Hissatsu
        get loyalties(){
            if (this.serial_id>0) {
                return _.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'loyalties'], 0)
            }
        },
        //Scouting/Recon
        get scout(){
            if (this.serial_id>0) {
                return _.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'scout'], 0)
            }
        },
        //Camoflague/Stealth
        get hide() {
            if (this.serial_id>0) {
                return _.get(TRHMasterData.getMasterData('Sword'), [this.sword_id, 'hide'], 0)
            }
        }
      }
    }
  })
  