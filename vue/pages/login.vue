<template>
  <div>
    <h1>Login</h1>
    <form method="POST" :action="'/interaction/' + uuid + '/submit'">
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
  asyncData ({req}) {
    return {
      uuid: req.data.uuid,
      client: req.data.client.client_name || req.data.client.client_id,
      logo: req.data.client.logo_uri,
    }
  }
}

</script>