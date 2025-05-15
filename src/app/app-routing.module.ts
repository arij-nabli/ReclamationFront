import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './AuthGuard';
import { AuthRedirectGuard } from './AuthRedirectGuard ';
import { RoleGuard } from './RoleGuard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [AuthRedirectGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard], // Double protection
    data: { roles: ['Admin'] } // Seul les admins peuvent accéder
  },
  {
    path: 'agent',
    loadChildren: () => import('./agent/agent.module').then(m => m.AgentModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Agent'] } // Seul les agents peuvent accéder
  },
  {
    path: 'claim',
    loadChildren: () => import('./claim/claim.module').then(m => m.ClaimModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Client'] } // Seul les clients peuvent accéder
  },
  { path: '', redirectTo: 'auth/sign-in', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/sign-in' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
