import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/user.model";

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
