import { Component, OnInit, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

import { timer, Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

import { Post, Response } from './../entities/interfaces';
import { RedditApiService } from './../services/redditapi.service';
import { SessionService } from '../services/session.service';

// Displays home view
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Array of Posts
  data: Post[] = [];
  // Loading state
  loading = true;

  // Update timer
  onUpdateTimer: Observable<number>;

  constructor(private redditApi: RedditApiService, private sessionService: SessionService, private router: Router) { }

  // After component got initialized
  ngOnInit() {
    // Reload data on login
    this.redditApi.loggedIn.subscribe(() => {
      this.loadData(true);
    });
    // Reload data on logout
    this.redditApi.loggedOut.subscribe(() => {
      this.loadData(true);
    });
    // Reload data on each 5 seconds
    this.onUpdateTimer = timer(0, 5000);
    this.onUpdateTimer.subscribe(() => {
      this.loadData(true);
    });
  }

  // Loading posts from api
  loadData(optional?: boolean) {
    this.loading = true;
    // Differentiate between hot and new 
    if (this.router.url === '/r/krz/hot') {
      // Grab hot posts from api
      this.redditApi.getHotPosts().subscribe((res: Response) => {
        this.UpdateData(res.data, optional);
        this.loading = false;
      });
    } else if (this.router.url === '/r/krz') {
      // Grab new posts from api
      this.redditApi.getNewPosts().subscribe((res: Response) => {
        this.UpdateData(res.data, optional);
        this.loading = false;
      });
    }
  }

  // Make post image big
  makeBig(post: Post, event: any) {
    if(event){
      event.stopPropagation();
    }
    post.big = !post.big;
  }

  // Vote for a post
  vote(post: Post, value: number, event: any) {
    if(event){
      event.stopPropagation();
    }
    // Check if user is logged in
    if (this.sessionService.hasSession()) {
      // Is user wants to redo his vote
      if (post.yourvote === value) {
        value = 0;
      }
      // Call api to vote post
      this.redditApi.vote(post, value).subscribe((res) => {
        this.loadData();
      });
    }
  }

  // Algorithm to update the displayed data
  UpdateData(data: Post[], optional: boolean) {
    // Only if hard-update is requested or data length has changed
    if(!optional || this.data.length < data.length){
      this.data = data;
      // If in dev-mode add image path prefix
      if(isDevMode()){
        this.data.forEach((e) => {
          e.path = "http://10.112.16.42/" + e.path;
        });
      }
    }
  }

  // Navigate to post
  showPost(id: number) {
    this.router.navigate(['/r/krz/post/' + id]);
  }

  showUser(user: any, event: any) {
    if(event){
      event.stopPropagation();
    }
    // TODO: Navigate to user
  }

  stopPropagation(event: any) {    
    if(event){
      event.stopPropagation();
    }
  }
}
