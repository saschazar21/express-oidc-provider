<template>
<div class="form">
  <div class="form-group">
    <label for="client-name">Name</label>
    <input id="client-name" type="text" v-model.lazy="clientName" autofocus>
  </div>
  <div class="form-group">
    <label for="client-redirect">Redirect URIs <small>(comma separated)</small></label>
    <input id="client-redirect" type="text" v-model.lazy="clientRedirect">
  </div>
  <div class="form-group">
    <span>Grant Types</span>
    <div class="form-flex">
      <div class="form-group">
        <label for="authorization-code">Authorization Code</label>
        <input id="authorization-code" :checked="grantTypeChecked('authorization_code')" type="checkbox" value="authorization_code" v-model="grantTypes">
      </div>
      <div class="form-group">
        <label for="implicit">Implicit</label>
        <input id="implicit" :checked="grantTypeChecked('implicit')" type="checkbox" value="implicit" v-model="grantTypes">
      </div>
      <div class="form-group">
        <label for="refresh-token">Refresh Token</label>
        <input id="refresh-token" :checked="grantTypeChecked('refresh_token')" type="checkbox" value="refresh_token" v-model="grantTypes">
      </div>
    </div>
  </div>
  <div class="form-group">
    <span>Response Types</span>
    <div class="form-flex">
      <div class="form-group">
        <label for="code">Code</label>
        <input id="code" :checked="responseTypeChecked('code')" type="checkbox" value="code" v-model="responseTypes">
      </div>
      <div class="form-group">
        <label for="token">Token</label>
        <input id="token" :checked="responseTypeChecked('token')" type="checkbox" value="token" v-model="responseTypes">
      </div>
      <div class="form-group">
        <label for="id-token">ID Token</label>
        <input id="id-token" :checked="responseTypeChecked('id_token')" type="checkbox" value="id_token" v-model="responseTypes">
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  computed: {
    clientName: {
      get() {
        return this.$store.client ? this.$store.client.client_name : null;
      },
      set(value) {
        return this.$store.commit('clientUpdate', { client_name: value });
      },
    },
    clientRedirect: {
      get() {
        return this.$store.client ? this.$store.client.redirect_uris.join(', ') : null;
      },
      set(value) {
        const uris = value.split(',').map(url => url.trim()).filter(e => e.length > 0);
        const filtered = uris.filter(e => this.checkUri(e)).length === uris.length;
        if (filtered) {
          this.errors.clientRedirect = true;
        } else {
          delete this.errors.clientRedirect;
        }
        return filtered ? this.$store.commit('clientUpdate', { redirect_uris: uris }) : null;
      }
    },
  },
  data() {
    return {
      errors: {},
      grantTypes: [],
      responseTypes: [],
    };
  },
  methods: {
    checkUri(value) {
      return value.startsWith('http') ? /^https\:\/\//i.test(value) : true;
    },
    grantTypeChecked(type) {
      if (!this.$store.state.client || !this.$store.state.client.response_types) {
        return false;
      }
      const result = this.$store.state.client.grant_types.indexOf(type) > -1;
      return result;
    },
    responseTypeChecked(type) {
      if (!this.$store.state.client || !this.$store.state.client.response_types) {
        return false
      }
      const result = this.$store.state.client.response_types.indexOf(type) > -1;
      return result;
    },
  },
  name: 'client-form',
  watch: {
    grantTypes(types) {
      return this.$store.commit('clientUpdate', { grant_types: types });
    },
    responseTypes(types) {
      return this.$store.commit('clientUpdate', { response_types: types });
    },
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  margin-top: 1em;
}

.form-flex {
  display: flex;

  div {
    font-size: .75em;

    &:not(:first-child) {
      margin-left: 1em;
    }
  }
}
</style>
