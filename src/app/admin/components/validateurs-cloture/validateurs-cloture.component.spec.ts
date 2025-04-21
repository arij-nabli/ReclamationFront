import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateursClotureComponent } from './validateurs-cloture.component';

describe('ValidateursClotureComponent', () => {
  let component: ValidateursClotureComponent;
  let fixture: ComponentFixture<ValidateursClotureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateursClotureComponent]
    });
    fixture = TestBed.createComponent(ValidateursClotureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
