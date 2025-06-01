import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAgentComponent } from './nav-agent.component';

describe('NavAgentComponent', () => {
  let component: NavAgentComponent;
  let fixture: ComponentFixture<NavAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavAgentComponent]
    });
    fixture = TestBed.createComponent(NavAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
