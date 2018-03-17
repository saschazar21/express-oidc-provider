<template>
  <div>
    <p>This application requires access to the following:</p>
    <ul v-if="scope">
      <li v-for="(s, index) in scopes" :key="index">{{ s }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scopes: this.scope.split(' ').filter(scope => scope !== 'openid').map(this.parseScope),
    };
  },
  methods: {
    parseScope(scope) {
      switch (scope.toLowerCase()) {
        case 'address': 
          return 'your address (read only)';
        case 'email': 
          return 'your e-mail address (read only)';
        case 'profile': 
          return 'your full profile (read only)';
        case 'user': 
          return 'your name, username and avatar (read only)';
        case 'website': 
          return 'your website (read only)';
        case 'client':
          return 'client data on your behalf (read only)';
        case 'client:create':
          return 'creating clients on your behalf'
        case 'client:update':
          return 'updating your clients'
        case 'client:delete':
          return 'deleting your clients'
        case 'token':
          return 'your tokens (read only)'
        case 'user:create':
          return 'creating users on your behalf'
        case 'user:update':
          return 'updating your user data'
        case 'user:delete':
          return 'deleting your user'
      };
    },
  },
  name: 'scopes',
  props: ['scope']
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  font-weight: bold;
}
</style>
