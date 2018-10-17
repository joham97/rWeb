import { Http, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class RestService {

  @Output() invalidSession = new EventEmitter<any>();

  constructor(private http: Http) { }

  // GET-Request ausführen
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

  // POST-Request ausführen
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

  // PUT-Request ausführen
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

  // DELETE-Request ausführen
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

  // Upload-Request ausführen
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

  handleError(e) {
    if (e.status === 401) {
      this.invalidSession.emit();
    } else if (e.status >= 400) {
      throwError(e);
    }
  }
}
