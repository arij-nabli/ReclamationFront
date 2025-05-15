
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { DecisionPanelComponent } from './decision-panel/decision-panel.component';
import { ValidationDecisionComponent } from './validation-decision/validation-decision.component';
import { TreatmentPanelComponent } from './treatment-panel/treatment-panel.component';
import { ClosureValidationComponent } from './closure-validation/closure-validation.component';
import { AgentclaimComponent } from './agentclaim/agentclaim.component';

AgentclaimComponent

const routes: Routes = [
   { path: 'agent', component: AgentDashboardComponent },
   { path: 'decision', component: DecisionPanelComponent },
   { path: 'validation', component: ValidationDecisionComponent },
   { path: 'treatment', component: TreatmentPanelComponent },
   { path: 'closure', component: ClosureValidationComponent},
      { path: 'claims-agent', component: AgentclaimComponent},

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
