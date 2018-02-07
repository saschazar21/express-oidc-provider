<template>
  <div class="card card--error">
    <div class="card__header card__header--border">
      <h1 v-if="error.statusCode">{{ error.statusCode }}</h1>
      <h1 v-else>Error</h1>
    </div>
    <div class="card__body">
      <span v-if="error.message">{{ error.message }}</span>
      <span v-else>An error occurred. That's all we know...</span>
    </div>
    <div class="card__footer">
      <a v-if="error.returnTo" :href="error.returnTo">Back</a>
      <nuxt-link v-else to="/">Exit</nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error'],
  }
</script>

<style lang="scss">

</style>
