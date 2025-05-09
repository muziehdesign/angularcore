import { Injectable } from '@angular/core';
import { Logger } from '@muziehdesign/angularcore';

@Injectable()
export class CustomLogger extends Logger {
  constructor() {
    super();
  }

  override logInfo(message: string, ...optionalParams: any[]): void {
    // Custom implementation for info logging
    console.info('Custom Info:', message, ...optionalParams);
  }
}
