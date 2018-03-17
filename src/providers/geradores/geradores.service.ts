import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class GeradoresService {
  private apiUrl:string = 'https://jsonplaceholder.typicode.com';
  
  constructor(public http: HttpClient) {
    
  }
  getUsers() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/users').subscribe(data => {
          resolve(data);
          console.log('getting users');
          
      }, (err) => {
         reject(err);
      });
    });
  }
  addUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/users', JSON.stringify(data), {
        headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
        params: new HttpParams().set('id', '3'),
      })
      .subscribe(res => {
        resolve(res);
        console.log('adding users');
      }, (err) => {
        reject(err);
      });
    });
  }
  
}
