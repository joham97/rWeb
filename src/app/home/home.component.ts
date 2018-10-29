import { Component, OnInit, isDevMode } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { timer, Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

import { Post, Response } from './../entities/interfaces';
import { RedditApiService } from './../services/redditapi.service';
import { SessionService } from '../services/session.service';
import { MatDialog } from '@angular/material';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';

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

  // User id from query param
  userId: number;

  // Current limit
  postLimit: number = 0;

  constructor(private redditApi: RedditApiService, private sessionService: SessionService, private router: Router, private route: ActivatedRoute,
    private dialog: MatDialog) { }

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

    // Load query params like the userId
    this.route.params.subscribe(params => {
      this.userId = params.userId;
      this.loadData(true);
    });

    // Set what happens if window is getting scrolled 
    window.onscroll = ((event) => {
      this.onScroll(event);
    });
  }

  loadNext15Posts() {
    this.postLimit += 15;
    this.loadData(false);
  }

  // Loading posts from api
  loadData(reload: boolean) {
    this.loading = true;
    // Differentiate between hot and new 
    if (this.router.url === '/r/krz') {
      // Grab hot posts from api
      this.redditApi.getNewPosts(this.postLimit).subscribe((res: Response) => {
        this.UpdateData(res.data, reload);
        this.loading = false;
      });
    } else if (this.router.url === '/r/krz/hot') {
      // Grab new posts from api
      this.redditApi.getHotPosts(this.postLimit).subscribe((res: Response) => {
        this.UpdateData(res.data, reload);
        this.loading = false;
      });
    } else if (this.router.url.startsWith('/r/krz/user')) {
      // Grab user posts from api
      this.redditApi.getUserPosts(this.postLimit, this.userId).subscribe((res: Response) => {
        this.UpdateData(res.data, reload);
        this.loading = false;
      });
    }
  }

  // Make post image big
  makeBig(post: Post, event: any) {
    if (event) {
      event.stopPropagation();
    }
    post.big = !post.big;
  }

  // Vote for a post
  vote(post: Post, value: number, event: any) {
    if (event) {
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
        // Update voting data
        const index = this.data.findIndex(p => p.postId === res.data.postId);
        this.data[index].upvotes = res.data.upvotes;
        this.data[index].downvotes = res.data.downvotes;
        this.data[index].yourvote = res.data.yourvote;
        console.log(this.data[index].yourvote);
      });
    }
  }

  // Algorithm to update the displayed data
  UpdateData(data: Post[], reload: boolean) {
    // If in dev-mode add image path prefix
    if (isDevMode()) {
      data.forEach((e) => {
        if(e.path && e.path.length > 0) {
          e.path = "http://10.112.16.42/" + e.path;
        }
      });
    }
    if(reload) {
      this.data = data;
    } else {
      data.forEach(d => this.data.push(d));
    }
  }

  // Navigate to post
  showPost(id: number) {
    this.router.navigate(['/r/krz/post/' + id]);
  }

  showUser(userId: number, event: any) {
    this.stopPropagation(event);
    this.router.navigate(['/r/krz/user/' + userId]);
  }

  stopPropagation(event: any) {
    if (event) {
      event.stopPropagation();
    }
  }

  copyLink(post: Post) {
    const el = document.createElement('textarea');
    el.value = "http://10.112.16.42/#/r/krz/post/" + post.postId;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  isMyPost(post: Post): boolean {
    return this.sessionService.hasSession() && this.sessionService.getSession().userId === post.userId;
  }

  deletePost(post: Post) {
    this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      disableClose: true,
      position: { top: "80px" },
      data: {
        message: "Do you really want to delete this post?"
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.redditApi.deletePost(post.postId).subscribe((res2) => {
          // Remove post entry
          this.data.splice(this.data.findIndex(p => p.postId === res.data.postId), 1);
        });
      }
    });
  }

  onScroll(event: any) {
    if(this.data.length > 0 && !this.loading) {
      var pageHeight = document.documentElement.offsetHeight;
      var windowHeight = window.innerHeight;
      var scrollPosition = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

      if (pageHeight <= windowHeight + scrollPosition) {
        this.loadNext15Posts();
      }
    }
  }
}
