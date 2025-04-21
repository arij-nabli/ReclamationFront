import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateurDetailsComponent } from './validateur-details.component';

describe('ValidateurDetailsComponent', () => {
  let component: ValidateurDetailsComponent;
  let fixture: ComponentFixture<ValidateurDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateurDetailsComponent]
    });
    fixture = TestBed.createComponent(ValidateurDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
