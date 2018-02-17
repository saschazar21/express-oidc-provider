<template>
  <div class="block block--full">
    <nav-bar />
    <nuxt />
  </div>
</template>

<script>
  import navBar from '~/components/navBar';

  export default {
    components: { navBar },
    middleware: 'tokenExpired',
  }
</script>
