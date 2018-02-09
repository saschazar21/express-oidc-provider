<template>
  <div class="block block--full">
    <nav-bar :user="user"></nav-bar>
    <h1>Hello <span v-if="user.name">{{ user.name }}</span><span v-else>world</span></h1>
  </div>
</template>

<script>
  import navBar from '~/components/navBar';

  export default {
    asyncData({ req }) {
      return {
        user: req.user,
      }
    },
    components: { navBar },
  }
</script>