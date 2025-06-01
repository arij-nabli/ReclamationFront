import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/service/claim.service';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Claim } from 'src/app/Models/Claim';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { environment } from 'src/environments/environment';
environment
@Component({
  selector: 'app-closure-validation',
  templateUrl: './closure-validation.component.html',
  styleUrls: ['./closure-validation.component.css']
})
export class ClosureValidationComponent implements OnInit {
  claims: any[] = [];
  loading = false;
  selectedClaim: any = null;
  showDetailModal = false; // Potentiellement redondant si non utilisé
  showValidationModal = false;
  validationComment = '';
  validatorId: any;
  pageSize = 5;
  currentPage = 0;
  length = 0;
  totalPages = 0;
  filteredClaims: any[] = []; // Initialiser comme tableau vide

  // --- Ajouts pour la modale d'aperçu ---
  showPreviewModal = false;
  previewFileUrl: SafeResourceUrl | string = ''; // Utiliser SafeResourceUrl pour les iframes
  previewFileName: string = '';
  previewFileType: 'image' | 'pdf' | 'other' = 'other';
  // --------------------------------------

  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer // Injecter DomSanitizer
  ) {}

  ngOnInit(): void {
    this.validatorId = this.authService.getUserId();
    this.loadClaimsForClosureValidation();
  }

  // Modifié pour retourner string, ou ajuster l'appelant si severity est un objet
  getSeverityLabel(severity: any): string {
    // Si severity est un objet avec une propriété 'level' ou 'id'
    const level = typeof severity === 'object' && severity !== null ? severity.gravityCoefficient : severity;
    switch (level) {
      case 1: return 'Faible';
      case 2: return 'Moyenne';
      case 3: return 'Élevée';
      case 4: return 'Critique';
      default: return 'Non spécifiée';
    }
  }

  loadClaimsForClosureValidation(): void {
    this.loading = true;
    // Assurez-vous que cet appel API inclut bien les 'fileClaims' dans la réponse
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
    // S'assurer que filteredClaims est bien un tableau avant slice
    return Array.isArray(this.filteredClaims) ? this.filteredClaims.slice(start, start + this.pageSize) : [];
  }

  onPageSizeChange(): void {
    this.currentPage = 0; // Réinitialiser à la première page
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    // S'assurer que filteredClaims est bien un tableau
    const totalItems = Array.isArray(this.filteredClaims) ? this.filteredClaims.length : 0;
    this.totalPages = Math.ceil(totalItems / this.pageSize);
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
    this.currentPage = this.totalPages > 0 ? this.totalPages - 1 : 0;
  }

  // Inutile si non utilisé
  // openDetailModal(claim: any): void {
  //   this.selectedClaim = claim;
  //   this.showDetailModal = true;
  // }

  openValidationModal(claim: any): void {
    this.selectedClaim = claim;
    this.validationComment = '';
    this.showValidationModal = true;
  }
translateStatus(status: string): string {
  switch (status) {
     case 'Pending':
      return 'En attente';
    case 'TreatmentByTreatmentResponsible':
      return 'Traitement par le responsable du traitement';
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
  validateClosure(isApproved: boolean): void {
    if (!this.selectedClaim) {
      this.snackBar.open('Aucune réclamation sélectionnée', 'Fermer', { duration: 3000 });
      return;
    }

    // Commentaire obligatoire uniquement pour le rejet
    if (!isApproved && !this.validationComment.trim()) {
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

  // --- Méthodes pour la modale d'aperçu (copiées et adaptées) ---


  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.previewFileUrl = '';
    this.previewFileName = '';
    this.previewFileType = 'other';
  }
  // ----------------------------------------

  closeModals(): void {
    this.showDetailModal = false; // Si utilisé
    this.showValidationModal = false;
    this.closePreviewModal(); // S'assurer que la modale d'aperçu est aussi fermée
    this.selectedClaim = null;
    this.validationComment = '';
  }
 openPreviewModal(file: any): void {
  // Assurez-vous que 'file.fileId' contient le GUID (ex: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
  if (!file || !file.fileId) {
    console.error('FileId is missing for preview');
    this.snackBar.open('Impossible d\'afficher l\'aperçu : ID du fichier manquant.', 'Fermer', { duration: 3000 });
    return;
  }

  this.previewFileName = file.fileName || 'Fichier inconnu';
  // Construire l'URL vers le backend
  const backendFileUrl  = `${environment.baseUrl}/File/${file.fileId}`;

  const fileExtension = (file.fileName || '').split('.').pop()?.toLowerCase();

  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(fileExtension)) {
    this.previewFileType = 'image';
    this.previewFileUrl = backendFileUrl; // URL directe pour les images
  } else if (fileExtension === 'pdf') {
    this.previewFileType = 'pdf';
    this.previewFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(backendFileUrl); // Sécuriser pour iframe
  } else {
    this.previewFileType = 'other';
    this.previewFileUrl = backendFileUrl; // Pour le lien 'Ouvrir'
  }

  this.showPreviewModal = true;
}
  getStatusClass(status: string): string {
    switch (status) {
      case 'TreatmentByTreatmentResponsible': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      case 'ClosureRejected': return 'bg-red-100 text-red-800';
      // Ajouter d'autres statuts si nécessaire
      case 'PendingValidation': return 'bg-yellow-100 text-yellow-800'; // Statut de décision
      case 'Approved': return 'bg-green-100 text-green-800'; // Statut de décision
      case 'DecisionRejected': return 'bg-red-100 text-red-800 border border-red-200'; // Statut de décision
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
