/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}]
  }
};

export default config;
