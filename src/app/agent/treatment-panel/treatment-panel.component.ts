import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { ClaimService } from 'src/app/service/claim.service';

@Component({
  selector: 'app-treatment-panel',
  templateUrl: './treatment-panel.component.html',
  styleUrls: ['./treatment-panel.component.css']
})
export class TreatmentPanelComponent implements OnInit {
  claims: any[] = [];
  loading = false;
  selectedClaim: any = null;
  showDetailModal = false;
  showProcessingModal = false;
  processingComment = '';
  agentId: any;

  constructor(
    private snackBar: MatSnackBar,
    private claimService: ClaimService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.agentId = this.authService.getUserId();
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading = true;
    this.claimService.getClaimsToTreat(this.agentId).subscribe({
      next: (response: any) => {
        this.claims = response.$values || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des réclamations', 'Fermer', { duration: 3000 });
      }
    });
  }

  openDetailModal(claim: any): void {
    this.selectedClaim = claim;
    this.showDetailModal = true;
  }

  startProcessing(claim: any): void {
    this.selectedClaim = claim;
    this.processingComment = '';
    this.showDetailModal = false;
    this.showProcessingModal = true;
  }

  completeProcessing(): void {
    if (!this.selectedClaim || !this.processingComment) {
      this.snackBar.open('Veuillez ajouter un commentaire', 'Fermer', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.claimService.processByTreatment(
      this.selectedClaim.id,
      this.authService.getUserId(),
      this.processingComment
    ).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Traitement terminé avec succès', 'Fermer', { duration: 3000 });
        this.closeModals();
        this.loadClaims();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du traitement', 'Fermer', { duration: 3000 });
      }
    });
  }

  closeModals(): void {
    this.showDetailModal = false;
    this.showProcessingModal = false;
    this.selectedClaim = null;
    this.processingComment = '';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getSeverityLabel(severity: number): string {
    switch (severity) {
      case 1: return 'Faible';
      case 2: return 'Moyenne';
      case 3: return 'Élevée';
      case 4: return 'Critique';
      default: return 'Non spécifiée';
    }
  }
}