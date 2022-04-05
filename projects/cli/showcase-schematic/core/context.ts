import { existsSync } from 'fs';
import { capitalize, directories, fileNames, join, readJsonObject, readJsonObjectSafely, resolve } from '../../../core';
import {} from '../core/read';
import { FeatureOptions } from '../schemas/feature/schema';
import { ShowcaseOptions } from '../schemas/showcase/schema';

export class Context {
  protected userIds = new Set<string>();
  protected generatedIds = new Set<string>();

  id: string;
  name: string;
  isRoot: boolean;
  featureOptions: FeatureOptions;
  packageJson: PackageJson;
  relativeGitUrl?: string;

  constructor(public showcaseDir: string, public featureDir: string, public showcaseOptions: ShowcaseOptions) {
    this.setFeatureConfig();
    this.setId();
    this.setName();
    this.setGitUrl();
    this.setIsRoot();
    this.setPackageJson();
  }

  private setFeatureConfig(): void {
    const featureOptionsPath = join(this.featureDir, fileNames.featureOptions);
    this.featureOptions = readJsonObjectSafely(featureOptionsPath, {});
    this.featureOptions.tsconfig =
      this.featureOptions.tsconfig && join(featureOptionsPath, this.featureOptions.tsconfig);
  }

  private setId(): void {
    if (this.featureOptions.id !== undefined) {
      this.id = this.featureOptions.id;

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
    if (this.featureOptions.name) {
      this.name = this.featureOptions.name;
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

    this.packageJson = readJsonObject(join(packageJsonParentPath, fileNames.package));
  }

  private setIsRoot(): void {
    this.isRoot = existsSync(join(this.featureDir, fileNames.showcaseOptions));
  }
}

export interface PackageJson extends Record<string, string | undefined> {
  name?: string;
  repositoryUrl?: string;
}
