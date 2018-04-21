import { Http, Headers, RequestOptions, Request, RequestMethod } from '@angular/http';
import { Component, Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class RestService {

  @Output() invalidSession = new EventEmitter<any>();

  constructor(private http: Http) { }

  public getRequest(ressourceAPI: string) {
    return this.http.get(ressourceAPI).map(data => data.json()).catch((e) => this.handleError(e));
  }

  public getRequestBody(ressourceAPI: string, body: any) {
    return this.http.get(ressourceAPI, body).map(data => data.json()).catch((e) => this.handleError(e));
  }

  public postFormRequest(ressourceAPI: string, body: any) {
    return this.http.post(ressourceAPI, body).catch((e) => this.handleError(e));
  }

  public postRequest(ressourceAPI: string, body: any) {
    return this.http.post(ressourceAPI, body).map(data => data.json()).catch((e) => this.handleError(e));
  }

  public putRequest(ressourceAPI: string, body: any) {
    return this.http.put(ressourceAPI, body).map(data => data.json()).catch((e) => this.handleError(e));
  }

  public deleteRequest(ressourceAPI: string) {
    return this.http.delete(ressourceAPI).catch((e) => this.handleError(e));
  }

  handleError(e) {
    if (e.status === 401) {
      this.invalidSession.emit();
    }else if (e.status >= 400) {
      return Observable.throw(e);
    }
  }
}
