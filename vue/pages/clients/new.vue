<template>
  <div class="card card--center">
    <div class="card__header">
      <h1>Create client</h1>
    </div>
    <div class="card__body">
      <client-form @submit="createClient()"></client-form>
    </div>
  </div>
</template>

<script>
import clientForm from '~/components/clientForm';

export default {
  components: { clientForm },
  methods: {
    async createClient() {
      if (this.$store.state.client) {
        const client = await this.$axios.$post('/api/clients', this.$store.state.client, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        });
        this.$store.commit('clientSet', null);
        this.$router.push('/clients');
      }
    },
  },
}
</script>
