import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {

  rates: BehaviorSubject<any[]> = new BehaviorSubject(<any>[]);
  loading: BehaviorSubject<boolean> = new BehaviorSubject(<boolean>true);
  error: Subject<any> = new Subject();

  constructor(private apollo: Apollo) {
    this.apollo.watchQuery({
      query: gql`
        {
          binance {
            trades {
              baseAmount
              baseCurrency {
                address
                tokenId
                name
              }
              count
              quoteAmount
              block {
                timestamp {
                  month
                }
              }
            }
          }
        }
      `,
    })
    .valueChanges.subscribe((res: any) => {
      this.rates.next(res?.data?.binance.trades);
      this.loading.next(res.loading);
      this.error.next(res.error);
    })
  }
}
