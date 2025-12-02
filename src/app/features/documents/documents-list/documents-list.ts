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
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs/operators';

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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.documents$ = this.store.select(selectDocumentsItems);
    this.loading$ = this.store.select(selectDocumentsLoading);
    this.total$ = this.store.select(selectDocumentsTotal);
    this.page$ = this.store.select(selectDocumentsPage);
    this.pageSize$ = this.store.select(selectDocumentsPageSize);
  }

  ngOnInit(): void {
    // Подписываемся на query params и считаем их единственным источником правды
    this.route.queryParamMap
      .pipe(
        map((params) => ({
          search: params.get('search') ?? '',
          page: +(params.get('page') ?? 1),
          pageSize: +(params.get('pageSize') ?? 10),
        })),
        distinctUntilChanged(
          (a, b) => a.search === b.search && a.page === b.page && a.pageSize === b.pageSize,
        ),
      )
      .subscribe(({ search, page, pageSize }) => {
        // Синхронизируем форму без лишних событий
        this.searchControl.setValue(search, { emitEvent: false });

        // Кладём фильтры в стор
        this.store.dispatch(DocumentsActions.setFilters({ search, page, pageSize }));

        // Говорим эффектору "перечитай список"
        this.store.dispatch(DocumentsActions.refresh());
      });

    // Если зашли без query params — один раз проставим дефолты в URL
    const initialParams = this.route.snapshot.queryParamMap;
    if (!initialParams.has('page') && !initialParams.has('pageSize')) {
      this.updateQueryParams({
        search: '',
        page: 1,
        pageSize: 10,
      });
    }
  }

  onSearch(): void {
    const search = this.searchControl.value ?? '';
    this.updateQueryParams({
      search,
      page: 1, // при новом поиске всегда на первую страницу
    });
  }

  onPageChange(event: PageEvent): void {
    const search = this.searchControl.value ?? '';
    this.updateQueryParams({
      search,
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
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

  private updateQueryParams(partial: { search?: string; page?: number; pageSize?: number }): void {
    const current = this.route.snapshot.queryParamMap;

    const search = partial.search ?? current.get('search') ?? this.searchControl.value ?? '';
    const page = partial.page ?? +(current.get('page') ?? 1);
    const pageSize = partial.pageSize ?? +(current.get('pageSize') ?? 10);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search,
        page,
        pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }
}
