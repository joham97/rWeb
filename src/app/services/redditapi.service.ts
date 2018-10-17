import { Http } from '@angular/http';
import { Post, Response, Session, Comment } from './../entities/interfaces';
import { RestService } from './rest.service';
import { Component, Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RedditApiService {

  @Output() loggedIn = new EventEmitter<any>();
  @Output() loggedOut = new EventEmitter<any>();
  @Output() sessionUpdated = new EventEmitter<any>();

  public BASEPATH = 'http://10.112.16.42:8080/api';
  public session: Session;

  constructor(private rest: RestService) {
    this.rest.invalidSession.subscribe(() => {
      this.removeSession();
    });
  }

  public getNewPosts(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Posts?type=new' + this.getSessionKeyAsSingleAttribute());
  }

  public getHotPosts(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Posts?type=hot' + this.getSessionKeyAsSingleAttribute());
  }

  public login(username: string, password: string): Observable<Response> {
    var body = { username, password };
    return this.rest.postRequest(this.BASEPATH + '/Login', body);
  }

  public logout(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Logout' + this.getSessionKeyAsAttribute());
  }

  public register(username: string, password: string): Observable<Response> {
    var body = { username, password };
    return this.rest.postRequest(this.BASEPATH + '/Register', body);
  }

  public checkSession() {
    return this.rest.getRequest(this.BASEPATH + '/Validate' + this.getSessionKeyAsAttribute());
  }

  public getUser(userId: number): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/User?userId=' + userId);
  }

  public createPost(post): Observable<Response> {
    return this.rest.postRequest(this.BASEPATH + '/Post' + this.getSessionKeyAsAttribute(), post);
  }

  public createComment(comment): Observable<Response> {
    return this.rest.postRequest(this.BASEPATH + '/Comment' + this.getSessionKeyAsAttribute(), comment);
  }

  public vote(post: Post, value: number) {
    const body = {
      postId: post.postId,
      value: value
    };
    return this.rest.postRequest(this.BASEPATH + '/Vote' + this.getSessionKeyAsAttribute(), body);
  }

  public voteComment(comment: Comment, value: number) {
    const body = {
      commentId: comment.commentId,
      value: value
    };
    return this.rest.postRequest(this.BASEPATH + '/VoteComment' + this.getSessionKeyAsAttribute(), body);
  }

  public getFullPost(postId: number): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Post?postId=' + postId + this.getSessionKeyAsSingleAttribute());
  }

  public upload(file: File): Observable<Response> {
    return this.rest.uploadRequest(this.BASEPATH + '/Upload', file);
  }

  //#region Verwaltung der Session
  public getSession(): Session {
    if (!this.session) {
      this.session = JSON.parse(localStorage.getItem('session'));
    }
    return this.session;
  }

  public setSession(session: Session) {
    this.session = session;
    localStorage.setItem('session', JSON.stringify(session));
  }

  public removeSession() {
    this.session = null;
    localStorage.removeItem('session');
    this.loggedOut.emit();
  }

  private getSessionKeyAsAttribute() {
    if (this.session) {
      return '?sessionkey=' + this.session.sessionkey;
    } else {
      return '';
    }
  }

  private getSessionKeyAsSingleAttribute() {
    if (this.session) {
      return '&sessionkey=' + this.session.sessionkey;
    } else {
      return '';
    }
  }

  public isLoggedIn() {
    return this.getSession() != null;
  }
  //#endregion

}
