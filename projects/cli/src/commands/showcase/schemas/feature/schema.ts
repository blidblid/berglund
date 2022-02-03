/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface FeatureConfig {
  /**
   * Name of the feature.
   */
  name?: string;
  /**
   * Id of the feature.
   */
  id?: string;
  /**
   * Category of the feature.
   */
  category?: string;
  /**
   * Relative file path of readme file.
   */
  readmePath?: string;
  /**
   * Relative file path of entry point used in API generation.
   */
  entryPointPath?: string;
  /**
   * Relative tsconfig path to use when generating the api
   */
  tsconfig?: string;
  /**
   * Whether extracted components are web components
   */
  webComponent?: boolean;
  [k: string]: unknown;
}
