import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, NavigationEnd, Event } from '@angular/router';

import { User, PageShown } from './entities/interfaces';

import { LoginComponent } from './login/login.component';

import { RedditApiService } from './services/redditapi.service';
import { SessionService } from './services/session.service';

// Main Component which is the root body of every component
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Currently logged in user
  loggedInUser: User;

  // which page is currently opened
  pageShown: number = 0;

  // Version of the application
  version: any = "x.x.x";

  constructor(private dialog: MatDialog, private redditApi: RedditApiService, private sessionService: SessionService, private router: Router) {
    // Subscribing event for routing 
    this.router.events.subscribe((event: Event) => {
      // Everytime a navigation ended
      if (event instanceof NavigationEnd) {
        // Get new url
        const navevent = event as NavigationEnd;
        // Grab which page is shown and store it in this.pageShown
        if (navevent.urlAfterRedirects === '/r/krz/hot') {
          this.pageShown = 2;
        } else if (navevent.urlAfterRedirects === '/r/krz') {
          this.pageShown = 1;
        } else if (navevent.urlAfterRedirects === '/r/krz/upload') {
          this.pageShown = 3;
        } else {
          this.pageShown = 0;
        }
      }
    });
    
    // Subscribing for logged in event 
    this.redditApi.loggedIn.subscribe(() => {
      // Grabbing logged in user id from session service
      var myUserId = this.sessionService.getSession().userId;
      // Grabbing logged in user data (API-Call)
      this.redditApi.getUser(myUserId).subscribe((res) => {
        this.loggedInUser = res.data;
      });
    });
    
    // Subscribing for logged out event 
    this.redditApi.loggedOut.subscribe(() => {
      this.loggedInUser = null;
      this.openLoginMask();
    });

    // Grabbing application version
    this.version = require('../../package.json').version;
  }
  
  // Opens the login mask
  openLoginMask() {
    // Open dialog with LoginComponent
    this.dialog.open(LoginComponent, {
      disableClose: true,
      data: { popupType: 'login' }
    });
  }

  // Trigger logout call in api
  logout() {
    this.redditApi.logout();
  }

  // Navigate to upload mask
  upload() {
    this.router.navigate(['/r/krz/upload']);
  }

  // Determines if user is logged in
  isLoggedIn() {
    return this.loggedInUser != null;
  }

  // Navigate to new section
  newPage() {
    this.router.navigate(['/r/krz']);
  }

  // Navigate to hot section
  hotPage() {
    this.router.navigate(['/r/krz/hot']);
  }

  showMyPosts() {
    if(this.loggedInUser) {
      this.router.navigate(['/r/krz/user/' + this.loggedInUser.userId]);
    }
  }

}
