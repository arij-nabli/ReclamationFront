import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from './sign-in/sign-in.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
    { path: 'sign-in', component: SignInComponent },
    { path: 'forget-password', component: ForgetPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: '', redirectTo: 'sign-in', pathMatch: 'full' },  // Route par défaut pour rediriger vers 'sign-in'
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
