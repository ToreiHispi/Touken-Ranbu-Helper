define((require, exports, module) => {
  const store = require('app/data/index')
  const TRH = require('app/core/const/index')
  
  const Basic = Vue.component('basic',{
    template: '#basic',
    computed: Vuex.mapState(['resource','item','repair', 'forge' , 'duty', 'evolution','player'])
  })

  const Battle = Vue.component('battle',{
    template: '#battle',
    computed: Vuex.mapState(['player','config','sally','battle'])
  })

  const Changes = Vue.component('changes',{
    template: '#changes',
    computed: Vuex.mapState(['player','config','album','log']),
    methods:{
      removeLog () {
        localforage.setItem('BattleLog');
        localforage.setItem('ForgeLog');
        localforage.setItem('PracticeLog');
        localforage.setItem('DutyLog');
        localforage.setItem('EnemyLog');
        location.reload();
      },
      removeEnemyLog() {
        localforage.setItem('EnemyLog');
        location.reload();
      },
      saveEnemyBaseStats (name) {
        if (name='Enemies') {
          Enemies="\"No\",\"Name\",\"Rarity\",\"Type\",\"Survival/HP\",\"Impact/ATK\",\"Leadership\",\"Mobility\",\"Impulse/FOR\",\"Scouting/RCN\",\"Camouflage/STH\",\"Killing Blow/HST\""
          _.forEach(_.get(store.state,['enemies','id']), function(_this){
            Enemies += "\n\""+_this.swordId+"\",\""+_this.name+"\",\""+_this.rarity+"\",\""+(_this.type ? TRH.SwordENGType[_this.type] : _this.typeName)+"\",\""+_this.hp+ "\",\"" + _this.atk + "\",\"" + _this.def +"\",\""+_this.mobile+"\",\""+_this.back+"\",\""+_this.scout+"\",\""+_this.hide+"\",\""+_this.loyalties+"\",\"" + "\""
          })
          blob = new Blob([Enemies], {
            type: "text/plain;charset=utf-8"
          });
          saveAs(blob, "TRHEnemies" + (Date.now()) + ".csv");
        }
      },
      saveEnemyStatsLog (name) {
        if (name='Enemies') {
          Enemies="\"Serial\",\"No\",\"Name\",\"Rarity\",\"Type\",\"World/Event\",\"Map\",\"Layer#/Floor#\",\"Node\",\"Level\",\"Survival/HP\",\"Impact/ATK\",\"Leadership\",\"Mobility\",\"Impulse/FOR\",\"Scouting/RCN\",\"Camouflage/STH\",\"Killing Blow/HST\""
          _.forEach(_.get(store.state,['log','enemy']), function(_this){
            Enemies += "\n\""+_this.serial_id+"\",\""+_this.sword_id+"\",\""+_this.name+"\",\""+_this.rarity+"\",\""+(_this.type ? TRH.SwordENGType[_this.type] : _this.typeName)+"\",\""+_this.episode_id+"\",\""+_this.field_id+"\",\""+_this.layer_num+"\",\""+_this.square_id+"\",\""+_this.level+"\",\""+_this.hp+ "\",\"" + _this.atk + "\",\"" + _this.def +"\",\""+_this.mobile+"\",\""+_this.back+"\",\""+_this.scout+"\",\""+_this.hide+"\",\""+_this.loyalties+"\",\"" + "\""
          })
          blob = new Blob([Enemies], {
            type: "text/plain;charset=utf-8"
          });
          saveAs(blob, "TRHEnemiesStatsLog" + (Date.now()) + ".csv");
        }
      }
    }
  })
  return new VueRouter({
    routes: [
      { path: '/', redirect: '/basic'},
      { path: '/basic', component: Basic},
      { path: '/battle', component: Battle},
      { path: '/changes',  component: Changes}
    ]
  })
})