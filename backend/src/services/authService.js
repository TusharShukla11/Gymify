const bcrypt = require("bcryptjs");

const { getDatabase } = require("../config/database");
const { generateToken } = require("../utils/jwt");

async function registerUser({
  name,
  email,
  password,
  phone,
  role
}) {
  const db = getDatabase();
  const users = db.collection("users");

  const normalizedEmail =
    email.toLowerCase().trim();

  const existingUser = await users.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    throw new Error(
      "User with this email already exists."
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 12);

  const user = {
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    phone: phone || null,
    role: role || "MEMBER",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await users.insertOne(user);

  // TOKEN FOR REGISTER
  const token = generateToken({
    userId: result.insertedId.toString(),
    email: user.email,
    role: user.role
  });

  return {
    user: {
      id: result.insertedId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    },
    token
  };
}

async function loginUser({
  email,
  password
}) {
  const db = getDatabase();
  const users = db.collection("users");

  const normalizedEmail =
    email.toLowerCase().trim();

  const user = await users.findOne({
    email: normalizedEmail
  });

  if (!user) {
    throw new Error(
      "Invalid email or password."
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatches) {
    throw new Error(
      "Invalid email or password."
    );
  }

  if (user.status !== "ACTIVE") {
    throw new Error(
      "User account is inactive."
    );
  }

  // TOKEN FOR LOGIN
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    },
    token
  };
}

module.exports = {
  registerUser,
  loginUser
};