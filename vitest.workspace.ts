import { defineWorkspace } from "vitest/config";
import { defaultConfig } from "./vite.config";
import { defaultProjectTestConfig } from "./vitest.config";

export default defineWorkspace([
  {
    ...defaultConfig,
    test: {
      name: "pre",
      include: ["src/test/pre.test.ts"],
      environment: "jsdom",
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "abilities",
      include: ["src/test/abilities/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "achievments",
      include: ["src/test/achievments/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "arena",
      include: ["src/test/arena/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "battle",
      include: ["src/test/battle/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "battlerTags",
      include: ["src/test/battlerTags/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "eggs",
      include: ["src/test/eggs/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "field",
      include: ["src/test/field/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "inputs",
      include: ["src/test/inputs/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "items",
      include: ["src/test/items/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "localization",
      include: ["src/test/localization/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "moves",
      include: ["src/test/moves/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "phases",
      include: ["src/test/phases/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "settingMenu",
      include: ["src/test/settingMenu/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "sprites",
      include: ["src/test/sprites/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "ui",
      include: ["src/test/ui/**/*.{test,spec}.ts"],
    },
  },
  {
    ...defaultConfig,
    test: {
      ...defaultProjectTestConfig,
      name: "root",
      include: ["src/test/*.{test,spec}.ts"],
    },
  },
  "./vitest.config.ts",
]);
