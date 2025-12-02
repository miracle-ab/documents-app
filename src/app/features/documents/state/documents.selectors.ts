import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentsState } from './documents.reducer';

export const selectDocumentsState = createFeatureSelector<DocumentsState>('documents');

export const selectDocumentsItems = createSelector(selectDocumentsState, (s) => s.items);
export const selectDocumentsTotal = createSelector(selectDocumentsState, (s) => s.total);
export const selectDocumentsLoading = createSelector(selectDocumentsState, (s) => s.loading);
export const selectDocumentsSearch = createSelector(selectDocumentsState, (s) => s.search);
export const selectDocumentsPage = createSelector(selectDocumentsState, (s) => s.page);
export const selectDocumentsPageSize = createSelector(selectDocumentsState, (s) => s.pageSize);

export const selectDocumentsQuery = createSelector(selectDocumentsState, (s) => ({
  search: s.search,
  page: s.page,
  pageSize: s.pageSize,
}));

export const selectDocumentById = (id: number) =>
  createSelector(selectDocumentsItems, (items) => items.find((d) => d.id === id) ?? null);
