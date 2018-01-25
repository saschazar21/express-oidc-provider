module.exports = {
  address: ['address'],
  email: ['email', 'email_verified'],
  openid: ['sub'],
  profile: [
    'family_name',
    'given_name',
    'name',
    'nickname',
    'picture',
    'preferred_username',
  ],
  username: ['email', 'preferred_username'],
};
