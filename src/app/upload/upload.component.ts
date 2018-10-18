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

  // 2-Way-Binded view variables
  title: string;
  description: string;
  previewPath: string;

  // Is image currently uploading?
  isUploadingImage = false;

  constructor(private redditApi: RedditApiService, private sessionService: SessionService, private router: Router) { }

  // If component is initialized
  ngOnInit() {
    // Subscribing to logout event, that redirects to main page
    this.redditApi.loggedOut.subscribe(() => {
      this.router.navigate(['/r/krz']);
    });
    // Redirects to main page if there is no session
    if (!this.sessionService.hasSession()) {
      this.router.navigate(['/r/krz']);
    }
  }

  // Event, that triggers when a file got changed in file picker
  fileChanged(e: Event) {
    // Grab file
    const file = (e.target as HTMLInputElement).files[0];
    
    // If there is no file -> abort
    if (!file)
      return;

    // Start uploading phase 
    this.isUploadingImage = true;

    // Perform upload api call
    this.redditApi.upload(file).subscribe((res: any) => {
      // Get path from result to show a preview of the image
      this.previewPath = res.data.path;
      // End uploading phase 
      this.isUploadingImage = false;
    });  
  }

  // Determines if the post can be uploaded in the current stage 
  isUploadable(): boolean {
    // Only if title was set and no image uploading phase is started
    return this.title.length > 0 && !this.isUploadingImage;
  }

  // Upload the whole post
  upload() {
    // If uploadable
    if(this.isUploadable()) {
      // Create post (Trim the title and description)
      const post = {
        title: this.title.trim(),
        description: (this.description)?this.description.trim():'',
        path: this.previewPath
      };
      // Call api to create post
      this.redditApi.createPost(post).subscribe((res) => {
        this.router.navigate(['/r/krz']);
      });
    }
  }
}
