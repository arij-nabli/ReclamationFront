import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ClaimetypeComponent } from './claimetype/claimetype.component';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AddClaimTypeCardComponent } from './add-claim-type-card/add-claim-type-card.component';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatSelectModule } from '@angular/material/select';  // Import pour mat-select
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditClaimTypeCardComponent } from './edit-claim-type-card/edit-claim-type-card.component';
import { FormsModule } from '@angular/forms';
import { DecideurDetailsComponent } from './components/decideur-details/decideur-details.component';
import { ValidateurDetailsComponent } from './components/validateur-details/validateur-details.component';
import { ValidateursClotureComponent } from './components/validateurs-cloture/validateurs-cloture.component';
import { SeverityListComponent } from './severity/severity-list/severity-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { MatSnackBarModule  } from '@angular/material/snack-bar';
import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [
      DashboardComponent,
    SidebarComponent,
    NavbarComponent,
    ClaimetypeComponent,
    AddClaimTypeCardComponent,
    EditClaimTypeCardComponent,
    DecideurDetailsComponent,
    ValidateurDetailsComponent,
    ValidateursClotureComponent,
    SeverityListComponent,
    ProductListComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule, HttpClientModule,MatToolbarModule,MatSnackBarModule ,
    MatSidenavModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,MatIconModule ,MatProgressSpinnerModule ,MatFormFieldModule ,MatSelectModule,MatCheckboxModule
  ],
  exports: [ // Ajoutez cette section
    NavbarComponent
  ]
})
export class AdminModule { }
