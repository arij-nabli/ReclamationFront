import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationDecisionComponent } from './validation-decision.component';

describe('ValidationDecisionComponent', () => {
  let component: ValidationDecisionComponent;
  let fixture: ComponentFixture<ValidationDecisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationDecisionComponent]
    });
    fixture = TestBed.createComponent(ValidationDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
