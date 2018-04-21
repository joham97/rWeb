import { Component, OnInit } from '@angular/core';
import { RedditApiService } from '../services/redditapi.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private redditApi: RedditApiService) { }

  ngOnInit() {
  }

}
