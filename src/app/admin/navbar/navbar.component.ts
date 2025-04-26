import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/authservice/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userMenuOpen = false;
  showMobileSearch = false;
sideMenuOpen = false;
username: string = '';
constructor(private authService: AuthService,private router: Router) {
  const user = this.authService.getCurrentUser();
  if (user) {
    this.username = user.username;
    console.log(this.username) // Adapte selon la structure de ton objet utilisateur
  }
} 
  @Output() sidebarToggle = new EventEmitter<void>();
  onSidebarToggle() {
    this.sideMenuOpen = !this.sideMenuOpen;
  }
  
  
  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
  }
  logout(): void {
    this.authService.logout();
    console.log(this.authService.logout())
    this.router.navigate(['/auth/sign-in']);
  }
  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
  
  isActive(path: string): boolean {
    return this.router.isActive(path, true);
  }
  

}
