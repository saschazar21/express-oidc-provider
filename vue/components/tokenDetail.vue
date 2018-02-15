<template>
  <div class="token">
    <div class="token__header">
      <strong v-if="token.payload.clientId">{{ token.payload.clientId.client_name }}</strong>
      <strong v-else>{{ token._id }}</strong>
    </div>
    <div class="token__body">
      <span v-if="expires">valid until: {{ expires }}</span>
      <ul v-if="scopes && scopes.length > 0">
        <li v-for="(scope, index) in scopes" :key="index">{{ scope }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    expires: function () {
      return new Date(this.token.payload.exp * 1000).toLocaleTimeString();
    },
    scopes: function () {
      return this.token.payload.scope.split(' ');
    },
  },
  name: 'token-detail',
  props: [ 'token' ],
}
</script>

<style lang="scss" scoped>
  @import '../assets/css/modules/variables';

  ul {
    list-style-type: none;
    margin-top: 1em;
    padding-left: 0;
  }

  li {
    background-color: $color3;
    border-radius: $default-border-radius;
    float: left;
    margin-bottom: .5em;
    padding: .25em;

    &:not(:last-child) {
      margin-right: .75em;
    }
  }

  .token {

    padding: 1em;
  }

  .token__header {
    text-align: left;
  }

  .token__body {
    font-family: $mono-font-family;
    font-size: .75em;
    text-align: left;

    &:before,
    &:after {
        content: "";
        display: table;
    }
    &:after {
        clear: both;
    }
  }
</style>

