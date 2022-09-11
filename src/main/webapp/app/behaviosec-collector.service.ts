import { Injectable } from '@angular/core';

declare var bw: any;

@Injectable({
  providedIn: 'root',
})
export class BehaviosecCollectorService {
  startMonitor() {
    console.log('startMonitor');
    bw.startMonitor();
  }

  stopMonitor() {
    console.log('stopMonitor');
    bw.stopMonitor();
  }

  getData() {
    console.log('getData');
    return bw.getData(true);
  }

  reset() {
    console.log('reset');
    bw.reset();
  }

  constructor() {}
}
