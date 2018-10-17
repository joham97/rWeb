import { Post } from './../entities/interfaces';
import { RedditApiService } from './../services/redditapi.service';
import { Component, OnInit, isDevMode } from '@angular/core';
import 'rxjs/add/observable/interval';
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
        this.post.big = true;
        if(isDevMode()){
          this.post.path = "http://10.112.16.42/" + this.post.path;
        }
      });
    });
  }

}
