import { Post, Response, Session, Comment } from './../entities/interfaces';
import { RestService } from './rest.service';
import { Component, Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RedditApiService {

  @Output() loggedIn = new EventEmitter<any>();
  @Output() loggedOut = new EventEmitter<any>();
  @Output() sessionUpdated = new EventEmitter<any>();

  public BASEPATH = 'http://localhost:8081';
  public session: Session;

  constructor(private rest: RestService) {
    this.rest.invalidSession.subscribe(() => {
      this.removeSession();
    });
  }

  public getNewPosts(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/post/new' + this.getSessionKeyAsAttribute());
  }

  public getHotPosts(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/post/hot' + this.getSessionKeyAsAttribute());
  }

  public login(username: string, password: string): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/login?username=' + username + '&password=' + password);
  }

  public logout(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/logout?sessionkey=' + this.session.sessionkey);
  }

  public register(username: string, password: string): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/register?username=' + username + '&password=' + password);
  }

  public getUser(userId: number): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/user?userId=' + userId);
  }

  public createPost(post): Observable<Response> {
    return this.rest.postRequest(this.BASEPATH + '/post?sessionkey=' + this.session.sessionkey, post);
  }

  public createComment(comment): Observable<Response> {
    return this.rest.postRequest(this.BASEPATH + '/comment?sessionkey=' + this.session.sessionkey, comment);
  }

  public vote(post: Post, value: number) {
    const body = {
      postId: post.postId,
      value: value
    };
    return this.rest.putRequest(this.BASEPATH + '/post/vote?sessionkey=' + this.session.sessionkey, body);
  }

  public voteComment(comment: Comment, value: number) {
    const body = {
      commentId: comment.id,
      value: value
    };
    return this.rest.putRequest(this.BASEPATH + '/comment/vote?sessionkey=' + this.session.sessionkey, body);
  }

  public getFullPost(postId: number): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/post?postId=' + postId + this.getSessionKeyAsSingleAttribute());
  }

  public upload(img: File): Observable<Response> {
    return Observable.create(observer => {
      const formData: FormData = new FormData();
      formData.append('image', img, img.name);

      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(new Error('file upload failed'));
          }
        }
      };
      xhr.open('PUT', this.BASEPATH + '/post/upload', true);
      xhr.send(formData);
    });
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

  public checkSession() {
    return this.rest.getRequest(this.BASEPATH + '/validate?sessionkey=' + this.session.sessionkey);
  }
  //#endregion

}
