import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminModule } from './admin/admin.module';
import { ClaimModule } from './claim/claim.module';
import { AgentModule } from './agent/agent.module';
import {  ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    AgentModule,
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    AuthModule,
    BrowserAnimationsModule,
    AdminModule ,
   ClaimModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
