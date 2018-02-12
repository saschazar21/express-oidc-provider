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
