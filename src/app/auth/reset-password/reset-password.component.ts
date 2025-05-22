import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../authservice/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  token: string | null = null;
  email: string | null = null;
  hide1 = true;
  hide2 = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Récupérer le token et l'email depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      
      if (!this.token || !this.email) {
        this.errorMessage = 'Lien de réinitialisation invalide ou expiré.';
        setTimeout(() => {
          this.router.navigate(['/auth/sign-in']);
        }, 3000);
      }
    });
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.token || !this.email) {
      return;
    }

    if (this.resetPasswordForm.value.password !== this.resetPasswordForm.value.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.resetPassword(
      this.email,
      this.token,
      this.resetPasswordForm.value.password
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open(
          'Votre mot de passe a été réinitialisé avec succès.',
          'Fermer',
          { duration: 5000 }
        );
        this.router.navigate(['/auth/sign-in']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la réinitialisation:', error);
        if (error.error && error.error.errors) {
          // Afficher les erreurs de validation spécifiques
          const errorMessages = [];
          for (const key in error.error.errors) {
            errorMessages.push(error.error.errors[key].join(', '));
          }
          this.errorMessage = errorMessages.join('\n');
        } else {
          this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.';
        }
      }
    });
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get password() { return this.resetPasswordForm.get('password'); }
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword'); }
}
