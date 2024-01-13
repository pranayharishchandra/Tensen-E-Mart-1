import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  // This function is called before the document is saved to the database.

  if (!this.isModified('password')) {
    // Check if the password field has been modified.
    // If it hasn't, there's no need to hash the password again,
    // so the middleware calls next() to continue with the save operation.
    next();
  } else {
    // If the password has been modified, it needs to be hashed before saving.

    // Generate a salt using bcrypt. The number 10 is the cost factor that determines
    // how much time is needed to calculate a single bcrypt hash. The higher the cost,
    // the more hashing rounds are done and the more secure the hash, but the longer it takes.
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt and replace the plain text password
    // with the hashed one in the document.
    this.password = await bcrypt.hash(this.password, salt);

    // Continue with the save operation.
    next();
  }
});


// const variable = mongoose.model('Collection', schema);
const User = mongoose.model('User', userSchema);

export default User;
