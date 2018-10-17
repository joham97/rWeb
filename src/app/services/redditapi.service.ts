import { Http } from '@angular/http';
import { Post, Response, Session, Comment } from './../entities/interfaces';
import { RestService } from './rest.service';
import { Component, Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SessionService } from './session.service';

@Injectable()
export class RedditApiService {

  @Output() loggedIn = new EventEmitter<any>();
  @Output() loggedOut = new EventEmitter<any>();
  @Output() loginError = new EventEmitter<any>();

  // Gib an, ob die Session geladen und geprüft wurde
  public ready: boolean = false;
  // Hat sich der Sessionladestatus geändert
  @Output() OnReadyChanged = new EventEmitter<boolean>();

  public BASEPATH = 'http://10.112.16.42:8080/api';

  constructor(private rest: RestService, private sessionService: SessionService) {
    if (sessionService.hasSession()) {
      this.ValidateToken();
    } else {
      this.SetReady(true);
    }
  }

  public getNewPosts(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Posts?type=new' + this.getSessionKeyAsSingleAttribute());
  }

  public getHotPosts(): Observable<Response> {
    return this.rest.getRequest(this.BASEPATH + '/Posts?type=hot' + this.getSessionKeyAsSingleAttribute());
  }

  public login(username: string, password: string) {
    var body = { username, password };
    this.rest.postRequest(this.BASEPATH + '/Login', body).subscribe(
      (response: Response) => {
        // Session-Objekt erzeugen
        var session: Session = response.data;
        this.sessionService.setSession(session);
        this.loggedIn.emit();
      },
      // Login Error verarbeiten
      (error) => {
        if(error.status){
          this.loginError.emit(error);
        } else {
          this.loginError.emit({status: -1});
        }
      });
  }

  public logout() {
    this.rest.getRequest(this.BASEPATH + '/Logout' + this.getSessionKeyAsAttribute()).subscribe(
      (response: Response) => {
        // Session-Objekt entfernen
        this.sessionService.removeSession();
        this.loggedOut.emit();
      },
      (error) => {
        // Session-Objekt entfernen, trotz Fehler
        this.sessionService.removeSession();
        this.loggedOut.emit();
      });
  }

  public register(username: string, password: string): Observable<Response> {
    var body = { username, password };
    return this.rest.postRequest(this.BASEPATH + '/Register', body);
  }

  // Validierung der vorhandenen Session
  public ValidateToken() {
    return this.rest.getRequest(this.BASEPATH + '/Validate' + this.getSessionKeyAsAttribute()).subscribe(
      (response: Response) => { 
        // Login-Event auslösen
        this.loggedIn.emit();
        this.SetReady(true);
      },
      (error) => {
        // Session-Objekt entfernen
        this.sessionService.removeSession();
        // Logout-Event auslösen
        this.loggedOut.emit();
        this.SetReady(true);
      });
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
  //#endregion

  private getSessionKeyAsAttribute() {
    const session = this.sessionService.getSession();
    if (session) {
      return '?sessionkey=' + session.sessionkey;
    } else {
      return '';
    }
  }

  private getSessionKeyAsSingleAttribute() {
    const session = this.sessionService.getSession();
    if (session) {
      return '&sessionkey=' + session.sessionkey;
    } else {
      return '';
    }
  }

  // Setzen des Ready-Parameters (Ist Session überprüft?)
  private SetReady(value: boolean) {
    this.ready = value;
    this.OnReadyChanged.emit(value);
  }

}
