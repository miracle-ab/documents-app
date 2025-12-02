import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { DocumentsListComponent } from './features/documents/documents-list/documents-list';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'documents', component: DocumentsListComponent },
  { path: '', pathMatch: 'full', redirectTo: 'documents' },
  { path: '**', redirectTo: 'documents' },
];
