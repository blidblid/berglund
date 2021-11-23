import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  template: '<ng-container #viewContainerRef></ng-container>',
})
export class MixinComponentTesterComponent {
  @ViewChild('viewContainerRef', { read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;
}
