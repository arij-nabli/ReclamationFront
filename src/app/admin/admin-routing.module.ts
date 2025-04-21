import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ClaimetypeComponent } from './claimetype/claimetype.component';
import { DecideurDetailsComponent } from './components/decideur-details/decideur-details.component';
import { ValidateursClotureComponent } from './components/validateurs-cloture/validateurs-cloture.component';
import { ValidateurDetailsComponent } from './components/validateur-details/validateur-details.component';
import { SeverityListComponent } from './severity/severity-list/severity-list.component';
import { ProductListComponent } from './product-list/product-list.component';


const routes: Routes = [
  { path: 'validateurs-cloture/:id', component: ValidateursClotureComponent },
     { path: 'AdminDashbord', component: DashboardComponent },
        { path: 'claimetype', component: ClaimetypeComponent },
        { path: 'product', component: ProductListComponent},
        { path: 'sevirity', component: SeverityListComponent},
        { path: 'decideurs/:id', component: DecideurDetailsComponent },
        { path: 'validateurs/:id', component: ValidateurDetailsComponent},
    ];
  


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
