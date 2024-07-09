import { AuthenticationOptions } from '@muziehdesign/angularcore';
import { BuildInfo } from './build-info';

export class AppConfig {
    service?: {
        name: string;
    };
    catalogApi?: {
        url: string;
    };
    shoppingCartApi?: {
        url: string;
    };
    identity: AuthenticationOptions = {} as AuthenticationOptions;
    build: BuildInfo = {} as BuildInfo;
}
