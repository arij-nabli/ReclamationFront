import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() sidebarOpen: boolean = false;

  get sidebarClasses(): string {
    return this.sidebarOpen ? 'translate-x-0' : '-translate-x-full';
  }
}
