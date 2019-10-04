import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authSvc: AuthService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const betId = route.params.id;
      return this.authSvc.IdExists(betId).then(
        (isAllowed: boolean) => {
          if (isAllowed) {
            return true;
          } else {
            this.router.navigate(['/bets']);
          }
        });

  }
}
