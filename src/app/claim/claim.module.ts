import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClaimRoutingModule } from './claim-routing.module';
import { AddClaimComponent } from './add-claim/add-claim.component';
import { SideClientComponent } from './side-client/side-client.component';
import { ClientClaimsComponent } from './client-claims/client-claims.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    AddClaimComponent,
    SideClientComponent,
    ClientClaimsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,  FormsModule,
    ClaimRoutingModule,  MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule, 
  ]
})
export class ClaimModule { }
