import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, RouterLink],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <span class="logo">Documents App</span>

      <span class="spacer"></span>

      <button mat-button routerLink="/documents">Документы</button>
      <button mat-button routerLink="/login">Вход</button>
    </mat-toolbar>

    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
