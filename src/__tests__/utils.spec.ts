import { toBoolean } from "../lib/utils";

describe("toBoolean", () => {
  test("Converts string 'false' to 'false'", () => {
    expect(toBoolean("false")).toEqual(false);
  });
  test("Converts empty string to 'false'", () => {
    expect(toBoolean("")).toEqual(false);
  });
  test("Converts string '0' to 'false'", () => {
    expect(toBoolean("0")).toEqual(false);
  });
  test("Converts zero to 'false'", () => {
    expect(toBoolean(0)).toEqual(false);
  });
  test("Converts any negative number to 'false'", () => {
    expect(toBoolean(-1)).toEqual(false);
  });
  test("Converts string 'true' to 'true'", () => {
    expect(toBoolean("true")).toEqual(true);
  });
  test("Converts any non-empty string to 'true'", () => {
    expect(toBoolean("limit_matches")).toEqual(true);
  });
  test("Converts string '1' to 'true'", () => {
    expect(toBoolean("1")).toEqual(true);
  });
  test("Converts any positive number to 'true'", () => {
    expect(toBoolean(1)).toEqual(true);
  });
});
