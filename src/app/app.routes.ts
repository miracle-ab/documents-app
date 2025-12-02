import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { DocumentsListComponent } from './features/documents/documents-list/documents-list';
import { DocumentDetailsComponent } from './features/documents/document-details/document-details';
import { loginGuard } from './core/guards/login-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'documents',
    component: DocumentsListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'documents/:id',
    component: DocumentDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'documents',
  },
  {
    path: '**',
    redirectTo: 'documents',
  },
];
