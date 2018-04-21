import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RedditApiService } from '../services/redditapi.service';
import { Router } from '@angular/router';
import { PostComponent } from '../post/post.component';
import { Comment } from './../entities/interfaces';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment[];
  @Input() reply: boolean;
  @Input() superId: number;
  @Input() post: boolean;
  commentText: string;

  constructor(private redditApi: RedditApiService, private router: Router) {}

  ngOnInit() { }

  switchReply(entry) {
    entry.reply = !entry.reply;
  }

  newComment() {
    if (this.redditApi.isLoggedIn()) {
      const comment = {
        text: this.commentText,
        postId: -1,
        commentId: -1
      };
      if (this.post) {
        comment.postId = this.superId;
      } else {
        comment.commentId = this.superId;
      }
      this.redditApi.createComment(comment).subscribe((res) => {
        this.comment.push(res.data);
        this.commentText = '';
        this.reply = this.post;
      });
    }
  }

  isLoggedIn() {
    return this.redditApi.isLoggedIn();
  }

  vote(comment: Comment, value: number) {
    if (this.redditApi.isLoggedIn()) {
      if (comment.yourvote === value) {
        value = 0;
      }
      this.redditApi.voteComment(comment, value).subscribe((res) => {
        console.log(res);
        comment.upvotes = res.data.upvotes;
        comment.downvotes = res.data.downvotes;
        comment.yourvote = res.data.yourvote;
      });
    }
  }

  switchCollapse(entry: Comment) {
    entry.collapse = !entry.collapse;
  }


}
