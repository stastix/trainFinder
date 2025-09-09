module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: ["lib/**/*.ts", "!lib/**/*.d.ts"],
  setupFilesAfterEnv: ["<rootDir>/setup.ts"],

  clearMocks: true,
  silent: true,
};
