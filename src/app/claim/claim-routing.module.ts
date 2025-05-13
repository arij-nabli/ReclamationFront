import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClaimComponent } from './add-claim/add-claim.component';
import { ClientClaimsComponent } from './client-claims/client-claims.component';
ClientClaimsComponent
const routes: Routes = [
   { path: 'add', component: AddClaimComponent },
   { path: 'cc', component: ClientClaimsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule { }
