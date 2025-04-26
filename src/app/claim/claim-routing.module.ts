import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClaimComponent } from './add-claim/add-claim.component';
AddClaimComponent
const routes: Routes = [
   { path: 'add', component: AddClaimComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule { }
