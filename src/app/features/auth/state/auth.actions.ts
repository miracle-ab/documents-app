import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { LoginRequest, LoginResponse } from '../../../core/services/document-api';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ payload: LoginRequest }>(),
    'Login Success': props<{ response: LoginResponse }>(),
    'Login Failure': props<{ error: string }>(),

    Logout: emptyProps(),
    'Restore Session': emptyProps(),
  },
});
