import { Post } from './../entities/interfaces';
import { RedditApiService } from './../services/redditapi.service';
import { Component, OnInit, isDevMode } from '@angular/core';
import 'rxjs/add/observable/interval';
import { Router, ActivatedRoute} from '@angular/router';

// Displays the whole post
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  // Post that is being displayed
  post: Post;

  constructor(private redditApi: RedditApiService, private router: Router, private route: ActivatedRoute) { }

  // Called after component has been initialized
  ngOnInit() {
    // Load data
    this.loadData();

    // Reload data on login
    this.redditApi.loggedIn.subscribe(() => {
      this.loadData();
    });
    // Reload data on logout
    this.redditApi.loggedOut.subscribe(() => {
      this.loadData();
    });
  }

  // Make post image big
  makeBig(post: Post) {
    post.big = !post.big;
  }

  // Reloading data of post
  public loadData() {
    // Get post id from url parameter
    this.route.params.subscribe(params => {
      // Load whole post from api
      this.redditApi.getFullPost(params.id).subscribe((res) => {
        this.post = res.data;
        // Show full image in full size
        this.post.big = true;
        // Add prefix to path in development mode
        if(isDevMode()){
          this.post.path = "http://10.112.16.42/" + this.post.path;
        }
      });
    });
  }

}
