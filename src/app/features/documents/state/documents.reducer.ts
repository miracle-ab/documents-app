import { createReducer, on } from '@ngrx/store';
import { Document } from '../../../core/models/document.model';
import { DocumentsActions } from './documents.actions';

export interface DocumentsState {
  items: Document[];
  total: number;
  loading: boolean;
  error: string | null;
  selected: Document | null;
  search: string;
  page: number;
  pageSize: number;
}

export const initialState: DocumentsState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  selected: null,
  search: '',
  page: 1,
  pageSize: 10,
};

export const documentsReducer = createReducer(
  initialState,
  on(DocumentsActions.loadList, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DocumentsActions.loadListSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    items: response.items,
    total: response.total,
  })),
  on(DocumentsActions.loadListFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(DocumentsActions.loadOneSuccess, (state, { document }) => ({
    ...state,
    selected: document,
  })),
  on(DocumentsActions.createSuccess, (state, { document }) => ({
    ...state,
    items: [...state.items, document],
    total: state.total + 1,
  })),
  on(DocumentsActions.updateSuccess, (state, { document }) => ({
    ...state,
    items: state.items.map((d) => (d.id === document.id ? document : d)),
    selected: state.selected?.id === document.id ? document : state.selected,
  })),
  on(DocumentsActions.setFilters, (state, { search, page, pageSize }) => ({
    ...state,
    search,
    page,
    pageSize,
  })),
);
