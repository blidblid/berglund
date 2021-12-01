import { CrudApi } from '@berglund/firebase';
import { EMPTY, of } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;

export function createCrudApiSpyObj<T>(
  database: Record<string, T>
): jasmine.SpyObj<CrudApi<T>> {
  const spyObj = createSpyObj<CrudApi<T>>('CrudApi', [
    'get',
    'set',
    'getRecord',
    'getAll',
    'getMany',
    'getPage',
    'getProperty',
    'setProperty',
    'removeProperty',
    'pushProperty',
    'push',
    'update',
    'delete',
  ]);

  mockReturn(spyObj, database);
  return spyObj;
}

function mockReturn<T>(
  spyObj: jasmine.SpyObj<CrudApi<T>>,
  database: Record<string, T>
) {
  spyObj.getRecord.and.returnValue(of(database));

  spyObj.getAll.and.returnValue(of(Object.values(database)));
  spyObj.getMany.and.returnValue(of(Object.values(database)));

  spyObj.getProperty.and.returnValue(of(null));
  spyObj.get.and.returnValue(of(null));

  spyObj.getPage.and.returnValue(of([]));

  spyObj.set.and.returnValue(EMPTY);
  spyObj.delete.and.returnValue(EMPTY);
  spyObj.update.and.returnValue(EMPTY);
  spyObj.setProperty.and.returnValue(EMPTY);
  spyObj.removeProperty.and.returnValue(EMPTY);

  spyObj.push.and.returnValue('generatedId');

  for (const [key, value] of Object.entries(database)) {
    spyObj.get.withArgs(key).and.returnValue(of(value));

    if (typeof value === 'object' && value !== null) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        // jasmine does not understand that the overload can have two args
        (spyObj.getProperty as any)
          .withArgs(key, nestedKey)
          .and.returnValue(of(nestedValue));
      }
    }
  }
}
