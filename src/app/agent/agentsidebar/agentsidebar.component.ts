import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/authservice/auth.service';

@Component({
  selector: 'app-agentsidebar',
  templateUrl: './agentsidebar.component.html',
  styleUrls: ['./agentsidebar.component.css']
})
export class AgentsidebarComponent{
  constructor(private router:Router,private authService:AuthService){}
  logout() {
    this.authService.logout();
 
    this.router.navigate(['/auth/sign-in']);
  }
}
