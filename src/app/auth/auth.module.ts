import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    SignInComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    
  ],
  imports: [
    CommonModule,  ReactiveFormsModule,AuthRoutingModule,MatButtonModule,MatSnackBarModule,
    MatFormFieldModule,MatInputModule,MatProgressSpinnerModule,MatIconModule ,MatCheckboxModule

    
  ]
})
export class AuthModule { }
