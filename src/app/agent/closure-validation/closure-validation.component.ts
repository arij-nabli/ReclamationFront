import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/service/claim.service';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Claim } from 'src/app/Models/Claim';

@Component({
  selector: 'app-closure-validation',
  templateUrl: './closure-validation.component.html',
  styleUrls: ['./closure-validation.component.css']
})
export class ClosureValidationComponent implements OnInit {
  claims: any[] = [];
  loading = false;
  selectedClaim: any = null;
  showDetailModal = false;
  showValidationModal = false;
  validationComment = '';
  validatorId: any;
  pageSize = 5;
  currentPage = 0;
  length = 0;
  totalPages = 0;
   filteredClaims: any;
  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.validatorId = this.authService.getUserId();
    this.loadClaimsForClosureValidation();
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
  loadClaimsForClosureValidation(): void {
    this.loading = true;
    this.claimService.getClaimsByStatus(this.validatorId, 'TreatmentByTreatmentResponsible').subscribe({
      next: (response: any) => {
        this.claims = response.$values || [];
             this.filteredClaims = [...this.claims];
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des réclamations', 'Fermer', { duration: 3000 });
      }
    });
  }
 get paginatedClaims(): Claim[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredClaims.slice(start, start + this.pageSize);
  }

  onPageSizeChange(): void {
    this.currentPage = 0; // Réinitialiser à la première page
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredClaims.length / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  goToFirstPage(): void {
    this.currentPage = 0;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages - 1;
  }
  openDetailModal(claim: any): void {
    this.selectedClaim = claim;
    this.showDetailModal = true;
  }

  openValidationModal(claim: any): void {
    this.selectedClaim = claim;
    this.validationComment = '';
    this.showValidationModal = true;
  }

  validateClosure(isApproved: boolean): void {
    if (!this.selectedClaim) {
      this.snackBar.open('Aucune réclamation sélectionnée', 'Fermer', { duration: 3000 });
      return;
    }
  
    if (!this.validationComment && !isApproved) {
      this.snackBar.open('Veuillez ajouter un commentaire pour le rejet', 'Fermer', { duration: 3000 });
      return;
    }
  
    this.loading = true;
    
    this.claimService.validateClosure(
      this.selectedClaim.id,
      isApproved,
      this.validationComment,
      this.authService.getUserId() // closureResponsibleId
    ).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(
          isApproved ? 'Clôture validée avec succès' : 'Clôture rejetée', 
          'Fermer', 
          { duration: 3000 }
        );
        this.closeModals();
        this.loadClaimsForClosureValidation();
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Erreur lors de la validation de clôture';
        this.snackBar.open(errorMessage, 'Fermer', { duration: 3000 });
      }
    });
  }

  closeModals(): void {
    this.showDetailModal = false;
    this.showValidationModal = false;
    this.selectedClaim = null;
    this.validationComment = '';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TreatmentByTreatmentResponsible': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      case 'ClosureRejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}