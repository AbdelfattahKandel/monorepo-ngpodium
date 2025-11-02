import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface SidebarLink {
  icon: string;
  label: string;
  description?: string;
  route?: string;
}

@Component({
  selector: 'ngpodium-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  readonly links = input<SidebarLink[]>([
    { icon: 'pi pi-home', label: 'Home', route: '/' },
    { icon: 'pi pi-book', label: 'Library' },
    { icon: 'pi pi-user', label: 'Profile' },
    { icon: 'pi pi-file', label: 'Stories' },
    { icon: 'pi pi-chart-bar', label: 'Stats' }
  ]);


  // Controls the off-canvas visibility on small screens
  readonly open = input<boolean>(false);

  // Emit when user taps the top hamburger to close the drawer
  readonly close = output<void>();

  onToggle(): void {
    this.close.emit();
  }
}
