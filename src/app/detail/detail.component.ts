import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BinanceService } from '../binance.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  rateName: string | null = '';
  rate: any = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private binance: BinanceService) { }

  ngOnInit(): void {
    this.rateName = this.route.snapshot.paramMap.get('id');
    this.binance.rates.subscribe((res: any[]) => {
      this.rate = res.filter(a => a.baseCurrency.name == this.rateName);
    })
  }

  backToIndexPage(): void {
    this.router.navigate(['/list']);
  }

}
