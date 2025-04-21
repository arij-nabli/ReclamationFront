
import { Component, OnInit } from '@angular/core';
import { Severity } from 'src/app/Models/Severity';
import { SeverityService } from '../../adminservice/severityservice/severity.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  constructor(private severityService: SeverityService, private fb: FormBuilder,) {}

  ngOnInit(): void {
    this.loadSeverities();
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
    this.severityService.getAllSeverities().subscribe(
      (response: any) => {
      
        this.severities = response.$values || []; 
        this.filteredSeverities = [...this.severities];
    
        this.length = this.severities.length;
        this.calculateTotalPages();
        
      },
      error => {
        console.error('Erreur lors du chargement des niveaux de gravité', error);
      }
    );
  }

  // Pagination methods

  get paginatedSeverities(): Severity[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredSeverities.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.calculateTotalPages();
  }
  

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.length / this.pageSize);
  }
  
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }
  
  goToFirstPage() {
    this.currentPage = 0;
  }
  
  goToLastPage() {
    this.currentPage = this.totalPages - 1;
  }
  
  onPageSizeChange() {
    this.currentPage = 0;
    this.calculateTotalPages();
  }
 
  // CRUD operations
    addSeverity(): void {
      if (this.addSeverityForm.valid) {
        const newSeverity: Severity = this.addSeverityForm.value;
    
        this.severityService.addSeverity(newSeverity).subscribe({
          next: () => {
       
            this.showAddForm = false;
          
            this.addSeverityForm.reset({
              label: '',
              gravityCoefficient: 1
            });
            this.loadSeverities();
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout:', err);
          }
        });
      }
    }
    preventInvalidInput(event: KeyboardEvent) {
      // Bloquer e, E, +, - qui sont autorisés par défaut dans les input type="number"
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