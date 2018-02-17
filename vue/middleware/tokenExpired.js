export default function checkExpiry({
  env,
  redirect,
  res,
  store,
}) {
  if (Date.now() > store.getters.expiry) {
    const logout = `${env.baseUrl}/logout`;
    return process.isServer ? res.redirect(logout) : redirect(logout);
  }
  return true;
}
