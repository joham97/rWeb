import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SessionService } from '../services/session.service';

// Used to restrict the access to some routes, without being logged in
@Injectable()
export class RouteGuardService implements CanActivate {

  constructor(public sessionService: SessionService, public router: Router) {}
  
  // Determines, if user is logged in
  canActivate(): boolean {
    if (this.sessionService.hasSession() === null) {
      this.router.navigate(['r/krz']);
      return false;
    }
    return true;
  }

}