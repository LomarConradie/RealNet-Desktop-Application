import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackBarSubject = new Subject<any>();
  public snackBarState = this.snackBarSubject.asObservable();

  constructor() { }

  show(message: string, type?: string) {
    this.snackBarSubject.next({
      show: true,
      message,
      type
    });
  }
}
