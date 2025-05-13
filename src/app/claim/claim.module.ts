import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClaimRoutingModule } from './claim-routing.module';
import { AddClaimComponent } from './add-claim/add-claim.component';
import { SideClientComponent } from './side-client/side-client.component';
import { ClientClaimsComponent } from './client-claims/client-claims.component';

@NgModule({
  declarations: [
    AddClaimComponent,
    SideClientComponent,
    ClientClaimsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,  FormsModule,
    ClaimRoutingModule
  ]
})
export class ClaimModule { }
