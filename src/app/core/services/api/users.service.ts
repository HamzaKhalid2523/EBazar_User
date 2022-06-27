import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HelperService } from "../helper/helper.service";
import { CoreConfig } from "../helper/core.config";
import { AuthService } from "../helper/auth.service";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private apiPath: string = "";

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private authService: AuthService
  ) {
    this.apiPath = CoreConfig.getApiPath();
  }

  // Get Data
  public getData(query = {}): Observable<any> {
    const url = this.apiPath + '/users';
    const params = this.helperService.objectToHttpParams(query);

    return this.http.get(url, { params: params });
  }

  // Create Data
  public createData(body?, query = {}): Observable<any> {
    const url = this.apiPath + '/users';
    const params = this.helperService.objectToHttpParams(query);

    return this.http.post(url, body, { params: params });
  }

  // Update Data
  public updateData(id, body?, query = {}): Observable<any> {
    const url = this.apiPath + '/users/'+id;
    const params = this.helperService.objectToHttpParams(query);

    return this.http.put(url, body, { params: params });
  }

  // Delete Data
  public deleteData(id, body?, query = {}): Observable<any> {
    const url = this.apiPath + '/users/'+id;
    const params = this.helperService.objectToHttpParams(query);

    return this.http.request('delete', url, { params: params, body: body})
  }

  // Create Data
  public signupUser(body?, query = {}): Observable<any> {
    const url = this.apiPath + '/users/signup';
    const params = this.helperService.objectToHttpParams(query);

    let formData = {
      'phone': body.phone,
      'username': body.username,
      'email': body.email,
      'password': body.password,
      'code': body.verificationCode,
    };

    return this.http.post(url, formData, { params: params });
  }

  // Create Data
  public loginUser(user: string, password: string): Observable<any> {
    const url = this.apiPath + '/users/login';
    const body = { user, password };

    return this.http.post(url, body);
  }

  // Create Data
  public logoutUser(token): Observable<any> {
    const url = this.apiPath + '/users/logout';

    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  token)
    }

    return this.http.post(url, {}, header);
  }

  // Update Data
  public changePassowrd(id, body?, query = {}): Observable<any> {
    const url = this.apiPath + '/users/'+id+'/changePassword';
    const params = this.helperService.objectToHttpParams(query);

    return this.http.put(url, body, { params: params });
  }

  public getVerificationCode(phone): Observable<any> {
    const url = this.apiPath + '/users/getVerificationCode';

    return this.http.post(url, {phone});
  }
}
