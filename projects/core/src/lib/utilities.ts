import { Observable, forkJoin, from, map } from 'rxjs';
import { merge } from 'lodash';

export const loadConfigurations = (urls: string[]): Observable<AppConfiguration> => {
    return forkJoin(urls.map((url) => from(fetch(url).then((x) => x.json())) as Observable<AppConfiguration>)).pipe(map((configs: AppConfiguration[]) => merge({}, ...configs) as AppConfiguration));
};

export interface ServiceOptions {
    name: string;
    settings: string[];
}

export interface BuildOptions {
    timestamp: Date;
    version: string;
    tag: string;
    suffix: string;
}

export interface AppConfiguration {
    service: ServiceOptions;
}
