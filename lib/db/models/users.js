/**
 * User model:
 * {
    address,
    birthdate,
    email,
    email_verified,
    family_name,
    gender,
    given_name,
    locale,
    middle_name,
    name,
    phone_number,
    phone_number_verified,
    nickname,
    picture,
    preferred_username,
    profile,
    updated_at,
    website,
    zoneinfo,
  },
 */

const cat = require('../../tools/cat');
const mongoose = require('../setup');
const validators = require('../../tools/validators');

const userSchema = new mongoose.Schema({
  address: {
    street_address: String,
    locality: String,
    region: String,
    postal_code: String,
    country: String,
  },
  birthdate: Date,
  email: {
    lowercase: true,
    required: true,
    type: String,
    validate: {
      validator: validators.isEmail,
      message: '{VALUE} is not a valid e-mail address, please check again',
    },
  },
  email_verified: {
    default: false,
    type: Boolean,
  },
  family_name: {
    required: true,
    type: String,
  },
  gender: {
    lowercase: true,
    type: String,
    enum: ['female', 'male', 'other'],
  },
  given_name: {
    required: true,
    type: String,
  },
  locale: String,
  middle_name: String,
  name: {
    default: function generateName() {
      return `${this.given_name} ${this.family_name}`;
    },
    type: String,
  },
  phone_number: String,
  phone_number_verified: {
    default: false,
    type: Boolean,
  },
  nickname: String,
  picture: {
    default: async function getCats() {
      const catUrl = await cat();
      return catUrl;
    },
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URI starting with http(s)',
    },
  },
  preferred_username: {
    required: true,
    type: String,
  },
  profile: {
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URI starting with http(s)',
    },
  },
  website: {
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URI starting with http(s)',
    },
  },
  zoneinfo: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
