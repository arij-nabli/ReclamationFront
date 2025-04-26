import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/authservice/auth.service';

@Component({
  selector: 'app-side-client',
  templateUrl: './side-client.component.html',
  styleUrls: ['./side-client.component.css']
})
export class SideClientComponent {
  constructor(private router:Router,private authService:AuthService){}
  logout() {
    this.authService.logout();
 
    this.router.navigate(['/auth/sign-in']);
  }
}
