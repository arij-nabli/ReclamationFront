import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './AuthGuard';
import { AuthRedirectGuard } from './AuthRedirectGuard ';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [AuthRedirectGuard] // 🚀 ajout ici
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard] 
  },
  { path: '', redirectTo: 'auth/sign-in', pathMatch: 'full' },
  {
    path: 'agent',
    loadChildren: () => import('./agent/agent.module').then(m => m.AgentModule)
  },
  {
    path: 'claim',
    loadChildren: () => import('./claim/claim.module').then(m => m.ClaimModule),
  
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
