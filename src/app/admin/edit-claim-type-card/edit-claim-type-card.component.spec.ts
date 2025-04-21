import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaimTypeCardComponent } from './edit-claim-type-card.component';

describe('EditClaimTypeCardComponent', () => {
  let component: EditClaimTypeCardComponent;
  let fixture: ComponentFixture<EditClaimTypeCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditClaimTypeCardComponent]
    });
    fixture = TestBed.createComponent(EditClaimTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
