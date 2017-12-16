import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { LastPrice } from './lastPrice';


@Injectable()
export class LastPriceService {

  private baseUrl = 'https://cex.io/api/last_price';
  constructor(private http: HttpClient) { }


  getLastPriceForPair(key: string): Observable<LastPrice> {
    const url = `${this.baseUrl}/${key}`;
    return this.http.get<LastPrice>(url).pipe(
      catchError(this.handleError<LastPrice>(`getLastPriceForPair id=${key}`))
    );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }

}