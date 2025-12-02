import { Injectable } from '@angular/core';

const TOKEN_KEY = 'accessToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
