import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DocumentsActions } from './documents.actions';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { selectDocumentsQuery } from './documents.selectors';
import { Document } from '../../../core/models/document.model';
import { DocumentApi, DocumentsListResponse } from '../../../core/services/document-api';
import { NotificationService } from '../../../core/services/notification';

@Injectable()
export class DocumentsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(DocumentApi);
  private readonly notifications = inject(NotificationService);
  private readonly store = inject(Store);

  loadList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadList, DocumentsActions.refresh),
      withLatestFrom(this.store.select(selectDocumentsQuery)),
      switchMap(([_, query]) =>
        this.api.getDocuments(query).pipe(
          map((response: DocumentsListResponse) => DocumentsActions.loadListSuccess({ response })),
          catchError((error) =>
            of(
              DocumentsActions.loadListFailure({
                error: error.message ?? 'Load failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadOne),
      switchMap(({ id }) =>
        this.api.getDocumentById(id).pipe(
          map((document: Document) => DocumentsActions.loadOneSuccess({ document })),
          catchError((error) =>
            of(
              DocumentsActions.loadOneFailure({
                error: error.message ?? 'Load failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.create),
      switchMap(({ payload }) =>
        this.api.createDocument(payload).pipe(
          map((document: Document) => DocumentsActions.createSuccess({ document })),
          tap(() => this.notifications.success('Document created')),
          catchError((error) =>
            of(
              DocumentsActions.createFailure({
                error: error.message ?? 'Create failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.update),
      switchMap(({ id, changes }) =>
        this.api.updateDocument(id, changes).pipe(
          map((document: Document) => DocumentsActions.updateSuccess({ document })),
          tap(() => this.notifications.success('Document updated')),
          catchError((error) =>
            of(
              DocumentsActions.updateFailure({
                error: error.message ?? 'Update failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
