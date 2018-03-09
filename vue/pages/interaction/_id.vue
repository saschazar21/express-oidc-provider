<template>
  <div class="card">
    <div class="card__header">
      <h1>Authorize <span vue-if="client">"{{ client }}"</span></h1>
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
  asyncData({ params, req }) {
    console.log(req.session[params.id]);
    return {
      details: req.session[params.id],
      uuid: params.id,
    };
  },
}
</script>
