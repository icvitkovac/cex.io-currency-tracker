import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToIterable',
  pure: false
})
export class MapToIterablePipe implements PipeTransform {
  transform(obj: any) {
    return Array.from(obj);
  }
}