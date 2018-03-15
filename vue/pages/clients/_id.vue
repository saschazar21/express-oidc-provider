<template>
  <div class="card card--center">
    <div class="card__header">
      <h1>Update {{ client.client_name || 'client' }}</h1>
      <nuxt-link class="button button--block" to="/clients">Back</nuxt-link>
    </div>
    <div class="card__body">
      <client-form @submit="updateClient()" button="Update"></client-form>
      <div v-if="error" class="error">
        <strong>An error occurred: </strong>
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import clientForm from '~/components/clientForm';

  export default {
    async asyncData({ app, params, redirect, store }) {
      return {
        client: store.state.client,
      };
    },
    components: { clientForm },
    data() {
      return {
        error: null,
      };
    },
    methods: {
      async updateClient() {
        this.errors = null;
        const client = {
          ...this.$store.state.client,
        };
        delete client._id;
        delete client.client_secret;

        const result = await this.$axios.$put(`/api/clients/${this.$store.state.client._id}`, client, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        }).catch(e => this.error = e.message || e);
        if (result && !this.error) {
          this.$store.commit('clientSet', null);
          this.$router.push('/clients');
        }
      }
    },
    middleware: 'fetchClient',
  }
</script>
