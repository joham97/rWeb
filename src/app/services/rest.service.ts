import { Http, RequestOptions } from '@angular/http';
import { Component, Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpRequest } from '@angular/common/http';

@Injectable()
export class RestService {

  @Output() invalidSession = new EventEmitter<any>();

  constructor(private http: Http) { }

  // GET-Request ausführen
  public getRequest(ressourceAPI: string) {
    return this.http.get(ressourceAPI).map(data => data.json()).catch((e) => {
      if (e.status >= 400) {
        return Observable.throw(e);
      }
    });
  }

  // POST-Request ausführen
  public postRequest(ressourceAPI: string, body: any) {
    return this.http.post(ressourceAPI, body).map(data => data.json()).catch((e) => {
      if (e.status >= 400) {
        return Observable.throw(e);
      }
    });
  }

  // PUT-Request ausführen
  public putRequest(ressourceAPI: string, body: any) {
    return this.http.put(ressourceAPI, body).map(data => data.json()).catch((e) => {
      if (e.status >= 400) {
        return Observable.throw(e);
      }
    });
  }

  // DELETE-Request ausführen
  public deleteRequest(ressourceAPI: string, body: any) {
    return this.http.delete(ressourceAPI, new RequestOptions({ body: body })).map(data => data.json()).catch((e) => {
      if (e.status >= 400) {
        return Observable.throw(e);
      }
    });
  }

  // Upload-Request ausführen
  public uploadRequest(ressourceAPI: string, file: File) {
    const formData = new FormData();
    formData.append(file.name, file);

    return this.http.post(ressourceAPI, formData).map(data => data.json()).catch((e) => {
      if (e.status >= 400) {
        return Observable.throw(e);
      }
    });
  }

  handleError(e) {
    if (e.status === 401) {
      this.invalidSession.emit();
    } else if (e.status >= 400) {
      return Observable.throw(e);
    }
  }
}
