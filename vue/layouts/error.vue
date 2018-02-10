<template>
  <div class="block block--center block--full">
    <div class="card card--error">
      <div class="card__header card__header--border">
        <h1>
          Error
          <span v-if="error.statusCode"> {{ error.statusCode }}</span>
        </h1>
      </div>
      <div class="card__body">
        <p>Oh no!<br/>An error occurred. That's all we know...</p>
        <span v-if="error.message">Error message: </span>
        <code v-if="error.message">{{ error.message }}</code>
      </div>
      <div class="card__footer">
        <a v-if="error.returnTo" :href="error.returnTo">Back</a>
        <a class="button button--full button--error" v-else href="/web">Exit</a>
      </div>
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
