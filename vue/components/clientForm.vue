<template>
  <form action="#" method="post">
    <div class="form-group">
      <label for="client-name">Name</label>
      <input id="client-name" type="text" v-model="clientName" lazy autofocus>
    </div>
    <div class="form-group">
      <label for="client-redirect">Redirect URIs <small>(comma separated)</small></label>
      <input id="client-redirect" type="text" v-model="clientRedirect" lazy>
    </div>
  </form>
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
        return filtered ? this.$store.commit('clientUpdate', { redirect_uris: uris }) : null;
      }
    }
  },
  methods: {
    checkUri(value) {
      return value.startsWith('http') ? /^https\:\/\//i.test(value) : true;
    },
  },
  name: 'client-form',
}
</script>
