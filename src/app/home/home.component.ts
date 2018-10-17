import { Post, Response } from './../entities/interfaces';
import { RedditApiService } from './../services/redditapi.service';
import { Component, OnInit, isDevMode } from '@angular/core';
import 'rxjs/add/observable/interval';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data: Post[] = [];
  loading = true;

  onUpdateTimer: any;

  constructor(private redditApi: RedditApiService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    this.redditApi.loggedIn.subscribe(() => {
      this.loadData(true);
    });
    this.redditApi.loggedOut.subscribe(() => {
      this.loadData(true);
    });
    this.onUpdateTimer = timer(0, 5000);
    this.onUpdateTimer.subscribe(() => {
      this.loadData(true);
    });
  }

  loadData(optional?: boolean) {
    this.loading = true;
    if (this.router.url === '/r/krz/hot') {
      this.redditApi.getHotPosts().subscribe((res: Response) => {
        this.UpdateData(res.data, optional);
        this.loading = false;
      });
    } else if (this.router.url === '/r/krz') {
      this.redditApi.getNewPosts().subscribe((res: Response) => {
        this.UpdateData(res.data, optional);
        this.loading = false;
      });
    }
  }

  makeBig(post: Post) {
    post.big = !post.big;
  }

  vote(post: Post, value: number) {
    if (this.sessionService.hasSession()) {
      if (post.yourvote === value) {
        value = 0;
      }
      this.redditApi.vote(post, value).subscribe((res) => {
        this.loadData();
      });
    }
  }


  UpdateData(data: Post[], optional: boolean) {
    if(!optional || this.data.length < data.length){
      this.data = data;
      if(isDevMode()){
        this.data.forEach((e) => {
          e.path = "http://10.112.16.42/" + e.path;
        });
      }
    }
  }

  showPost(id: number) {
    this.router.navigate(['/r/krz/post/' + id]);
  }
}
