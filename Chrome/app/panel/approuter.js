define((require, exports, module) => {
  
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
      saveEnemyBaseStats (name) {
        store.commit('enemies/updateEnemies', {

        })
        if (name='Enemies') {
          Enemies="\"No\",\"Name\",\"Rarity\",\"Type\",\"Level\",\"Survival/HP\",\"Impact/ATK\",\"Leadership\",\"Mobility\",\"Impulse/FOR\",\"Scouting/RCN\",\"Camouflage/STH\",\"Killing Blow/HST\""
          _.forEach(_.get(store.state,['enemies','id']), function(_this){
            Enemies += "\n\"'"+_this.sword_id+"\",\"'"+_this.name+"\",\"'"+_this.rarity+"\",\"'"+_this.typeName+"\",\"'"+"\",\"'"+_this.level+"\",\"'"+_this.hp+"/"+_this.hp_max + "\",\"'" + _this.atk + "\",\"'" + _this.def +"\",\"'"+_this.mobile+"\",\"'"+_this.back+"\",\"'"+_this.scout+"\",\"'"+_this.hide+"\",\"'"+_this.loyalties+"\",\"'" + "\""
          })
          blob = new Blob([Enemies], {
            type: "text/plain;charset=utf-8"
          });
          saveAs(blob, "TRHEnemies" + (Date.now()) + ".csv");
        }
      },
      saveEnemyStatsLog () {

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