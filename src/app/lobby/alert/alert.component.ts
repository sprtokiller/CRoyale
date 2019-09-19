import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../_services/alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;
    visible: boolean;
    isError: boolean;
    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.visible = false;
        this.message = true;
        this.subscription = this.alertService.getMessage().subscribe(message => { 
            this.message = message; 
            message ?
            this.visible = message.visible : false;
        
            //console.log(JSON.stringify(message));
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}