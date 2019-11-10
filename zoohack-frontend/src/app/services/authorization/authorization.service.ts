import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  base_url: string

  constructor(
    private _http: HttpClient,
    public _toastr: ToastrService
  ) {
    this.base_url = 'http://192.168.43.99:3000';
  }

  postWithBody(relativeUrl: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this._http.post<any>(this.base_url + '/' + relativeUrl, JSON.stringify(body), httpOptions);
  }



}
