<template>
  <div class="card card--center">
    <div class="card__header">
      <h1>Tokens</h1>
    </div>
    <div class="card__body">

    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    async fetch ({ store, params }) {
      const { data } = await axios.get('/api/tokens', {
        headers: {
          Authorization: `Bearer ${store.getters.token}`,
        },
      });
      return {
        tokens: data.body,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card--center {
    display: block;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
</style>
