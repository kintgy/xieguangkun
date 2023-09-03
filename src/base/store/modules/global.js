export default {
  namespace: 'true',
  state() {
    return {
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      token: JSON.parse(localStorage.getItem('token') || '{}'),
      loading: false,
    }
  },
  mutations: {
    async showLoading(state, loading) {
      state.loading = loading
    },
    async EDIT_TOKEN(state, token) {
      state.token = token
    },
    async EDIT_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    EDIT_USERINFO({commit}, userinfo) {
      return new Promise((res) => {
        let token = !userinfo || !userinfo.token ? undefined : {
          access_token: userinfo.token,
          access_expire: Math.ceil(new Date().getTime() / 1000) + 3600 * 2
        }
        if (undefined === userinfo || undefined === token) {
          commit('EDIT_USER', undefined)
          commit('EDIT_TOKEN', undefined)
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        } else {
          commit('EDIT_USER', userinfo)
          commit('EDIT_TOKEN', token)
          localStorage.setItem('user', JSON.stringify(userinfo))
          localStorage.setItem('token', JSON.stringify(token))
        }

        res()
      })
    },
    EDIT_LOADING({commit}, loading) {
      return new Promise((res) => {
        commit('showLoading', loading)
        res()
      })
    },
  },
  getters: {
    isLoading: (state) => {
      return state.loading
    },
    isLogged: (state) => {
      if (state.user && state.user.userName && state.token && state.token.access_token && state.token.access_expire >= Math.ceil(new Date().getTime() / 1000)) return true
      return false
    },
    tokenInfo: (state) => {
      return state.token
    },
    userInfo: (state) => {
      return state.user
    }
  }
}