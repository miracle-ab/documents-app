import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Document } from '../../../core/models/document.model';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  selectDocumentsItems,
  selectDocumentsLoading,
  selectDocumentsPage,
  selectDocumentsPageSize,
  selectDocumentsTotal,
} from '../state/documents.selectors';
import { DocumentsActions } from '../state/documents.actions';
import { DocumentDialogComponent } from '../document-dialog/document-dialog';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    DocumentDialogComponent,
  ],
  templateUrl: './documents-list.html',
  styleUrl: './documents-list.scss',
})
export class DocumentsListComponent {
  documents$: Observable<Document[]>;
  loading$: Observable<boolean>;
  total$: Observable<number>;
  page$: Observable<number>;
  pageSize$: Observable<number>;

  displayedColumns = ['id', 'title', 'author', 'status', 'updatedAt', 'actions'];

  searchControl = new FormControl('', { nonNullable: true });

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
  ) {
    this.documents$ = this.store.select(selectDocumentsItems);
    this.loading$ = this.store.select(selectDocumentsLoading);
    this.total$ = this.store.select(selectDocumentsTotal);
    this.page$ = this.store.select(selectDocumentsPage);
    this.pageSize$ = this.store.select(selectDocumentsPageSize);
  }

  ngOnInit(): void {
    this.store.dispatch(DocumentsActions.loadList({ query: { page: 1, pageSize: 10 } }));
  }

  onSearch(): void {
    const search = this.searchControl.value ?? '';
    this.store.dispatch(DocumentsActions.setFilters({ search, page: 1, pageSize: 10 }));
    this.store.dispatch(DocumentsActions.refresh());
  }

  onPageChange(event: PageEvent): void {
    const search = this.searchControl.value ?? '';
    this.store.dispatch(
      DocumentsActions.setFilters({
        search,
        page: event.pageIndex + 1,
        pageSize: event.pageSize,
      }),
    );
    this.store.dispatch(DocumentsActions.refresh());
  }

  create(): void {
    this.dialog.open(DocumentDialogComponent, {
      width: '800px',
      data: { mode: 'create' },
    });
  }

  edit(document: Document): void {
    this.dialog.open(DocumentDialogComponent, {
      width: '800px',
      data: { mode: 'edit', documentId: document.id },
    });
  }
}
