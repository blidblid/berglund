import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { of } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;

export function createSignInAngularFireAuthSpyObj(
  userCredential: firebase.auth.UserCredential
): jasmine.SpyObj<AngularFireAuth> {
  const spyObj = createSpyObj<AngularFireAuth>('AngularFireAuth', [
    'signInAnonymously',
    'signInWithCredential',
    'signInWithEmailLink',
    'signInWithPopup',
    'signInWithEmailAndPassword',
    'user',
  ]);

  const userCredentialPromise = Promise.resolve(userCredential);

  spyObj.signInAnonymously.and.returnValue(userCredentialPromise);
  spyObj.signInWithCredential.and.returnValue(userCredentialPromise);
  spyObj.signInWithEmailLink.and.returnValue(userCredentialPromise);
  spyObj.signInWithPopup.and.returnValue(userCredentialPromise);
  spyObj.signInWithEmailAndPassword.and.returnValue(userCredentialPromise);

  (spyObj as any).user = of(userCredential.user);

  return spyObj;
}
