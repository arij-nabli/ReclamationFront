import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { AgentRoutingModule } from './agent-routing.module';
// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { DecisionPanelComponent } from './decision-panel/decision-panel.component';
import { AdminModule } from '../admin/admin.module';
import { FormsModule } from '@angular/forms';
import { AgentsidebarComponent } from './agentsidebar/agentsidebar.component';
import { ValidationDecisionComponent } from './validation-decision/validation-decision.component';
import { TreatmentPanelComponent } from './treatment-panel/treatment-panel.component';
import { ClosureValidationComponent } from './closure-validation/closure-validation.component';
import { AgentclaimComponent } from './agentclaim/agentclaim.component';


@NgModule({
  declarations: [
    AgentDashboardComponent,
    DecisionPanelComponent,
    AgentsidebarComponent,
    ValidationDecisionComponent,
    TreatmentPanelComponent,
    ClosureValidationComponent,
    AgentclaimComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgentRoutingModule,
    AdminModule,
     MatToolbarModule,
     MatCardModule,
     MatTableModule,
     MatButtonModule,
     MatIconModule,
     MatDialogModule,
     MatFormFieldModule,
     MatInputModule,
     MatSelectModule,
     MatProgressSpinnerModule,
     MatTabsModule,
     MatListModule,
     MatMenuModule
   
  ]
})
export class AgentModule { }
