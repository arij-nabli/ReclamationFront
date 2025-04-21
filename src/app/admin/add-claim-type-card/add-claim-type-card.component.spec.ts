import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimTypeCardComponent } from './add-claim-type-card.component';

describe('AddClaimTypeCardComponent', () => {
  let component: AddClaimTypeCardComponent;
  let fixture: ComponentFixture<AddClaimTypeCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddClaimTypeCardComponent]
    });
    fixture = TestBed.createComponent(AddClaimTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
