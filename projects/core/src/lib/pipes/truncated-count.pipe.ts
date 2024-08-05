import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncatedCount',
  standalone: true
})
export class TruncatedCountPipe implements PipeTransform {

  transform(value: number, max = 99): string {
    return value > max ? `${max}+` : value.toString();
  }

}
