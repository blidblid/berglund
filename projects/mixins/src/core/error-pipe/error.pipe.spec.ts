import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { BergErrorPipeModule } from './error-pipe.module';

describe('BergErrorPipe', () => {
  let fixture: ComponentFixture<ErrorPipeTestComponent>;
  let hostElement: HTMLElement;
  let componentInstance: ErrorPipeTestComponent;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [ErrorPipeTestComponent],
      imports: [BergErrorPipeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPipeTestComponent);
    hostElement = fixture.debugElement.nativeElement;
    componentInstance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not show error messages when valid', () => {
    expect(hostElement.textContent).toBe('');
  });

  it('should show error messages when invalid', () => {
    componentInstance.formControl.setValue(15);
    fixture.detectChanges();
    expect(hostElement.textContent).not.toBe('');
  });
});

@Component({
  template: '{{ error$ | async | error }}',
})
export class ErrorPipeTestComponent {
  formControl = new FormControl(5, Validators.max(10));

  error$ = this.formControl.statusChanges.pipe(
    map(() => this.formControl.errors)
  );
}
