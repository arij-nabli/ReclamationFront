import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentclaimComponent } from './agentclaim.component';

describe('AgentclaimComponent', () => {
  let component: AgentclaimComponent;
  let fixture: ComponentFixture<AgentclaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentclaimComponent]
    });
    fixture = TestBed.createComponent(AgentclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
