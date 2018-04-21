import { Post, Response } from './../entities/interfaces';
import { RedditApiService } from './../services/redditapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Server } from 'selenium-webdriver/safari';
import { Router } from '@angular/router';
import { Comment } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data: Post[];
  loading = true;

  constructor(private redditApi: RedditApiService, private router: Router) { }

  ngOnInit() {
    this.redditApi.loggedIn.subscribe(() => {
      this.loadData();
    });
    this.redditApi.loggedOut.subscribe(() => {
      this.loadData();
    });
    this.loadData();
  }

  loadData() {
    this.loading = true;
    if (this.router.url === '/r/dev/hot') {
      this.redditApi.getHotPosts().subscribe((res: Response) => {
        this.data = res.data;
        this.loading = false;
      });
    } else if (this.router.url === '/r/dev') {
      this.redditApi.getNewPosts().subscribe((res: Response) => {
        this.data = res.data;
        this.loading = false;
      });
    }
  }

  makeBig(post: Post) {
    post.big = !post.big;
  }

  vote(post: Post, value: number) {
    if (this.redditApi.isLoggedIn()) {
      if (post.yourvote === value) {
        value = 0;
      }
      this.redditApi.vote(post, value).subscribe((res) => {
        this.loadData();
      });
    }
  }

  showPost(id: number) {
    this.router.navigate(['/r/dev/post/' + id]);
  }
}
