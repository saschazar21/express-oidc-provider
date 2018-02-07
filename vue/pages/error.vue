<template></template>

<script>
  export default {
    asyncData({ error, req, redirect }) {
      if (req && req.error) {
        return error({
          ...req.error,
          statusCode: req.error.status,
        })
      }
      return redirect('/');
    }
  }
</script>