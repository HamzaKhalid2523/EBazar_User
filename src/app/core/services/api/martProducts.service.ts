import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "../helper/helper.service";
import { CoreConfig } from "../helper/core.config";

@Injectable({
  providedIn: "root",
})
export class MartProductsService {
  private apiPath: string = "";

  constructor(private http: HttpClient, private helperService: HelperService) {
    this.apiPath = CoreConfig.getApiPath();
  }

  // Get Data
  public getData(query = {}): Observable<any> {
    const url = this.apiPath + '/martProducts';
    const params = this.helperService.objectToHttpParams(query);

    return this.http.get(url, { params: params });
  }

  public getById(id): Observable<any> {
    const url = this.apiPath + '/martProducts/'+id;

    return this.http.get(url);
  }
}
