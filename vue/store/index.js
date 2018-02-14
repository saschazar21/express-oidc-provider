/* eslint import/no-extraneous-dependencies: 0 */
import Vuex from 'vuex';

const store = () => new Vuex.Store({
  actions: {
    nuxtServerInit({ commit }, { req }) {
      if (req.user) {
        return commit('user', req.user);
      }
      return null;
    },
  },
  getters: {
    token: (state) => {
      const token = state.user ? state.user.access_token : null;
      return token;
    },
  },
  state: {
    user: null,
  },
  mutations: {
    user(state, user) {
      const current = state;
      current.user = user;
    },
  },
});

export default store;
