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
    expiry: (state) => {
      const millis = state.user && state.user.exp ? state.user.exp * 1000 : 0;
      return millis;
    },
    token: (state) => {
      const token = state.user ? state.user.access_token : null;
      return token;
    },
  },
  state: {
    client: null,
    user: null,
  },
  mutations: {
    clientSet(state, client) {
      const current = state;
      current.client = client;
    },
    clientUpdate(state, client) {
      const current = state;
      current.client = {
        ...state.client,
        ...client,
      };
    },
    user(state, user) {
      const current = state;
      current.user = user;
    },
  },
});

export default store;
