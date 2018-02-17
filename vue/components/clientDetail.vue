<template>
  <div class="client">
    <div class="client__header">
      <div class="client__logo avatar-container avatar-container--round" v-if="client && client.logo_uri">
        <img class="avatar" :src="client.logo_uri" :alt="`Logo of ${client._id}`">
      </div>
      <div class="client__name">
        <h4 v-if="client && client.client_name">{{ client.client_name }}</h4>
        <span class="label">{{ client._id }}</span>
      </div>
    </div>
    <div class="client__body">
      <p>
        <span class="label">Redirect URIs</span>
        <span class="content">{{ redirectUris }}</span>
      </p>
      <p>
        <span class="label">Grant types</span>
        <span class="content">{{ grantTypes }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    redirectUris: function () {
      return this.client.redirect_uris.join(', ');
    },
    grantTypes: function () {
      return this.client.grant_types.join(', ');
    },
  },
  name: 'client-detail',
  props: [ 'client' ],
}
</script>

<style lang="scss" scoped>
@import '../assets/css/modules/variables';

h4 {
  margin-bottom: 0;
  margin-top: 0;
}

.client {
  font-size: .8em;
  padding: 1em;
}

.client__body {
  text-align: left;
}

.client__header {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}

.label {
  display: block;
  font-family: $mono-font-family;
  font-size: .75em;
}

@media screen and (min-width: $phone-landscape-size) {
  .client__header {
    align-items: flex-start;
    flex-direction: row;
    text-align: left;
  }

  .client__name {
    margin-left: 1em;
  }
}
</style>
