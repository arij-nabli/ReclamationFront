import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClaimService } from 'src/app/service/claim.service';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Claim } from 'src/app/Models/Claim';

@Component({
  selector: 'app-agentclaim',
  templateUrl: './agentclaim.component.html',
  styleUrls: ['./agentclaim.component.css']
})
export class AgentclaimComponent implements OnInit {
  claims: any[] = [];
  loading = false;

  agentId: string = '';
  selectedClaim: any = null;
  showDetailModal = false;
  showRejectionModal = false;
  pageSize = 5;
  currentPage = 0;
  length = 0;
  totalPages = 0;
   filteredClaims: Claim[] = [];
  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.agentId = this.authService.getUserId();
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading = true;
    this.claimService.getClaims(this.agentId).subscribe({
      next: (response: any) => {
        this.claims = response.$values || [];
        this.filteredClaims = [...this.claims];
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading claims', err);
        this.snackBar.open('Erreur lors du chargement des réclamations', 'Fermer', { duration: 3000 });
        this.loading = false;
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

  openRejectionModal(claim: any): void {
    this.selectedClaim = claim;
    this.showRejectionModal = true;
  }

  closeModals(): void {
    this.showDetailModal = false;
    this.showRejectionModal = false;
    this.selectedClaim = null;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'TreatmentByDecider':
      case 'TreatmentByTreatmentResponsible': return 'bg-blue-100 text-blue-800';
      case 'DecisionValidated': return 'bg-green-100 text-green-800';
       case 'Closed': return 'bg-green-600 text-green-100';
      case 'DecisionRejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
translateStatus(status: string): string {
  switch (status) {
     case 'Pending':
      return 'En attente';
    case 'TreatmentByDecider':
      return 'Traitement par le décideur';
    case 'DecisionValidated':
      return 'Décision validée';
    case 'Closed':
      return 'Fermée';
    case 'Rejected':
      return 'Rejetée';
    // Ajoute les autres statuts selon ta logique métier
    default:
      return status; // Affiche la valeur brute si aucune traduction trouvée
  }
}
  getStatusLabel(status: string): string {
    const statusLabels: {[key: string]: string} = {
      'Pending': 'En attente',
      'TreatmentByDecider': 'En traitement',
      'TreatmentByTreatmentResponsible': 'En traitement',
      'DecisionValidated': 'Validée',
      'DecisionRejected': 'Rejetée'
    };
    return statusLabels[status] || status;
  }
}