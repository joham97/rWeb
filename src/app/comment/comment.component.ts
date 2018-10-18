import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Comment } from './../entities/interfaces';
import { RedditApiService } from '../services/redditapi.service';
import { SessionService } from '../services/session.service';

// A single comment with sub comments  
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  // Sub comments
  @Input() comment: Comment[];
  // Is reply box opened
  @Input() reply: boolean;
  // Parent comment id
  @Input() superId: number;
  // Post, where the comment is within
  @Input() post: boolean;
  // Current comment text
  commentText: string;

  constructor(private redditApi: RedditApiService, private sessionService: SessionService, private router: Router) {}

  // Switch visibility of reply box
  switchReply(entry) {
    entry.reply = !entry.reply;
  }

  // Api call for new comment
  newComment() {
    if (this.isLoggedIn()) {
      // Create comment object
      const comment = {
        text: this.commentText,
        postId: -1,
        commentId: -1
      };
      // Add super id (comment of post / comment of comment)
      if (this.post) {
        comment.postId = this.superId;
      } else {
        comment.commentId = this.superId;
      }
      // Call api
      this.redditApi.createComment(comment).subscribe((res) => {
        this.comment.push(res.data);
        this.commentText = '';
        this.reply = this.post;
      });
    }
  }

  // Check if logged in
  isLoggedIn() {
    return this.sessionService.hasSession();
  }

  // Perform vote on comment
  vote(comment: Comment, value: number) {
    if (this.isLoggedIn()) {
      // Is user wants to redo his vote
      if (comment.yourvote === value) {
        value = 0;
      }
      // Send comment vote to api
      this.redditApi.voteComment(comment, value).subscribe((res) => {
        comment.upvotes = res.data.upvotes;
        comment.downvotes = res.data.downvotes;
        comment.yourvote = res.data.yourvote;
      });
    }
  }

  // Switch between collapse and expansion for a comment
  switchCollapse(entry: Comment) {
    entry.collapse = !entry.collapse;
  }

}
