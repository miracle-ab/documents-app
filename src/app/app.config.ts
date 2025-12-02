import { ApplicationConfig, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { authInterceptor } from './core/interceptors/auth-interceptor';
import { AuthEffects } from './features/auth/state/auth.effects';
import { authReducer } from './features/auth/state/auth.reducer';
import { documentsReducer } from './features/documents/state/documents.reducer';
import { DocumentsEffects } from './features/documents/state/documents.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(withInterceptors([authInterceptor])),
    provideZonelessChangeDetection(),
    provideStore({
      auth: authReducer,
      documents: documentsReducer,
    }),

    provideEffects(AuthEffects, DocumentsEffects),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
};
