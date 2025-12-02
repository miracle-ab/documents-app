import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Document } from '../models/document.model';
import { User } from '../models/user.model';
import documentsJson from '../../../assets/mock/documents.json';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface DocumentsQuery {
  search?: string;
  page: number;
  pageSize: number;
  sortField?: keyof Document;
  sortDirection?: 'asc' | 'desc';
}

export interface DocumentsListResponse {
  items: Document[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class DocumentApi {
  private documents: Document[] = documentsJson as Document[];

  login(payload: LoginRequest): Observable<LoginResponse> {
    if (!payload.email || !payload.password) {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(300));
    }

    const user: User = {
      id: 1,
      email: payload.email,
      name: 'Test User'
    };

    return of({ accessToken: 'fake-jwt-token', user }).pipe(delay(400));
  }

  getDocuments(query: DocumentsQuery): Observable<DocumentsListResponse> {
    const {
      search = '',
      page,
      pageSize,
      sortField = 'updatedAt',
      sortDirection = 'desc'
    } = query;

    let filtered = [...this.documents];

    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(doc => doc.title.toLowerCase().includes(lower));
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;

      const result = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? result : -result;
    });

    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return of({ items, total: filtered.length }).pipe(delay(300));
  }

  getDocumentById(id: number): Observable<Document> {
    const doc = this.documents.find(d => d.id === id);

    if (!doc) {
      return throwError(() => new Error('Document not found')).pipe(delay(300));
    }

    return of(doc).pipe(delay(300));
  }

  createDocument(payload: Omit<Document, 'id' | 'updatedAt'>): Observable<Document> {
    const newDoc: Document = {
      ...payload,
      id: this.generateId(),
      updatedAt: new Date().toISOString()
    };

    this.documents = [newDoc, ...this.documents];

    return of(newDoc).pipe(delay(300));
  }

  updateDocument(id: number, changes: Partial<Document>): Observable<Document> {
    const index = this.documents.findIndex(d => d.id === id);

    if (index === -1) {
      return throwError(() => new Error('Document not found')).pipe(delay(300));
    }

    const updated: Document = {
      ...this.documents[index],
      ...changes,
      id,
      updatedAt: new Date().toISOString()
    };

    this.documents[index] = updated;

    return of(updated).pipe(delay(300));
  }

  private generateId(): number {
    return this.documents.length
      ? Math.max(...this.documents.map(d => d.id)) + 1
      : 1;
  }
}
