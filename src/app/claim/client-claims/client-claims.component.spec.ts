import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientClaimsComponent } from './client-claims.component';

describe('ClientClaimsComponent', () => {
  let component: ClientClaimsComponent;
  let fixture: ComponentFixture<ClientClaimsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientClaimsComponent]
    });
    fixture = TestBed.createComponent(ClientClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
