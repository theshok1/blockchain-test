import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { BehaviorSubject, concat } from 'rxjs';
import { BinanceService } from '../binance.service';
import { PageFilterService } from '../page-filter.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  rates: any[] = [];
  ratesObs: any[] = [];
  loading: boolean = true;
  error: any;

  currentPage: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItemIndex!: number;
  endItemIndex!: number;
  endPage!: number;

  filter = this.fb.group({
    name: [''],
    token: [''],
    timestamp: this.fb.array([]),
    baseAmount: ['']
  })

  open: boolean = false;
  checkedCheckbox: number = 0;

  constructor (private binance: BinanceService,
    private pafa: PageFilterService,
    private fb: FormBuilder) {
      pafa.currentPage.subscribe(res => {
        this.currentPage.next(res);
        this.endItemIndex = res * 5;
        this.currentItemIndex = this.endItemIndex - 5;
      })
  }

  get name() {
    return this.filter.get('name');
  }

  get token() {
    return this.filter.get('token');
  }

  get timestamp() {
    return this.filter.get('timestamp') as FormArray;
  }

  get baseAmount() {
    return this.filter.get('baseAmount');
  }

  ngOnInit(): void {
    this.binance.rates.subscribe(res => {
      this.ratesObs = res;
      this.rates = this.rateFilter(this.name?.value, this.timestamp?.value, this.baseAmount?.value);
      this.endPage = Math.ceil(this.rates.length / 5);
    })
    this.binance.loading.subscribe(res => {
      this.loading = res;
    })
    this.binance.error.subscribe(res => {
      this.error = res;
    })
    this.filter.valueChanges.subscribe(res => {
      this.pafa.setValue(res);
      this.rates = this.rateFilter(this.name?.value, this.timestamp?.value, this.baseAmount?.value);
      this.endPage = Math.ceil(this.rates.length / 5);
    })
    this.setStartValue(this.pafa.filter.value);
    if (this.timestamp.length > 0) {
      this.checkedCheckbox = this.timestamp.length;
      this.setTimestamp(document.getElementById('timestamp'), 'change');

      for (let i = 0; i < document.getElementsByName('timestamp').length; i++) {
        const elem = document.getElementsByName('timestamp')[i];

        for (let i = 0; i < this.timestamp.getRawValue().length; i++) {
          const el = this.timestamp.getRawValue()[i];
          
          if (el == elem.getAttribute('value')) {
            elem.setAttribute('checked', '');
            elem.setAttribute('data-index', i.toString());
          }
        }
      }
    }
  }

  rateFilter(name: string, timestamp: string, baseAmount: string): any[] {
    let elem = this.ratesObs;
    let arr: any[] = [];

    if (timestamp.length > 0) {
      for (let i = 0; i < timestamp.length; i++) {
        const el = timestamp[i];
        
        arr = arr.concat(elem.filter(a => a.block.timestamp.month == el));
        
        if (i == (timestamp.length - 1)) {
          elem = arr;
        }
      }
    }

    return elem = elem.filter(a => a.baseCurrency?.name.toLowerCase().includes(name) && a.baseAmount.toString().includes(baseAmount));
  }

  setStartValue(res: any): void {
    this.name?.setValue(res.name);
    this.token?.setValue(res.token);
    for (let i = 0; i < res.timestamp.length; i++) {
      const el = res.timestamp[i];
      
      this.timestamp.push(this.fb.control(el))
    }
    this.baseAmount?.setValue(res.baseAmount);
  }

  nextPage(): void {
    this.pafa.nexPage();
  }
  prevPage(): void {
    this.pafa.prevPage();
  }
  setTimestamp(e: any, event: string) {
    if (event == 'openClose') {
      e.value = `Выбрано: ${this.checkedCheckbox}`;
      if (this.open == false) {
        this.open = true;
      } else {
        if (this.checkedCheckbox == 0) {
          e.value = ``;
        }
        this.open = false
      }
    } else if(event == 'change') {
      e.value = `Выбрано: ${this.checkedCheckbox}`;
    }
    
  }

  onTogle(e: any) {
    if (e.target.checked == true) {
      this.timestamp.push(this.fb.control(e.target.value));
      this.checkedCheckbox = this.checkedCheckbox + 1;
      e.target.attributes['data-index'].value = this.checkedCheckbox - 1;
    } else {
      this.timestamp.removeAt(e.target.attributes['data-index'].value);
      this.checkedCheckbox = this.checkedCheckbox - 1;
      
      for (let i = 0; i < document.getElementsByName('timestamp').length; i++) {
        const el = document.getElementsByName('timestamp')[i];
        
        if (Number(el.getAttribute('data-index')) > e.target.attributes['data-index'].value) {
          el.setAttribute('data-index', String(Number(el.getAttribute('data-index')) - 1));
        }
      }
    }
    this.setTimestamp(document.getElementById('timestamp'), 'change');
  }
}
