const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 6,
      select: false
    },
    googleId: {
      type: String,
      default: null
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    subscriptionTier: {
      type: String,
      enum: ['Free', 'Pro', 'Studio', 'Enterprise'],
      default: 'Free'
    },
    stripeCustomerId: {
      type: String,
      default: null
    },
    stripeConnectAccountId: {
      type: String,
      default: null
    },
    storageUsedBytes: {
      type: Number,
      default: 0
    },
    storageLimitBytes: {
      type: Number,
      default: 5 * 1024 * 1024 * 1024 // 5 GB default
    },
    bio: {
      type: String,
      default: 'Music Producer & Audio Engineer'
    }
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
