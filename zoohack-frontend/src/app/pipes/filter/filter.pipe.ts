import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return [];
    }
    if (items.indexOf(searchText) != -1) {
      return [];
    } else {
      searchText = searchText.toLocaleLowerCase();
      return items.filter(it => {
        return it.toLocaleLowerCase().includes(searchText);
      });
    }
  }

}
