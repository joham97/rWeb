import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Service, that performs api call and handles exceptions
@Injectable()
export class RestService {

  constructor(private http: Http) { }

  // Perform GET-Request
  public getRequest(ressourceAPI: string) {
    return this.http.get(ressourceAPI).pipe(
      map(data => data.json()),
      catchError((e) => {
        if (e.status >= 400) {
          return throwError(e);
        }
      }
    ));
  }

  // Perform POST-Request with Body
  public postRequest(ressourceAPI: string, body: any) {
    return this.http.post(ressourceAPI, body).pipe(
      map(data => data.json()),
      catchError((e) => {
        if (e.status >= 400) {
          return throwError(e);
        }
      }
    ));
  }

  // Perform PUT-Request with Body
  public putRequest(ressourceAPI: string, body: any) {
    return this.http.put(ressourceAPI, body).pipe(
      map(data => data.json()),
      catchError((e) => {
        if (e.status >= 400) {
          return throwError(e);
        }
      }
    ));
  }

  // Perform DELETE-Request with Body
  public deleteRequest(ressourceAPI: string, body: any) {
    return this.http.delete(ressourceAPI, new RequestOptions({ body: body })).pipe(
      map(data => data.json()),
      catchError((e) => {
        if (e.status >= 400) {
          return throwError(e);
        }
      }
    ));
  }

  // Perform POST-Request with an attacted file  
  public uploadRequest(ressourceAPI: string, file: File) {
    const formData = new FormData();
    formData.append(file.name, file);

    return this.http.post(ressourceAPI, formData).pipe(
      map(data => data.json()),
      catchError((e) => {
        if (e.status >= 400) {
          return throwError(e);
        }
      }
    ));
  }
}
