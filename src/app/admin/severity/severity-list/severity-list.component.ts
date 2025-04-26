import { Component, OnInit } from '@angular/core';
import { Severity } from 'src/app/Models/Severity';
import { SeverityService } from '../../adminservice/severityservice/severity.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-severity-list',
  templateUrl: './severity-list.component.html',
  styleUrls: ['./severity-list.component.css']
})
export class SeverityListComponent implements OnInit {
  severities: Severity[] = [];
  filteredSeverities: Severity[] = [];
  showAddForm = false;
  showEditForm = false;
  showDeleteModal = false;
  actionMenuOpen: string | null = null;
  addSeverityForm!: FormGroup;
  showConstraintNotification = false;
constraintMessage = '';
  // Pagination
  pageSize = 5;
  currentPage = 0;
  length = 0; 
  totalPages = 0;
  
  newSeverity: Severity = {
    label: '',
    gravityCoefficient: 1
  };
  
  editSeverityData: Severity = {
    id: '',
    label: '',
    gravityCoefficient: 1
  };
  
  severityToDelete: Severity | null = null;
  editSeverityForm!: FormGroup;

  constructor(
    private severityService: SeverityService, 
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSeverities();
    this.initializeForms();
  }

  private initializeForms(): void {
    this.addSeverityForm = this.fb.group({
      label: ['', Validators.required],
      gravityCoefficient: [1, [Validators.required, Validators.min(1)]]
    });
    
    this.editSeverityForm = this.fb.group({
      label: ['', Validators.required],
      gravityCoefficient: [1, [Validators.required, Validators.min(1)]]
    });
  }

  loadSeverities(): void {
    this.severityService.getAllSeverities().subscribe({
      next: (response: any) => {
        this.severities = response.$values || []; 
        this.filteredSeverities = [...this.severities];
        this.length = this.severities.length;
        this.calculateTotalPages();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des niveaux de gravité', error);
        this.showError('Erreur lors du chargement des niveaux de gravité');
      }
    });
  }

  // Pagination methods
  get paginatedSeverities(): Severity[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredSeverities.slice(start, start + this.pageSize);
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
 
  // CRUD operations
  addSeverity(): void {
    if (this.addSeverityForm.valid) {
      const newSeverity: Severity = this.addSeverityForm.value;
  
      this.severityService.addSeverity(newSeverity).subscribe({
        next: () => {
          this.showSuccess('Niveau de gravité ajouté avec succès');
          this.showAddForm = false;
          this.addSeverityForm.reset({
            label: '',
            gravityCoefficient: 1
          });
          this.loadSeverities();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout:', err);
          this.showError(err.error?.message || 'Erreur lors de l\'ajout du niveau de gravité');
        }
      });
    }
  }

  preventInvalidInput(event: KeyboardEvent): void {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }
  
  editSeverity(severity: Severity): void {
    this.editSeverityData = { ...severity };
    this.editSeverityForm.patchValue({
      label: severity.label,
      gravityCoefficient: severity.gravityCoefficient
    });
    this.showEditForm = true;
    this.actionMenuOpen = null;
  }

  updateSeverity(): void {
    if (this.editSeverityData.id && this.editSeverityForm.valid) {
      const updatedSeverity: Severity = {
        id: this.editSeverityData.id,
        ...this.editSeverityForm.value
      };
      
      this.severityService.updateSeverity(updatedSeverity.id, updatedSeverity).subscribe({
        next: () => {
          this.showSuccess('Niveau de gravité mis à jour avec succès');
          this.loadSeverities();
          this.showEditForm = false;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.showError(err.error?.message || 'Erreur lors de la mise à jour du niveau de gravité');
        }
      });
    }
  }

  confirmDelete(severity: Severity): void {
    this.severityToDelete = severity;
    this.showDeleteModal = true;
    this.actionMenuOpen = null;
  }

  // Méthodes pour gérer la notification
private showConstraintError(message: string): void {
  this.constraintMessage = message;
  this.showConstraintNotification = true;
  

}

hideConstraintNotification(): void {
  this.showConstraintNotification = false;
}

// Modifiez la méthode deleteSeverity
deleteSeverity(): void {
  if (!this.severityToDelete?.id) return;

  this.severityService.deleteSeverity(this.severityToDelete.id).subscribe({
    next: () => {
      this.showSuccess('Niveau de gravité supprimé avec succès');
      this.loadSeverities();
      this.showDeleteModal = false;
    },
    error: (err) => {
      console.error('Erreur complète:', err);
      
      if (err.status === 500 && typeof err.error === 'string' && 
          err.error.includes('est utilisé dans des réclamations')) {
        this.showConstraintError('Impossible de supprimer : ce niveau de gravité est utilisé dans des réclamations existantes');
      } else {
        this.showError('Erreur lors de la suppression du niveau de gravité');
      }
      
      this.showDeleteModal = false;
    }
  });
}
  // UI helpers
  toggleActionMenu(id: string | undefined): void {
    this.actionMenuOpen = id ? (this.actionMenuOpen === id ? null : id) : null;
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.resetNewSeverity();
  }

  cancelEdit(): void {
    this.showEditForm = false;
  }

  resetNewSeverity(): void {
    this.newSeverity = {
      label: '',
      gravityCoefficient: 1
    };
  }

  // Notification methods
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}