import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { exhaustMap, map, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler)
  {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {return authState.user}),
      exhaustMap(
        user => {
          if (!user) {
            return next.handle(request);
          }
          const modifiedReq = request.clone({
            params: new HttpParams().set('auth',user.token)
          });
          return next.handle(modifiedReq);
        }
      )
    )
    
  }
}
