import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userMenuOpen = false;
  showMobileSearch = false;
sideMenuOpen = false;
constructor(private router: Router) {} 
  @Output() sidebarToggle = new EventEmitter<void>();
  onSidebarToggle() {
    this.sideMenuOpen = !this.sideMenuOpen;
  }
  
  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
  }
  
  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
  
  isActive(path: string): boolean {
    return this.router.isActive(path, true);
  }
  

}
