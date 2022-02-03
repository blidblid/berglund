import { existsSync } from 'fs';
import { directories, fileNames } from '../../../core/constants';
import { join, resolve } from '../../../core/path';
import {
  capitalize,
  readJsonObject,
  readJsonObjectSafely,
} from '../../../core/util';
import { ValidatedShowcaseConfig } from '../core/read';
import { FeatureConfig } from '../schemas/feature/schema';

export class Context {
  protected userIds = new Set<string>();
  protected generatedIds = new Set<string>();

  id: string;
  name: string;
  isRoot: boolean;
  featureConfig: FeatureConfig;
  packageJson: PackageJson;
  relativeGitUrl?: string;

  constructor(
    public showcaseDir: string,
    public featureDir: string,
    public showcaseConfig: ValidatedShowcaseConfig
  ) {
    this.setFeatureConfig();
    this.setId();
    this.setName();
    this.setGitUrl();
    this.setIsRoot();
    this.setPackageJson();
  }

  private setFeatureConfig(): void {
    const featureConfigPath = join(this.featureDir, fileNames.featureConfig);
    this.featureConfig = readJsonObjectSafely(featureConfigPath, {});
    this.featureConfig.tsconfig =
      this.featureConfig.tsconfig &&
      join(featureConfigPath, this.featureConfig.tsconfig);
  }

  private setId(): void {
    if (this.featureConfig.id !== undefined) {
      this.id = this.featureConfig.id;

      if (this.userIds.has(this.id)) {
        throw new Error(`Multiple ids ${this.id}`);
      }

      this.userIds.add(this.id);
    } else {
      const segments = this.featureDir.split('/');
      segments.shift();

      for (const segment of segments.reverse()) {
        this.id = this.id ? this.id + '-' + segment : segment;

        if (!this.generatedIds.has(this.id) && !this.userIds.has(this.id)) {
          this.generatedIds.add(this.id);
          break;
        }
      }
    }
  }

  private setName(): void {
    if (this.featureConfig.name) {
      this.name = this.featureConfig.name;
    } else {
      this.name = capitalize(this.id.split('-').join(' '));
    }
  }

  private setGitUrl(): void {
    const gitParentDir = this.findParentPath(directories.git);

    if (!gitParentDir) {
      return;
    }

    this.relativeGitUrl = this.featureDir.replace(gitParentDir, '');
  }

  private findParentPath(childPath: string): string | null {
    let searchAt = this.featureDir;

    while (searchAt) {
      if (existsSync(join(searchAt, childPath))) {
        return searchAt;
      }

      searchAt = resolve(join(searchAt, '..'));
    }

    return null;
  }

  private setPackageJson(): void {
    const packageJsonParentPath = this.findParentPath(fileNames.package);

    if (!packageJsonParentPath) {
      this.packageJson = {};
      return;
    }

    this.packageJson = readJsonObject(
      join(packageJsonParentPath, fileNames.package)
    );
  }

  private setIsRoot(): void {
    this.isRoot = existsSync(join(this.featureDir, fileNames.showcaseConfig));
  }
}

export interface PackageJson {
  name?: string;
  repositoryUrl?: string;
}
