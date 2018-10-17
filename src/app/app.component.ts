import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { User } from './entities/interfaces';
import { MatDialog } from '@angular/material';
import { RedditApiService } from './services/redditapi.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  user: User;

  hot: boolean;
  new: boolean;
  uploadPage: boolean;

  constructor(private dialog: MatDialog, private redditApi: RedditApiService, private sessionService: SessionService, private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const navevent = event as NavigationEnd;
        this.hot = false;
        this.new = false;
        this.uploadPage = false;
        if (navevent.urlAfterRedirects === '/r/dev/hot') {
          this.hot = true;
        } else if (navevent.urlAfterRedirects === '/r/dev') {
          this.new = true;
        } else if (navevent.urlAfterRedirects === '/r/dev/upload') {
          this.uploadPage = true;
        }
      }
    });
    
    this.redditApi.loggedIn.subscribe(() => {
      this.redditApi.getUser(this.sessionService.getSession().userId).subscribe((res) => {
        this.user = res.data;
      });
    });
    
    this.redditApi.loggedOut.subscribe(() => {
      this.user = null;
      this.login();
    });
  }
  
  login() {
    this.dialog.open(LoginComponent, {
      disableClose: true,
      data: { popupType: 'login' }
    });
  }

  logout() {
    this.redditApi.logout();
  }

  upload() {
    this.router.navigate(['/r/dev/upload']);
  }

  isLoggedIn() {
    return this.user != null;
  }

  newPage() {
    this.router.navigate(['/r/dev']);
  }

  hotPage() {
    this.router.navigate(['/r/dev/hot']);
  }

}
