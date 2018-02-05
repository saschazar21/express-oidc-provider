<template>
  <div>
    <h1>Login</h1>
    <form method="POST" action="#">
      <label for="email">E-Mail</label>
      <input type="email" id="email" name="email">
      <label for="password">Password</label>
      <input type="password" id="password" name="password">
      <button type="submit">Log in</button>
    </form>
  </div>
</template>

<script>

export default {
  asyncData (ctx) {
    return {}
  }
}

</script>