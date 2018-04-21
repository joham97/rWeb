import { Post, Response } from './../entities/interfaces';
import { RedditApiService } from './../services/redditapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Server } from 'selenium-webdriver/safari';
import { Router } from '@angular/router';

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

  constructor(private redditApi: RedditApiService, private router: Router) { }

  ngOnInit() {
    if (!this.redditApi.isLoggedIn()) {
      this.router.navigate(['/r/dev']);
    }
  }

  fileChanged(e: Event) {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    this.enabled = false;
    this.redditApi.upload(target.files[0]).subscribe((res: Response) => {
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
