import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { User } from './entities/interfaces';
import { MatDialog, MatDialogConfig, MatDialogClose } from '@angular/material';
import { RedditApiService } from './services/redditapi.service';
import { Router, NavigationEnd, Event } from '@angular/router';

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

  constructor(private dialog: MatDialog, private redditApi: RedditApiService, private router: Router) {
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
        if (this.redditApi.getSession()) {
          this.redditApi.checkSession().subscribe(res => {
            if (res.success) {
              this.redditApi.getUser(this.redditApi.getSession().userId).subscribe((data) => {
                this.user = data.data;
              });
            } else {
              this.redditApi.removeSession();
              this.login();
            }
          });
        }
      }
    });
  }

  login() {
    this.dialog.open(LoginComponent, {
      disableClose: true,
      data: { popupType: 'login' }
    }).afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.redditApi.getUser(this.redditApi.getSession().userId).subscribe((data) => {
          this.user = data.data;
        });
        this.redditApi.loggedIn.emit();
      }
    });
  }

  logout() {
    this.redditApi.logout().subscribe((res) => {
      if (res.success) {
        this.redditApi.removeSession();
        this.user = null;
        this.redditApi.loggedOut.emit();
      }
    });
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
