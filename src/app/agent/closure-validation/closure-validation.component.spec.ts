import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosureValidationComponent } from './closure-validation.component';

describe('ClosureValidationComponent', () => {
  let component: ClosureValidationComponent;
  let fixture: ComponentFixture<ClosureValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClosureValidationComponent]
    });
    fixture = TestBed.createComponent(ClosureValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
