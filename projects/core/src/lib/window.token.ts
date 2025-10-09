
import { InjectionToken, inject, DOCUMENT } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WindowToken', {
    factory: () => inject(DOCUMENT).defaultView!,
});
