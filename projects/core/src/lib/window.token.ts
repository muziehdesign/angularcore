import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WindowToken', {
    factory: () => inject(DOCUMENT).defaultView!,
});
