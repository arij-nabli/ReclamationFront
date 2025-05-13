import { Component ,OnInit} from '@angular/core';
import { Claim } from 'src/app/Models/Claim';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/Models/Product';
import { ClaimType } from 'src/app/Models/ClaimType';
import { Severity } from 'src/app/Models/Severity';
import { ClaimService } from 'src/app/service/claim.service';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { FormArray } from '@angular/forms';
@Component({
  selector: 'app-client-claims',
  templateUrl: './client-claims.component.html',
  styleUrls: ['./client-claims.component.css']
})
export class ClientClaimsComponent implements OnInit {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  isLoading = true;
  clientId: string | null = null;
  selectedClaim: any = null;
  selectedTreatmentClaim: Claim | null = null;
  selectedClosureClaim: Claim | null = null;
  pageSize = 6;
  currentPage = 0;
  length = 0;
  totalPages = 0;
 
  showDecisionModal = false;
  showTreatmentModal = false;
  showClosureModal = false;
  constructor(
    private claimService: ClaimService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.clientId = this.authService.getUserId();
    if (!this.clientId) return;
    this.loadClaims();
  }
  openDetailsModal(claim: Claim): void {
    this.selectedClaim = claim;
  }
  loadClaims(): void {
    this.isLoading = true;
    this.claimService.getClaimsByClientId(this.clientId!).subscribe({
      next: (response: any) => {
        this.claims = response.$values || [];
        console.log(response.$values )
        this.filteredClaims = [...this.claims];
        this.length = this.claims.length;
        this.calculateTotalPages();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading claims:', error);
        this.isLoading = false;
      }
    });
  }

  get paginatedClaims(): Claim[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredClaims.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.length / this.pageSize);
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

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.calculateTotalPages();
  }

  // Methods for custom fields
  hasCustomFields(claim: Claim): boolean {
    return !!claim.customFieldsJson && claim.customFieldsJson !== '{}';
  }

  getCustomFields(claim: Claim): {key: string, value: string}[] {
    if (!this.hasCustomFields(claim)) return [];
    
    try {
      const customFields = JSON.parse(claim.customFieldsJson || '{}');
      return Object.entries(customFields).map(([key, value]) => ({
        key,
        value: value !== null && value !== undefined ? String(value) : '-'
      }));
    } catch {
      return [];
    }
  }

  getSeverityLabel(severity: Severity): string {
    return severity ? `${severity.label} (Niv.${severity.gravityCoefficient})` : '-';
  }
  openDecisionModal(claim: Claim): void {
    this.selectedClaim = claim;
    this.showDecisionModal = true;
  }

  openTreatmentModal(claim: Claim): void {
    this.selectedClaim = claim;
    this.showTreatmentModal = true;
  }

  openClosureModal(claim: Claim): void {
    this.selectedClaim = claim;
    this.showClosureModal = true;
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'DecisionValidated': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      default: return '';
    }
  }
  // Ajouter cette méthode à votre composant
getSeverityClass(severity: any): string {
  if (!severity) return 'bg-gray-100 text-gray-800';
  
  switch (severity.gravityCoefficient) {
    case 1: return 'bg-green-100 text-green-800';
    case 2: return 'bg-blue-100 text-blue-800';
    case 3: return 'bg-yellow-100 text-yellow-800';
    case 4: return 'bg-orange-100 text-orange-800';
    case 5: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
}