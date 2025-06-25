import { inject } from '@angular/core';
import { AuthorizationService } from './authorization.service';

/**
 * @deprecated Use `AuthorizationGuard` instead
 * @param policy 
 * @returns 
 */
export const requireAuthorization = (policy: string): (() => Promise<boolean>) => {
    return async () => {
        const authorized = await inject(AuthorizationService).authorize(policy);
        return authorized;
    };
};
