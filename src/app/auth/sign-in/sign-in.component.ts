import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../authservice/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  hide = true; // Pour masquer/afficher le mot de passe
  loginForm: FormGroup;
  isLoading = false; // État de chargement
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false] // Ajout du champ rememberMe
    });
  }

  // Soumission du formulaire
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    this.errorMessage = null;
    this.isLoading = true;
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
  
    this.authService.signIn(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
  
        // Sauvegarder le token
        localStorage.setItem('token', response.token);
  
        // Sauvegarder l'email si rememberMe est coché
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('rememberedEmail', this.loginForm.value.email);
        }
  
        // Décoder le token pour obtenir le rôle
        const decodedToken = this.decodeToken(response.token);
  
        if (decodedToken && decodedToken.role) {
          const role = decodedToken.role;
  
          if (role === 'Admin') {
            this.router.navigate(['admin/AdminDashbord']);
          } else if (role === 'Client') {
            this.router.navigate(['claim/add']);
          } 
          else if (role === 'Agent') {
            this.router.navigate(['agent/decision']);
          }else {
            this.errorMessage = 'Rôle utilisateur inconnu.';
          }
        } else {
          this.errorMessage = 'Impossible de déterminer le rôle.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error.error);
  
        const errorMessage = error.error;
  
        if (errorMessage.includes('incorrect password') || errorMessage.includes('Invalid credentials')) {
          this.errorMessage = 'Mot de passe incorrect.';
        } else if (errorMessage.includes('not found') || errorMessage.includes('email')) {
          this.errorMessage = 'Adresse email introuvable.';
        } else {
          this.errorMessage = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
        }
      }
    });
  }
  
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1]; // La 2e partie du token contient les infos
      const decodedPayload = atob(payload); // Décodage base64
      return JSON.parse(decodedPayload); // Conversion en objet
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }
  // Affichage des messages d'erreur
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // Gestion des erreurs de formulaire
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }

  ngOnInit(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.patchValue({
        email: rememberedEmail,
        rememberMe: true
      });
    }
  }
}