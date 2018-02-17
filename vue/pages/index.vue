<template>
  <div class="card card--center" v-if="$store.state.user && $store.state.user.picture">
    <div class="card__header card__header--border">
      <div class="avatar-container avatar-container--round">
        <img :src="$store.state.user.picture" :alt="'Avatar of ' + $store.state.user.name" class="avatar">
      </div>
      <h1>
        {{ $store.state.user.preferred_username }}
      </h1>
      <small>Profile page</small>
    </div>
    <div class="card__body">
      <table class="profile">
        <tr>
          <th>Name:</th> 
          <td>{{ $store.state.user.name }}</td>
        </tr>
        <tr>
          <th>E-mail:</th>
          <td>{{ $store.state.user.sub }}</td>
        </tr>
      </table>
    </div>
    <div class="card__footer">

    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../assets/css/modules/colors';

  small {
    color: $heading-color;
  }

  table {
    display: inline-block;
  }

  th {
    font-weight: bold;
    padding: .25em;
  }

  td {
    text-align: right;
    padding: .25em;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  .avatar-container {
    margin: 0 auto;
  }
</style>
