<template>
  <div class="card card--center">
    <div class="card__header">
      <h1>Authorize <span vue-if="client">"{{ client.client_name }}"</span></h1>
    </div>
    <div class="card__body">
      <p>The application asks for permission to retrieve your user information:</p>
      <form :action="`/interaction/${uuid}/confirm`" method="post">
        
      </form>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ params, store }) {
    return {
      client: store.state.client,
      uuid: params.id,
    };
  },
  middleware: 'fetchClient',
}
</script>
