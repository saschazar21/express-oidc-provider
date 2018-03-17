<template>
  <div class="card card--center">
    <div class="card__header">
      <h1>Authorize <span vue-if="client">"{{ client.client_name }}"</span></h1>
    </div>
    <div class="card__body">
      <scopes v-if="scope" :scope="scope"></scopes>
      <form :action="`/interaction/${uuid}/confirm`" method="post">
        <input type="hidden" name="account" :value="client._id">
        <input type="hidden" name="scope" :value="scope">
        <button class="button button--full" type="submit">Continue</button>
      </form>
      <p>or</p>
      <a class="button button--error" :href="returnTo">Cancel</a>
    </div>
  </div>
</template>

<script>
import scopes from '~/components/scopes';

export default {
  asyncData({ params, route, store }) {
    return {
      client: store.state.client,
      returnTo: route.query.returnTo,
      scope: route.query.scope,
      uuid: params.id,
    };
  },
  components: { scopes },
  middleware: 'fetchClient',
}
</script>

<style lang="scss" scoped>
.button--error {
  display: inline-block;
}
</style>

