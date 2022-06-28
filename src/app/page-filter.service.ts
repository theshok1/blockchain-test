import { Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageFilterService {

  currentPage: BehaviorSubject<number> = new BehaviorSubject(1);

  filter = this.fb.group({
    name: [''],
    token: [''],
    timestamp: this.fb.array([]),
    baseAmount: ['']
  })
  
  constructor(private fb: FormBuilder) { }

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

  nexPage(): void {
    this.currentPage.next(this.currentPage.value + 1);
  }

  prevPage(): void {
    if (this.currentPage.value != 1) {
      this.currentPage.next(this.currentPage.value - 1);
    }
  }

  setValue(res: any): void {
    this.timestamp.clear();
    this.name?.setValue(res.name);
    this.token?.setValue(res.token);
    for (let i = 0; i < res.timestamp.length; i++) {
      const el = res.timestamp[i];
      
      this.timestamp.push(this.fb.control(el))
    }
    this.baseAmount?.setValue(res.baseAmount);
  }
}
