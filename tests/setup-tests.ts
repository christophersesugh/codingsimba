import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

process.env.TESTING = "true";

afterEach(() => {
  cleanup();
});
