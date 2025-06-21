const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  // Only scan for tests in the src directory
  roots: ["<rootDir>/src"],
  // Resolve `@/` to `<rootDir>/src/`
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};