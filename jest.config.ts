import type { Config } from "jest";
import dotenv from "dotenv";
import nextJest from "next/jest";

dotenv.config({
  path: ".env.development",
});

const createJestConfig = nextJest({
  dir: ".",
});

const config: Config = {
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "<rootDir>"],
};

export default createJestConfig(config);
