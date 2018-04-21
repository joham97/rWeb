import { Post, Response } from './../entities/interfaces';
import { RedditApiService } from './../services/redditapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Server } from 'selenium-webdriver/safari';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post: Post;

  constructor(private redditApi: RedditApiService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.redditApi.loggedIn.subscribe(() => {
      this.loadData();
    });
    this.redditApi.loggedOut.subscribe(() => {
      this.loadData();
    });
    this.loadData();
  }

  makeBig(post: Post) {
    post.big = !post.big;
  }

  public loadData() {
    this.route.params.subscribe(params => {
      this.redditApi.getFullPost(params.id).subscribe((res) => {
        this.post = res.data;
      });
    });
  }

}
