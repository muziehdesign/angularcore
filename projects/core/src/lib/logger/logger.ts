import { Injectable } from "@angular/core";

export abstract class BaseLogger {
    private logLevel = LogLevel.Debug;

    setLevel(newLevel: LogLevel) {
        this.logLevel = newLevel;
    }

    logMessage(logLevel: LogLevel, message?: any, ...optionalParams: any[]): void {
        if(LOG_LEVELS.get(logLevel)! < LOG_LEVELS.get(this.logLevel)!){
            return;
        }
        
        if(logLevel === LogLevel.Critial) {
            this.logCritical(message, ...optionalParams);
        } else if(logLevel === LogLevel.Error) {
            this.logError(message, ...optionalParams);
        } else if(logLevel === LogLevel.Warning) {
            this.logWarning(message, ...optionalParams);
        } else if(logLevel === LogLevel.Info) {
            this.logInfo(message, ...optionalParams);
        } else if(logLevel === LogLevel.Debug) {
            this.logDebug(message, ...optionalParams);
        } else {
            this.logCritical(message, ...optionalParams);
        } 
    }

    error(message?: any, ...optionalParams: any[]): void {
        this.logMessage(LogLevel.Error, message, ...optionalParams);
    }

    info(message?: any, ...optionalParams: any[]): void {
        this.logMessage(LogLevel.Info, message, ...optionalParams);
    }

    debug(message?: any, ...optionalParams: any[]): void {
        this.logMessage(LogLevel.Debug, message, ...optionalParams);
    }

    warn(message?: any, ...optionalParams: any[]): void {
        this.logMessage(LogLevel.Warning, message, ...optionalParams);
    }

    critical(message?: any, ...optionalParams: any[]): void {
        this.logMessage(LogLevel.Error, message, ...optionalParams);
    }

    protected abstract logError(message?: any, ...optionalParams: any[]): void;
    protected abstract logInfo(message?: any, ...optionalParams: any[]): void;
    protected abstract logDebug(message?: any, ...optionalParams: any[]): void;
    protected abstract logWarning(message?: any, ...optionalParams: any[]): void;
    protected abstract logCritical(message?: any, ...optionalParams: any[]): void;
}

@Injectable({providedIn: 'root'})
export class Logger extends BaseLogger {
    protected override logError(message?: any, ...optionalParams: any[]): void {
        console.error(message, ...optionalParams);
    }
    protected override logInfo(message?: any, ...optionalParams: any[]): void {
        console.info(message, ...optionalParams);
    }

    protected override logDebug(message?: any, ...optionalParams: any[]): void {
        console.log('debug?');
        console.debug(message, ...optionalParams);
    }

    protected override logWarning(message?: any, ...optionalParams: any[]): void {
        console.warn(message, ...optionalParams);
    }

    protected override logCritical(message?: any, ...optionalParams: any[]): void {
        console.error(message, ...optionalParams);
    }
}

/**
 * Log levels, ordered by severity asc.
 */
export enum LogLevel {
    None = 'none',
    Debug = 'debug',
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
    Critial = 'critical'
}

export const LOG_LEVELS = new Map<LogLevel, number> ([
    [LogLevel.None, 0],
    [LogLevel.Debug, 1],
    [LogLevel.Info, 2],
    [LogLevel.Warning, 3],
    [LogLevel.Error, 4],
    [LogLevel.Critial, 5]
]);