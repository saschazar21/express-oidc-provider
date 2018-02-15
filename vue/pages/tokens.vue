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
      <h3 v-else>Currently no active tokens available...</h3>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import tokenDetail from '~/components/tokenDetail';

  export default {
    async asyncData ({ store }) {
      const { data } = await axios.get('/api/tokens', {
        headers: {
          Authorization: `Bearer ${store.getters.token}`,
        },
      });

      return {
        tokens: data
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
    border-bottom: 1px solid $color1;
    margin-bottom: 1em;
  }

  .card--center {
    display: block;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
</style>
