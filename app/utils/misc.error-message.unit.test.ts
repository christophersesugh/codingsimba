import { expect, test, describe, vi } from "vitest";
import { getErrorMessage } from "./misc";
import { faker } from "@faker-js/faker";

describe("getErrorMessage", () => {
  test("error object returns message", () => {
    const message = faker.lorem.words(2);
    const error = new Error(message);
    expect(getErrorMessage(error)).toBe(message);
  });

  test("String return itself", () => {
    const message = faker.lorem.words(2);
    expect(getErrorMessage(message)).toBe(message);
  });

  test("undefined returns 'Unknown error'", () => {
    const consoleError = vi.spyOn(console, "error");
    expect(getErrorMessage(undefined)).toBe("Unknown Error");
    expect(consoleError).toHaveBeenCalledWith(
      "Unable to get error message for error",
      undefined,
    );
  });
});
