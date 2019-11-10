import { Component, OnInit, NgZone } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  animalName: any;
  tags: any;
  priceData: any;
  numberData: any;
  prices: any[];
  dates: any[];
  numbers: any[];
  advertsFound: number;
  maxPrice: number;
  minPrice: number;
  constructor(
    private _authService: AuthorizationService,
    private zone: NgZone
  ) {
    this.animalName = { question: 'Search Species', options: ['Snake', 'Python', 'Popo'], answer: null };
    this.tags = { answer: null, options: ['Skin', 'Bones', 'Something'], selectedTags: [] };
    setTimeout(() => {   
    this.priceData = { prices: [ 0 ], dates: ['1'] };
    this.numberData = { numbers: [ 0 ], dates: ['1'] };
    }, 3000);
    this.advertsFound = 0;
    this.minPrice = 0;
    this.maxPrice = 0;

  }

  ngOnInit() {
    this.getSpecies();
  }

  getSpecies() {
    this._authService.postWithBody('fauna/getspecies', {}).subscribe(
      (data: any) => { this.animalName.options = data; }
    )
  }

  getTags(speciesName: string) {
    this._authService._toastr.info('Fetching relevant tags for ' + speciesName, '', { progressBar: true });
    this._authService.postWithBody('fauna/getkeywords', { tags: speciesName }).subscribe(
      (data: any) => {
        if (data.keywords.length) {
          this.tags.options = data.keywords;
          this._authService._toastr.success(data.keywords.length + ' tags found.')
        } else {
          this._authService._toastr.error('No Tags found!')
        }
      }
    )
  }

  selectSpecies(speciesName: string) {
    if (this.animalName.options.indexOf(speciesName) != -1) {
      this.getTags(speciesName);
    }
  }

  selectTag(tag: string) {
    console.log(tag);
    if ((this.tags.selectedTags.indexOf(tag) === -1) && (this.tags.options.indexOf(tag) != -1)) {
      this.tags.selectedTags.push(tag);
      this.tags.answer = null;
      this.getData(this.animalName.answer, this.tags.selectedTags);
    }
  }

  deselectTag(tag: string) {
    if (this.tags.selectedTags.indexOf(tag) != -1) {
      this.tags.selectedTags.splice(this.tags.selectedTags.indexOf(tag), 1); this.getData(this.animalName.answer, this.tags.selectedTags);
    }
  }

  transformData(data: any[]) {
    this.prices = [];
    this.dates = [];
    this.numbers = [];
    console.log(data[0]);
    let date = '';
    var index = 0;
    var count = 1;
    var price = 0;
    this.minPrice = data[0].Price;
    this.maxPrice = data[0].Price;
    data.forEach(element => {

      if (element.Date) {
        if (element.Price < this.minPrice) {
          this.minPrice = element.Price;
        } else if (element.Price > this.maxPrice) {
          this.maxPrice = element.Price;
        }
        if (date === element.Date.slice(0, 10)) {
          count++;
          price += element.Price;
        } else {
          this.prices[index] = price / count;
          this.dates[index] = element.Date.slice(0, 10);
          this.numbers[index] = count;
          index++;
          count = 1;
          price = element.Price;
          date = element.Date.slice(0, 10);
          console.log(price, count, date);
        }
      }
    });
    console.log('final', this.prices, this.numbers, this.dates);
    this.advertsFound = this.dates.length;
    this.priceData = { prices: this.prices, dates: this.dates };
    this.numberData = { numbers: this.numbers, dates: this.dates };

  }

  getData(speciesName: string, tags?: string[]) {
    this._authService._toastr.info('Fetching Data', '', { timeOut: 3000 })
    this._authService.postWithBody('fauna/findbykeywords', { tag: speciesName, keywords: tags }).subscribe(
      (data: any) => {
        if (data.objects.length) {
          this.transformData(data.objects);
        }
      }
    );
  }


}
