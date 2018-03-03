<template>
  <div class="card card--center">
    <div class="card__header">
      <h1>Clients</h1>
      <nuxt-link to="/clients/new" class="button button--block">Create new</nuxt-link>
    </div>
    <div class="card__body">
      <client-detail v-for="(client, index) in clients" :key="index" :client="client" @deleted="deleted(client._id)"></client-detail>
      <p v-if="clients.length === 0">
        <span>No clients yet. Go on and create one!</span>
      </p>
    </div>
  </div>
</template>

<script>
import clientDetail from '~/components/clientDetail';

export default {
  async asyncData({ app, store }) {
    const clients = await app.$axios.$get('/api/clients', {
      headers: {
        Authorization: `Bearer ${store.getters.token}`,
      },
    });
    return {
      clients,
    }
  },
  components: { clientDetail },
  methods: {
    deleted(id) {
      return this.clients = this.clients.filter(client => client._id !== id);
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/modules/variables';

.card__body > div:not(:last-child) {
  border-bottom: 1px dashed $color1;
}
</style>
