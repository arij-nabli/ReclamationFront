import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentserviceService } from 'src/app/admin/adminservice/agentservice/agentservice.service';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { ClaimService } from 'src/app/service/claim.service';

ClaimService
@Component({
  selector: 'app-decision-panel',
  templateUrl: './decision-panel.component.html',
  styleUrls: ['./decision-panel.component.css']
})
export class DecisionPanelComponent implements OnInit {
  claims: any[] = [];
  loading = false;
  loadingAgents = false;
  agentId: any;
  selectedClaim: any = null;
  showModal = false;
  treatmentResponsibles: any[] = [];
  selectedResponsible: string = ''; // Initialize with empty string
  decisionComment: string = ''; // Initialize with empty string
  showDetailModal = false;
  showDecisionModal = false;
  showRejectionDetailsModal = false;
  constructor(
    private snackBar: MatSnackBar,
    private claimService: ClaimService,
    private authService: AuthService,
    private agentService: AgentserviceService
  ) {}

  ngOnInit(): void {
    this.agentId = this.authService.getUserId();
    this.loadClaims();
  }

  openModal(claim: any): void {
    this.selectedClaim = claim;
    this.showModal = true;
    this.loadTreatmentResponsibles();
  }
  openRejectionDetailsModal(claim: any): void {
    this.selectedClaim = claim;
    this.showRejectionDetailsModal = true;
  }
  loadTreatmentResponsibles(mode: 'assigner' | 'changer' = 'assigner'): void {
    this.loadingAgents = true;
    
    this.agentService.getAgents().subscribe({
      next: (agents: any) => {
        this.treatmentResponsibles = agents?.$values || [];
        
        // En mode "changer", on pourrait filtrer les agents disponibles
        if (mode === 'changer') {
          // Par exemple, exclure l'agent actuellement assigné
          this.treatmentResponsibles = this.treatmentResponsibles.filter(agent => 
            agent.id !== this.selectedClaim.treatmentResponsibleId
          );
        }
        
        this.loadingAgents = false;
      },
      error: (err) => {
        console.error('Erreur chargement agents', err);
        this.snackBar.open('Erreur lors du chargement des agents', 'Fermer', { duration: 3000 });
        this.loadingAgents = false;
      }
    });
  }
  processDecision(isApproved: boolean): void {
    // Vérification que selectedClaim existe
    if (!this.selectedClaim || !this.selectedResponsible) {
      this.snackBar.open('Veuillez sélectionner un responsable de traitement', 'Fermer', { duration: 3000 });
      return;
    }
  
    const decisionText = isApproved 
      ? 'Réclamation approuvée' + (this.decisionComment ? ` - ${this.decisionComment}` : '')
      : 'Réclamation rejetée' + (this.decisionComment ? ` - ${this.decisionComment}` : '');
  
    this.claimService.processClaimByDecider(
      this.selectedClaim.id, // Maintenant protégé par la vérification
      this.agentId,
      this.selectedResponsible,
      decisionText
    ).subscribe({
      next: () => {
        this.snackBar.open(`Réclamation ${isApproved ? 'approuvée' : 'rejetée'} avec succès`, 'Fermer', { duration: 3000 });
        this.closeModals();
        this.loadClaims();
      },
      error: (err) => {
        console.error('Erreur traitement décision', err);
        this.snackBar.open('Erreur lors du traitement de la décision', 'Fermer', { duration: 3000 });
      }
    });
  }
  openDetailModal(claim: any): void {
    this.selectedClaim = claim;
    this.showDetailModal = true;
  }

  openDecisionModal(claim: any): void {
    this.selectedClaim = claim;
    this.showDecisionModal = true;
    this.loadTreatmentResponsibles();
  }
  closeModals(): void {
    this.showDetailModal = false;
    this.showDecisionModal = false;
    this.showRejectionDetailsModal = false;
    this.selectedClaim = null;
    this.decisionComment = '';
    this.selectedResponsible = '';
  }
  closeModal(): void {
    this.showModal = false;
    this.selectedResponsible = '';
    this.decisionComment = '';
    this.selectedClaim = null;
  }

  loadClaims(): void {
    this.loading = true;
    this.claimService.getPendingClaims(this.agentId).subscribe({
      next: (response: any) => {
        this.claims = response.$values || [];
        console.log( this.claims);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des réclamations', 'Fermer', { duration: 3000 });
      }
    });
  }

  getSeverityLabel(severity: any): string {
    if (!severity) return 'Non spécifiée';
    return `${severity.label} (Niveau ${severity.gravityCoefficient})`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'DecisionRejected': 
      return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}