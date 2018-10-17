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

  isUploadingImage = false;

  constructor(private redditApi: RedditApiService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    this.redditApi.loggedOut.subscribe(() => {
      this.router.navigate(['/r/krz']);
    });
    if (!this.sessionService.hasSession()) {
      this.router.navigate(['/r/krz']);
    }
  }

  fileChanged(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    
    if (!file)
      return;

    this.isUploadingImage = true;

    this.redditApi.upload(file).subscribe((res: any) => {
      this.path = res.data.path;
      this.isUploadingImage = false;
    });  
  }

  isUploadable(): boolean {
    return this.title.length > 0 && !this.isUploadingImage;
  }

  upload() {
    if(this.isUploadable()) {
      const post = {
        title: this.title.trim(),
        description: this.description.trim(),
        path: this.path
      };
      this.redditApi.createPost(post).subscribe((res) => {
        this.router.navigate(['/r/krz']);
      });
    }
  }
}
