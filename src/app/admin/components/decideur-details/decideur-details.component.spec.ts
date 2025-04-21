import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecideurDetailsComponent } from './decideur-details.component';

describe('DecideurDetailsComponent', () => {
  let component: DecideurDetailsComponent;
  let fixture: ComponentFixture<DecideurDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecideurDetailsComponent]
    });
    fixture = TestBed.createComponent(DecideurDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
