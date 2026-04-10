import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export const LOG_DEFAULT_OPTIONS = new InjectionToken<LogConfig>('LOG_DEFAULT_OPTIONS');

@Injectable({
  providedIn: 'root'
})
export class Log {

  constructor(@Inject(LOG_DEFAULT_OPTIONS) @Optional() private options: LogConfig | null) { }

}


export interface LogConfig {
  level?: LogLevel;
  name?: string;
}

export type LogLevel = keyof typeof LOG_LEVELS;

export const LOG_LEVELS = {
  'none': 0,
  'debug': 1,
  'info': 2,
  'warning': 3,
  'error': 4,
  'critical': 5
};