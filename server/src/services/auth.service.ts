import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/user.model";
import { generateToken } from "./token.service";

export const signupService = async (data: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await createUser({
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    password: hashedPassword,
  });
};


export const signinService = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  const user = await findUserByEmail(data.email);
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) throw new Error("Invalid credentials");
  const token = generateToken(user.id);
  return {
    token,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },
  };
};
