import { existsSync } from 'fs';
import { directories, fileNames } from '../../../core/constants';
import { join, resolve } from '../../../core/path';
import { capitalize, readJsonObjectSafely } from '../../../core/util';
import { ValidatedShowcaseConfig } from '../core/read';
import { FeatureConfig } from '../schemas/feature/schema';

export class Context {
  protected userIds = new Set<string>();
  protected generatedIds = new Set<string>();

  id: string;
  name: string;
  isRoot: boolean;
  featureConfig: FeatureConfig;
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
  }

  private setFeatureConfig(): void {
    const featureConfigPath = join(this.featureDir, fileNames.featureConfig);
    this.featureConfig = readJsonObjectSafely(featureConfigPath, {});
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
    const gitParentDir = this.findGitParentDir();

    if (!gitParentDir) {
      return;
    }

    this.relativeGitUrl = this.featureDir.replace(gitParentDir, '');
  }

  private findGitParentDir(): string | null {
    let searchGitAt = this.featureDir;

    while (searchGitAt) {
      if (existsSync(join(searchGitAt, directories.git))) {
        return searchGitAt;
      }

      searchGitAt = resolve(join(searchGitAt, '..'));
    }

    return null;
  }

  private setIsRoot(): void {
    this.isRoot =
      existsSync(join(this.featureDir, fileNames.package)) ||
      existsSync(join(this.featureDir, fileNames.showcaseConfig));
  }
}
