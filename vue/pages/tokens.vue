<template>
  <div class="card card--center">
    <div class="card__header">
      <h1>Tokens</h1>
    </div>
    <div class="card__body">
      <ol v-if="tokens && tokens.length > 0">
        <li v-for="(token, index) in tokens" :key="index">
          <token-detail :token="token"></token-detail>
        </li>
      </ol>
      <p v-else>Currently no active tokens available...</p>
    </div>
  </div>
</template>

<script>
  import tokenDetail from '~/components/tokenDetail';

  export default {
    async asyncData({ app, store }) {
      const tokens = await app.$axios.$get('/api/tokens', {
        headers: {
          Authorization: `Bearer ${store.getters.token}`,
        },
      });

      return {
        tokens: tokens
          // .filter(token => token.payload && token.payload.clientId)
          .map(token => Object({
            ...token,
            _id: `${token._id.substr(0, 10)}...`,
          })),
      };
    },
    components: { tokenDetail },
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/modules/_variables.scss';

  li:not(:last-child) {
    border-bottom: 1px dashed $color1;
    margin-bottom: 1em;
  }
</style>
