import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../authservice/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open(
          'Un email de réinitialisation a été envoyé à votre adresse email.',
          'Fermer',
          { duration: 5000 }
        );
        // Optionnel : rediriger vers la page de connexion après quelques secondes
        setTimeout(() => {
          this.router.navigate(['/auth/sign-in']);
        }, 5000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la réinitialisation:', error);
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la demande de réinitialisation.';
      }
    });
  }

  // Getter pour faciliter l'accès au contrôle du formulaire
  get email() { return this.forgotPasswordForm.get('email'); }
}
