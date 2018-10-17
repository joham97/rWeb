import { RedditApiService } from './../services/redditapi.service';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/interval';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  title: string;
  description: string;
  path: string;

  enabled = true;

  constructor(private redditApi: RedditApiService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    this.redditApi.loggedOut.subscribe(() => {
      this.router.navigate(['/r/dev']);
    });
    if (!this.sessionService.hasSession()) {
      this.router.navigate(['/r/dev']);
    }
  }

  fileChanged(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    
    if (!file)
      return;

    this.enabled = false;

    this.redditApi.upload(file).subscribe((res: any) => {
      console.log(event);
      this.path = res.data.path;
      this.enabled = true;
    });  
  }

  upload() {
    const post = {
      title: this.title.trim(),
      description: this.description.trim(),
      path: this.path
    };
    this.redditApi.createPost(post).subscribe((res) => {
      this.router.navigate(['/r/dev']);
    });
  }

}
