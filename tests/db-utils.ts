import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

export function createUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName}@example.com`,
  };
}

export function createPassword(password: string = faker.internet.password()) {
  return {
    hash: bcrypt.hashSync(password, 10),
  };
}
