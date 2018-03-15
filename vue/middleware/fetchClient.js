export default async function fetchClient({
  app,
  route,
  store,
}) {
  const clientId = route.params.id || route.query.client_id;
  if (clientId) {
    try {
      const client = await app.$axios.$get(`/api/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${store.getters.token}`,
        },
      });
      store.commit('clientSet', client);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
  throw new Error('No client ID given');
}
