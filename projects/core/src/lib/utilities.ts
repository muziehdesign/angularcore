import { Observable, firstValueFrom, forkJoin, from, map } from 'rxjs';
import { merge } from 'lodash';

export const loadConfigurations = <T>(urls: string[]): Promise<T> => {
    const forked$ = forkJoin(urls.map((url) => from(fetch(url).then((x) => x.json())) as Observable<AppConfiguration>)).pipe(map((configs: AppConfiguration[]) => merge({}, ...configs) as T));
    return firstValueFrom(forked$);
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