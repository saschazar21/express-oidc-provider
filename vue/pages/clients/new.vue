<template>
  <div class="card card--center">
    <div class="card__header">
      <h1>Create client</h1>
    </div>
    <div class="card__body">
      <client-form></client-form>
    </div>
  </div>
</template>

<script>
import clientForm from '~/components/clientForm';

export default {
  components: { clientForm },
}
</script>
