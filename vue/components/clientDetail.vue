<template>
  <div class="client">
    <div class="client__content">
      <div class="client__header">
        <div class="client__logo avatar-container avatar-container--round" v-if="client && client.logo_uri">
          <img class="avatar" :src="client.logo_uri" :alt="`Logo of ${client._id}`">
        </div>
        <div class="client__name">
          <h4 v-if="client && client.client_name">{{ client.client_name }}</h4>
          <span class="label">{{ client._id }}</span>
          <p v-if="secret">
            <span class="label">New client secret</span>
            <span class="content">{{ secret }}</span>
          </p>
          <button v-else class="button button--block client__reset" @click="resetClient">Reset secret</button>
          <p>
            <span class="label">Redirect URIs</span>
            <span class="content">{{ redirectUris }}</span>
          </p>
          <p>
            <span class="label">Grant types</span>
            <span class="content">{{ grantTypes }}</span>
          </p>
          <p>
            <span class="label">Response types</span>
            <span class="content">{{ responseTypes }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="client__controls">
      <button class="button button--block">Update</button>
      <button class="button button--block button--error">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    grantTypes: function () {
      return this.client.grant_types.join(', ');
    },
    redirectUris: function () {
      return this.client.redirect_uris.join(', ');
    },
    responseTypes: function () {
      return this.client.response_types.join(', ');
    },
  },
  data() {
    return {
      secret: null,
    };
  },
  methods: {
    async resetClient() {
      const result = await this.prepareAxios(`/api/clients/${this.client._id}/reset`);
      return this.secret = result.client_secret;
    },
    async prepareAxios(url) {
      return this.$axios.$get(url, {
        headers: {
          Authorization: `Bearer ${this.$store.state.user.access_token}`,
        },
      });
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

.client__name p {
  margin-top: 1em;
  word-break: break-all;
}

.client {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: .8em;
  padding: 1em;
}

.client__body {
  text-align: left;
}

.client__controls {
  display: flex;
}

.client__header {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}

.client__reset {
  margin: 0 auto;
}

.label {
  display: block;
  font-family: $mono-font-family;
  font-size: .75em;
}

@media screen and (min-width: $phone-landscape-size) {
  .client {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }

  .client__controls {
    flex-direction: column;
    margin-left: 1em;
  }

  .client__header {
    align-items: flex-start;
    flex-direction: row;
    text-align: left;
  }

  .client__name {
    margin-left: 1em;
  }

  .client__reset {
    margin: 0;
  }
}
</style>
