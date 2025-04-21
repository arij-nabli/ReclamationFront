
import { Component, OnInit } from '@angular/core';
import { Severity } from 'src/app/Models/Severity';
import { SeverityService } from '../../adminservice/severityservice/severity.service';

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
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 1;
  
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

  constructor(private severityService: SeverityService) {}

  ngOnInit(): void {
    this.loadSeverities();
  }
  loadSeverities(): void {
    this.severityService.getAllSeverities().subscribe(
      (response: any) => {
        console.log('API Response:', response);
       this.severities = response.$values || []; 
       this.filteredSeverities = [...this.severities];
       this.updatePagination();
      },
      error => {
        console.error('Erreur lors du chargement des claim types', error);
      }
    );
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredSeverities.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages - 1);
  }

  get paginatedSeverities(): Severity[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredSeverities.slice(start, start + this.pageSize);
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.updatePagination();
  }

  goToFirstPage(): void {
    this.currentPage = 0;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages - 1;
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

  // CRUD operations
  addSeverity(): void {
    this.severityService.addSeverity(this.newSeverity).subscribe({
      next: () => {
        this.loadSeverities();
        this.showAddForm = false;
        this.resetNewSeverity();
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
      }
    });
  }

  editSeverity(severity: Severity): void {
    this.editSeverityData = { ...severity };
    this.showEditForm = true;
    this.actionMenuOpen = null;
  }

  updateSeverity(): void {
    if (this.editSeverityData.id) {
      this.severityService.updateSeverity(this.editSeverityData.id, this.editSeverityData).subscribe({
        next: () => {
          this.loadSeverities();
          this.showEditForm = false;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
        }
      });
    }
  }

  confirmDelete(severity: Severity): void {
    this.severityToDelete = severity;
    this.showDeleteModal = true;
    this.actionMenuOpen = null;
  }

  deleteSeverity(): void {
    if (this.severityToDelete?.id) {
      this.severityService.deleteSeverity(this.severityToDelete.id).subscribe({
        next: () => {
          this.loadSeverities();
          this.showDeleteModal = false;
          this.severityToDelete = null;
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
        }
      });
    }
  }

  // UI helpers
// severity-list.component.ts
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
}