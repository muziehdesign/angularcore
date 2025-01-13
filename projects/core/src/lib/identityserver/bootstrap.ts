import { AuthenticationOptions } from './authentication-options';
import { AuthenticationService } from './authentication.service';

export const bootstrapAuthenticationService = async (settings: AuthenticationOptions) => {
    const service = new AuthenticationService(settings);
    return service;
}
