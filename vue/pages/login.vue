<template>
  <div class="block block--center block--full">
    <div class="card">
      <div class="card__header">
        <h1>Login</h1>
      </div>
      <form method="POST" :action="'/interaction/' + uuid + '/submit'">
        <div class="card__body">
          <div class="form-group">
            <label for="email">E-Mail:</label>
            <input type="email" id="email" name="email" autofocus>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password">
          </div>
        </div>
        <div class="card__footer">
            <button class="button button--full" type="submit">Log in</button>
        </div>
      </form>
    </div>
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