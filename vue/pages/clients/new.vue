<template>
  <div class="card card--center">
    <div class="card__header">
      <h1>Create client</h1>
      <nuxt-link class="button button--block" to="/clients">Back</nuxt-link>
    </div>
    <div class="card__body">
      <client-form @submit="createClient()"></client-form>
      <div v-if="client">
        <h3>Client successfully created</h3>
        <client-detail :client="client" @deleted="deleted()"></client-detail>
      </div>
      <div v-if="error" class="error">
        <strong>An error occurred: </strong>
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import clientDetail from '~/components/clientDetail';
import clientForm from '~/components/clientForm';

export default {
  components: { clientDetail, clientForm },
  data() {
    return {
      client: null,
      error: null,
    };
  },
  methods: {
    async createClient() {
      if (this.$store.state.client) {
        this.client = await this.$axios.$post('/api/clients', this.$store.state.client, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        }).catch(e => this.error = e.message || e);
        this.$store.commit('clientSet', null);
      }
    },
    deleted(id) {
      this.client = null;
    }
  },
}
</script>
