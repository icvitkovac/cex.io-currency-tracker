import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { LastPrice } from './lastPrice';


@Injectable()
export class LastPriceService {

  private baseUrl = 'https://cex.io/api/';

  constructor(private http: HttpClient) { }

  getLastPriceForPair(key: string): Observable<LastPrice> {

    const url = `${this.baseUrl}last_price/${key}`;

    return this.http.get<LastPrice>(url).pipe(

      catchError(this.handleError<LastPrice>(`getLastPriceForPair id=${key}`))

    );
  }

  getLastPrices(): Observable<any> {

    const url = `${this.baseUrl}last_prices/USD/EUR/GBP/RUB`;

    return this.http.get<LastPrice[]>(url).pipe(

      catchError(this.handleError(`getLastPrices`, []))

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