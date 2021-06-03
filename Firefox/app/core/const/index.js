define((require, exports, module) => {
  return {
    SwordStyle: require('./sword/style'),
    SwordType: require('./sword/type'),
    SwordENGType: require('./sword/type_eng'),
    SwordRange: require('./sword/range'),
    SwordInjury: require('./sword/injury'),
    SwordENGName: require('./sword/name'),
    EquipENGName: require('./equip/name'),
    EquipENGType: require('./equip/type'),
    ItemENGName: require('./item/name'),
    RareSword: require('./sword/rare'),
    FATIGUE: {
      STATUS: {
        NONE: 0,
        TIRED: 1,
        VERY_TIRED: 2
      },
      VALUE: {
        VERY_TIRED: 9,
        TIRED: 19,
        NORMAL: 49,
        MAX: 100
      }
    }
  }
})
