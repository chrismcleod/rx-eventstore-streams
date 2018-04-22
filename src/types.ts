import Rx from 'rxjs/Rx';

export type PromiseType<T extends Promise<any>> = T extends Promise<infer R> ? R : any;

export interface Credentials {
  username: string;
  password: string;
}

export interface Config {
  host: string;
  port: number;
  credentials?: Credentials;
}

export interface Event<TData = any> {
  code: number;
  correlationId: string;
  type: string;
  data: TData;
}

export interface Command {
  code: number;
  correlationId?: string;
  data?: any;
  credentials?: Credentials;
}

export interface Client {
  $: Rx.Observable<Event>;
  send: (command: Command) => string;
}

export interface StreamAccumulation {
  total: number;
  read: number;
  buffer: number[];
}
