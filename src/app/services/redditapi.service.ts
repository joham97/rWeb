import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Post, Response, Session, Comment } from './../entities/interfaces';
import { RestService } from './rest.service';
import { SessionService } from './session.service';

// Service, that handles all api calls
@Injectable()
export class RedditApiService {

  // Event emitters for logging in, out or for errors while logging in
  @Output() loggedIn = new EventEmitter<any>();
  @Output() loggedOut = new EventEmitter<any>();
  @Output() loginError = new EventEmitter<any>();

  // After reloading the service this variable determines, if the session has been checked against the backend
  public ready: boolean = false;
  // Event emitter, if the ready state has changed
  @Output() OnReadyChanged = new EventEmitter<boolean>();

  // Default base path for backend
  public BASEPATH = 'http://10.112.16.42:8080/api';

  constructor(private rest: RestService, private sessionService: SessionService) {
    // Validate session, if user is logged in
    if (sessionService.hasSession()) {
      this.ValidateToken();
    } else {
      this.SetReady(true);
    }
  }

  // Request, that grabs the new posts
  public getNewPosts(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Posts?type=new' + this.getSessionKeyAsSingleAttribute());
  }
  // Request, that grabs the hot posts
  public getHotPosts(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Posts?type=hot' + this.getSessionKeyAsSingleAttribute());
  }
  // Request, that grabs the hot posts
  public getUserPosts(userId: number): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Posts?type=user&userId=' + userId + this.getSessionKeyAsSingleAttribute());
  }

  // Request, that performs the login
  public login(username: string, password: string) {
    var body = { username, password };
    this.rest.postRequest(this.BASEPATH + '/Login', body).subscribe(
      (response: Response) => {
        // Create and set session object
        var session: Session = response.data;
        this.sessionService.setSession(session);
        // Trigger the loggedIn event
        this.loggedIn.emit();
      },
      // In case of an login error
      (error) => {
        if(error.status){
          this.loginError.emit(error);
        } else {
          this.loginError.emit({status: -1});
        }
      });
  }

  // Request, that performs the logout
  public logout() {
    this.rest.getRequest(this.BASEPATH + '/Logout' + this.getSessionKeyAsAttribute()).subscribe(
      (response: Response) => {
        // Remove session object
        this.sessionService.removeSession();
        // Trigger the loggedOut event
        this.loggedOut.emit();
      },
      // In case of an login error
      (error) => {
        // Remove session object anyway
        this.sessionService.removeSession();
        // Trigger the loggedOut event anyway
        this.loggedOut.emit();
      });
  }

  // Request, that performs the registration
  public register(username: string, password: string): Observable<Response> {
    var body = { username, password };
    return this.rest.postRequest(this.BASEPATH + '/Register', body);
  }

  // Request, that performs the validation process
  public ValidateToken() {
    return this.rest.getRequest(this.BASEPATH + '/Validate' + this.getSessionKeyAsAttribute()).subscribe(
      (response: Response) => { 
        // Trigger login event again
        this.loggedIn.emit();
        // Set ready state 
        this.SetReady(true);
      },
      (error) => {
        // Remove session object
        this.sessionService.removeSession();
        // Trigger the loggedOut event
        this.loggedOut.emit();
        // Set ready state 
        this.SetReady(true);
      });
  }

  // Request, that grabs the user data
  public getUser(userId: number): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/User?userId=' + userId);
  }

  // Request, that creates a post
  public createPost(post): Observable<Response> {
    return this.rest.postRequest(this.BASEPATH + '/Post' + this.getSessionKeyAsAttribute(), post);
  }

  // Request, that creates a comment
  public createComment(comment): Observable<Response> {
    return this.rest.postRequest(this.BASEPATH + '/Comment' + this.getSessionKeyAsAttribute(), comment);
  }

  // Request, that deletes a post
  public deletePost(postId: number): Observable<Response> {
    return this.rest.deleteRequest(this.BASEPATH + '/Post?postId=' + postId + this.getSessionKeyAsSingleAttribute(), {});
  }

  // Request, that performs a vote for a post
  public vote(post: Post, value: number) {
    const body = {
      postId: post.postId,
      value: value
    };
    return this.rest.postRequest(this.BASEPATH + '/Vote' + this.getSessionKeyAsAttribute(), body);
  }
 
  // Request, that performs a vote for a comment
  public voteComment(comment: Comment, value: number) {
    const body = {
      commentId: comment.commentId,
      value: value
    };
    return this.rest.postRequest(this.BASEPATH + '/VoteComment' + this.getSessionKeyAsAttribute(), body);
  }

  // Request, that grabs the full post data
  public getFullPost(postId: number): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Post?postId=' + postId + this.getSessionKeyAsSingleAttribute());
  }

  // Request, that performs an upload
  public upload(file: File): Observable<Response> {
    return this.rest.uploadRequest(this.BASEPATH + '/Upload', file);
  }
  //#endregion

  // Creates a sessionkey parameter postfix for an url
  private getSessionKeyAsAttribute() {
    const session = this.sessionService.getSession();
    if (session) {
      return '?sessionkey=' + session.sessionkey;
    } else {
      return '';
    }
  }

  // Creates a sessionkey parameter postfix for an url as an additional parameter
  private getSessionKeyAsSingleAttribute() {
    const session = this.sessionService.getSession();
    if (session) {
      return '&sessionkey=' + session.sessionkey;
    } else {
      return '';
    }
  }

  // Change ready state, trigger "ready state changed" event
  private SetReady(value: boolean) {
    this.ready = value;
    this.OnReadyChanged.emit(value);
  }

}
