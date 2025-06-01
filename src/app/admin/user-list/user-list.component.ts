import { Component ,OnInit} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentserviceService } from '../adminservice/agentservice/agentservice.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  showAddForm = false;
  showEditForm = false;
  showDeleteModal = false;
  userToDelete: any;
  currentPage = 0;
  pageSize = 10;
  searchTerm = '';
  selectedRole = 'all';
  actionMenuOpen: string | null = null;

  addUserForm: FormGroup;
  editUserForm: FormGroup;

  // Notifications
  showSuccessNotification = false;
  showErrorNotification = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: AgentserviceService,
    private fb: FormBuilder
  ) {
    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      password: ['']
    });

    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

loadUsers(): void {
  this.userService.getAgentsAndClients().subscribe({
    next: (response: any) => {
      // Extraction du tableau des utilisateurs depuis la propriété $values
      this.users = response.$values || [];
     
    },
    error: (err) => {
      console.error('Error loading users:', err);
    
    }
  });
}
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = 
        this.selectedRole === 'all' || 
        user.role.toLowerCase() === this.selectedRole.toLowerCase();
      
      return matchesSearch && matchesRole;
    });
    
    this.currentPage = 0; // Reset to first page after filtering
  }

  get paginatedUsers(): any[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goToFirstPage(): void {
    this.currentPage = 0;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages - 1;
  }

  addUser(): void {
    if (this.addUserForm.invalid) return;

    const formValue = this.addUserForm.value;
    this.userService.registerUser(formValue).subscribe({
      next: () => {
        this.showSuccess('Utilisateur créé avec succès');
        this.loadUsers();
        this.showAddForm = false;
        this.addUserForm.reset();
      },
      error: (err) => {
        this.showError(err.error.message || 'Erreur lors de la création');
      }
    });
  }

  editUser(user: any): void {
    this.showEditForm = true;
    this.editUserForm.patchValue({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
    this.userToDelete = user; // Réutilisé pour l'édition
  }

  updateUser(): void {
    if (this.editUserForm.invalid) return;

    const userId = this.userToDelete.id;
    const formValue = this.editUserForm.value;
    
    this.userService.modifyUser(userId, formValue).subscribe({
      next: () => {
        this.showSuccess('Utilisateur modifié avec succès');
        this.loadUsers();
        this.showEditForm = false;
      },
      error: (err) => {
        this.showError(err.error.message || 'Erreur lors de la modification');
      }
    });
  }

  confirmDelete(user: any): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  deleteUser(): void {
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.showSuccess('Utilisateur supprimé avec succès');
        this.loadUsers();
        this.showDeleteModal = false;
      },
      error: (err) => {
        this.showError(err.error.message || 'Erreur lors de la suppression');
      }
    });
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.addUserForm.reset();
  }

  cancelEdit(): void {
    this.showEditForm = false;
  }

  toggleActionMenu(userId: string): void {
    this.actionMenuOpen = this.actionMenuOpen === userId ? null : userId;
  }

  // Méthodes de notification
  showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessNotification = true;
    setTimeout(() => this.hideSuccessNotification(), 5000);
  }

  hideSuccessNotification(): void {
    this.showSuccessNotification = false;
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorNotification = true;
    setTimeout(() => this.hideErrorNotification(), 5000);
  }

  hideErrorNotification(): void {
    this.showErrorNotification = false;
  }
}