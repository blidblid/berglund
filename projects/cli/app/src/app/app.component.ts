import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SHOWCASE_CONFIG } from '../generated/showcase';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(private title: Title) {
    this.title.setTitle(SHOWCASE_CONFIG.name);
  }
}
