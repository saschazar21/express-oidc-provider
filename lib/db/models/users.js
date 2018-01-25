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
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const bcrypt = require('bcrypt');
const { v4 } = require('uuid');

const cat = require('../../tools/cat');
const mongoose = require('../setup');
const validators = require('../../tools/validators');

const saltLength = process.env.SALT_LENGTH || 10;

const userSchema = new mongoose.Schema({
  _id: {
    default: v4,
    type: String,
  },
  password: String,
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
    unique: true,
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
    type: String,
    validate: {
      validator: validators.isUrl,
      message: '{VALUE} is not a valid URI starting with http(s)',
    },
  },
  preferred_username: {
    type: String,
    unique: true,
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

userSchema.pre('save', async function genPasswd(next) {
  if (!this.picture) {
    this.picture = await cat();
  }

  if (this.isModified('family_name') || this.isModified('given_name')) {
    this.family_name = this.family_name.charAt(0).toUpperCase() + this.family_name.slice(1);
    this.given_name = this.given_name.charAt(0).toUpperCase() + this.given_name.slice(1);
    this.name = `${this.given_name} ${this.family_name}`;
  }

  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, saltLength);
  return next();
});

userSchema.methods.correctPassword = async function correctPasswd(plaintext) {
  if (!plaintext) {
    return false;
  }
  return bcrypt.compare(plaintext, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
