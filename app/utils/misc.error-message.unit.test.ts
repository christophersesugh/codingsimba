import { expect, test } from "vitest";
import { getErrorMessage } from "./misc";
import { faker } from "@faker-js/faker";

test("error object returns message", () => {
  const message = faker.lorem.word(1);
  const error = new Error(message);
  expect(getErrorMessage(error)).toBe(message);
});
