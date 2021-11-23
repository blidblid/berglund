import { MixinComponentTester } from './mixin-component-tester';
import {
  MixinComponentSpec,
  QueriesDomChange,
} from './mixin-component-tester-model';

export function testComponentInputs<T>(
  mixinComponentTester: MixinComponentTester<T>,
  specs: MixinComponentSpec<T>[]
): void {
  for (const spec of specs) {
    mixinComponentTester.withInputs(spec.givenInputs);

    for (const [api, args] of Object.entries(spec.thenDomChange)) {
      mixinComponentTester[api as keyof QueriesDomChange](
        ...(args as [any, any])
      );
    }
  }
}
