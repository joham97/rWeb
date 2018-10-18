import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable()
export class RouteGuardService implements CanActivate {

  constructor(public sessionService: SessionService, public router: Router) {}
  
  canActivate(): boolean {
    if (this.sessionService.hasSession() === null) {
      this.router.navigate(['r/krz']);
      return false;
    }
    return true;
  }

}