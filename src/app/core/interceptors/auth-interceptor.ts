import { HttpInterceptorFn } from '@angular/common/http';

const LANGUAGE = 'ru';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');

  let headers = req.headers.set('Accept-Language', LANGUAGE);

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const cloned = req.clone({ headers });

  return next(cloned);
};
