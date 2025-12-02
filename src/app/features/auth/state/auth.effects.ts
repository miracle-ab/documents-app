import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { DocumentApi } from '../../../core/services/document-api';
import { NotificationService } from '../../../core/services/notification';
import { Router } from '@angular/router';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(DocumentApi);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ payload }) =>
        this.api.login(payload).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message ?? 'Login failed' })),
          ),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          localStorage.setItem(TOKEN_KEY, response.accessToken);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
          this.notifications.success('Login successful');
          this.router.navigateByUrl('/documents');
        }),
      ),
    { dispatch: false },
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => this.notifications.error(error)),
      ),
    { dispatch: false },
  );

  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession),
      map(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        const raw = localStorage.getItem(USER_KEY);

        if (!token || !raw) {
          return AuthActions.logout();
        }

        return AuthActions.restoreSessionSuccess({
          response: { accessToken: token, user: JSON.parse(raw) },
        });
      }),
    ),
  );
}
