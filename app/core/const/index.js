define((require, exports, module) => {
  return {
    SwordStyle: require('./sword/style'),
    SwordType: require('./sword/type'),
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
        TIERD: 1,
        VERY_TIERD: 2
      },
      VALUE: {
        VERY_TIERD: 9,
        TIERD: 19,
        NOMAL: 49,
        MAX: 100
      }
    }
  }
})
