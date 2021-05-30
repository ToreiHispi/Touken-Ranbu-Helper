require.config({
  baseUrl: '/'
})

Vue.use(Vuex)
localforage.setDriver(localforage.LOCALSTORAGE)

require(['app/panel/sword/init'])