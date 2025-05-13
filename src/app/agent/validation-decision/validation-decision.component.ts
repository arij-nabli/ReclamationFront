import { Component ,OnInit} from '@angular/core';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClaimService } from 'src/app/service/claim.service';
import { AgentserviceService } from 'src/app/admin/adminservice/agentservice/agentservice.service';

@Component({
  selector: 'app-validation-decision',
  templateUrl: './validation-decision.component.html',
  styleUrls: ['./validation-decision.component.css']
})
export class ValidationDecisionComponent implements OnInit {
  decisions: any[] = [];
  loading = false;
  selectedDecision: any = null;
  showDetailModal = false;
  showValidationModal = false;
  validationComment = '';
  agentId: any;
  treatmentResponsibleName: string = 'Chargement...';
  treatmentResponsibleEmail: string = '';
  selectedResponsible: any = null;
  treatmentResponsibles: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private decisionService: ClaimService,
    private authService: AuthService,
    private agentService: AgentserviceService
  ) {}

  ngOnInit(): void { 
    this.agentId = this.authService.getUserId();
    this.loadDecisions();
    this.loadTreatmentResponsibles();
  }

  loadDecisions(): void {
    this.loading = true;
    this.decisionService.getClaimsToValidate(this.agentId).subscribe({
      next: (response: any) => {
        this.decisions = response.$values || [];
        console.log(this.decisions)
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des décisions', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadTreatmentResponsibles(): void {
    this.agentService.getAgents().subscribe({
      next: (agents) => {
        this.treatmentResponsibles = agents;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des responsables', 'Fermer', { duration: 3000 });
      }
    });
  }

  openDetailModal(decision: any): void {
    this.selectedDecision = decision;
    this.showDetailModal = true;
    
    
  }

  openValidationModal(decision: any): void {
    this.selectedDecision = decision;
    this.validationComment = '';
    this.showValidationModal = true;
    
    if (decision.treatmentResponsibleId) {
      this.loadTreatmentResponsible(decision.treatmentResponsibleId);
    } else {
      this.treatmentResponsibleName = 'Non assigné';
      this.treatmentResponsibleEmail = '';
    }
  }

  loadTreatmentResponsible(userId: string): void {
    this.agentService.getUserById(userId).subscribe({
      next: (user) => {
        this.treatmentResponsibleName = `${user.firstName} ${user.lastName}`;
        this.treatmentResponsibleEmail = user.email || '';
      },
      error: () => {
        this.treatmentResponsibleName = 'Non disponible';
        this.treatmentResponsibleEmail = '';
      }
    });
  }

validateDecision(isApproved: boolean): void {
  if (!this.selectedDecision) {
      this.snackBar.open('Aucune décision sélectionnée', 'Fermer', { duration: 3000 });
      return;
  }

  this.loading = true;
  
  this.decisionService.validateDecision(
      this.selectedDecision.id, // claimId en premier paramètre
      this.authService.getUserId(), // validatorId
      isApproved, // isApproved
      this.validationComment // validationComments (optionnel)
  ).subscribe({
      next: (response) => {
          this.loading = false;
          this.snackBar.open(
              isApproved ? 'Décision validée avec succès' : 'Décision rejetée avec succès', 
              'Fermer', 
              { duration: 3000 }
          );
          this.closeModals();
          this.loadDecisions(); // Rafraîchir la liste
      },
      error: (error) => {
          this.loading = false;
          console.error('Erreur:', error);
          this.snackBar.open(
              error.error?.message || 'Erreur lors de la validation', 
              'Fermer', 
              { duration: 3000 }
          );
      }
  });
}

  closeModals(): void {
    this.showDetailModal = false;
    this.showValidationModal = false;
    this.selectedDecision = null;
    this.validationComment = '';
    this.selectedResponsible = null;
  }

  getDecisionClass(status: string): string {
    switch (status) {
      case 'PendingValidation': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}