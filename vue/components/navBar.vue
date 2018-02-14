<template>
  <div class="nav" v-if="$store.state.user">
    <div class="nav__body">
      <div class="nav__user">
        <div class="avatar-container avatar-container--small avatar-container--round">
          <img v-if="$store.state.user.picture" :src="$store.state.user.picture" :alt="'Avatar of ' + $store.state.user.name" class="avatar">
        </div>
        <strong v-if="$store.state.user.name">{{ $store.state.user.name }}</strong>
      </div>
      <button class="button nav__menu-button" @click="isOpen = !isOpen">
        <span v-if="isOpen">Close</span>
        <span v-else>Menu</span>
      </button>
    </div>
    <nav class="nav__controls">
      <nuxt-link class="nav__item" to="/">Dashboard</nuxt-link>
      <nuxt-link class="nav__item" to="tokens">Tokens</nuxt-link>
      <nuxt-link class="nav__item" to="clients">Clients</nuxt-link>
      <a href="/logout" class="nav__item">Logout</a>
    </nav>
    <div :class="['nav__menu', {'nav__menu-open': isOpen}]">
      <ul class="nav__menu-list">
        <li class="nav__menu-list--item">
          <nuxt-link class="nav__item" to="/">Dashboard</nuxt-link>
        </li>
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
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/modules/variables';

  .nav {
    align-items: center;
    border-bottom: $default-border-width solid $body-copy-color;
    display: flex;
    height: 42px;
    justify-content: space-between;
    font-size: 1.25rem;
    padding: 0 1em;
    position: relative;

    &__body {
      align-items: center;
      display: flex;
      justify-content: space-between;
      width: 100%;

      & > *:not(:first-child) {
        margin-left: 1em;
      }
    }

    &__controls {
      display: none;
    }
    
    &__menu {
      background-color: $primary-color;
      color: $soft-gray;
      height: 0;
      left: 0;
      overflow: hidden;
      position: absolute;
      right: 0;
      top: 100%;

      &-list {
        font-size: 1.25em;
        list-style-type: none;

        li:not(:first-child) {
          margin-top: 1em;
        }
      }

      &-open {
        height: auto;
      }

      & a {
        color: $soft-gray;
      }
    }

    &__user {
      align-items: center;
      display: flex;

      > *:not(:first-child) {
        margin-left: 1em;
      }
    }
  }

  @media screen and (min-width: $phone-landscape-size) {
    .nav {
      font-size: 1rem;

      &__menu-button,
      &__menu {
        display: none;
      }

      &__controls {
        display: block;
      }

      &__item:not(:first-child) {
        margin-left: 1em;
      }
    }
  }
</style>

