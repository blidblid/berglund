import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BergTableComponent } from './table.component';

describe('BergTableComponent', () => {
  let component: BergTableComponent;
  let fixture: ComponentFixture<BergTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BergTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BergTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
