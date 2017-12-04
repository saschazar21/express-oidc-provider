const digits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-+*#°$=';

module.exports = (length, specialChars = true) => {
  const len = length || 20;
  const strlen = specialChars ? digits.length + 1 : digits.length - 8;
  let str = '';
  for (let i = 0; i < len; i += 1) {
    str += digits.charAt(Math.floor(Math.random() * strlen));
  }
  return str;
};
