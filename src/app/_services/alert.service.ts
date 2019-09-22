import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    eraseMessage(errBool: boolean) {
        this.subject.next({ isError: errBool, text: "", visible: false });
    }

    setMesseage(message: String, errBool: boolean) {
        this.subject.next({ isError: errBool, text: message, visible: true });
        setTimeout(() => {
            this.eraseMessage(errBool);
        }, 4000);
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}