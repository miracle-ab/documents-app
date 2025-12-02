import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DocumentsListResponse, DocumentsQuery } from '../../../core/services/document-api';
import { Document } from '../../../core/models/document.model';

export const DocumentsActions = createActionGroup({
  source: 'Documents',
  events: {
    'Load List': props<{ query: DocumentsQuery }>(),
    'Load List Success': props<{ response: DocumentsListResponse }>(),
    'Load List Failure': props<{ error: string }>(),

    'Load One': props<{ id: number }>(),
    'Load One Success': props<{ document: Document }>(),
    'Load One Failure': props<{ error: string }>(),

    Create: props<{ payload: Omit<Document, 'id' | 'updatedAt'> }>(),
    'Create Success': props<{ document: Document }>(),
    'Create Failure': props<{ error: string }>(),

    Update: props<{ id: number; changes: Partial<Document> }>(),
    'Update Success': props<{ document: Document }>(),
    'Update Failure': props<{ error: string }>(),

    'Set Filters': props<{ search: string; page: number; pageSize: number }>(),
    Refresh: emptyProps(),
  },
});
