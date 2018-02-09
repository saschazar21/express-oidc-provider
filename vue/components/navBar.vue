<template>
  <div class="nav">
    <div class="nav__body">
      <button class="button nav__menu-button">
        <span v-if="isOpen">Close</span>
        <span v-else>Menu</span>
      </button>
      <img v-if="user && user.picture" :src="user.picture" :alt="'Avatar of ' + user.name" class="avatar avatar--round">
      <strong v-if="user && user.name">{{ user.name }}</strong>
    </div>
    <nav class="nav__controls">
      <nuxt-link class="nav__item" to="tokens">Tokens</nuxt-link>
      <nuxt-link class="nav__item" to="clients">Clients</nuxt-link>
    </nav>
    <a href="/logout" class="button button--error nav__item">Logout</a>
    <div :class="['nav__menu', {'nav__menu-open': isOpen}]">
      <ul class="nav__menu-list">
        <li class="nav__menu-list--item">
          <nuxt-link class="nav__item" to="tokens">Tokens</nuxt-link>
        </li>
        <li class="nav__menu-list--item">
          <nuxt-link class="nav__item" to="clients">Clients</nuxt-link>
        </li>
        <li class="nav__menu-list--item">
          <a href="/logout" class="nav__item">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isOpen: false,
      }
    },
    name: 'nav-bar',
    props: ['user'],
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/modules/variables';

  .nav {
    align-items: center;
    border-bottom: $default-border-width solid $body-copy-color;
    display: flex;
    justify-content: space-between;
    font-size: 1.25rem;
    position: relative;

    &__controls {
      display: none;
    }
    
    &__menu {
      left: 0;
      overflow: hidden;
      position: absolute;
      right: 0;
      top: -100%;

      &-open {
        top: 100%;
      }
    }
  }

  @media screen and (min-width: $phone-landscape-size) {
    .nav {
      font-size: 1rem;

      &__button-menu,
      &__menu {
        display: none;
      }

      &__controls {
        display: block;
      }
    }
  }
</style>

