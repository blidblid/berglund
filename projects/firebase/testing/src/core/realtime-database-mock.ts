import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { of } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;

export function createReadonlyAngularFireDatabaseSpyObj(
  database: Record<string, any>
): jasmine.SpyObj<AngularFireDatabase> {
  const spyObj = createSpyObj<AngularFireDatabase>('AngularFireDatabase', [
    'object',
    'list',
    'createPushId',
  ]);

  mockDatabase(spyObj, database);

  return spyObj;
}

function mockDatabase(
  spyObj: jasmine.SpyObj<AngularFireDatabase>,
  database: Record<string, any>,
  pathPrefix = ''
) {
  for (const [key, value] of Object.entries(database)) {
    const path = `${pathPrefix}${key}`;

    mockDatabaseReturn(spyObj, path, value);

    if (typeof value === 'object' && value !== null) {
      mockDatabase(spyObj, value, `${path}/`);
    }
  }
}

function mockDatabaseReturn(
  spyObj: jasmine.SpyObj<AngularFireDatabase>,
  key: string,
  value: any
) {
  spyObj.object.withArgs(key).and.returnValue({
    valueChanges: () => of(value),
  } as AngularFireObject<any>);

  spyObj.list.withArgs(key).and.returnValue({
    valueChanges: () => of(value),
  } as AngularFireList<any>);
}
