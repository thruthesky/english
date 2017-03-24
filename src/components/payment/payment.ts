import { Component, Input } from '@angular/core';
@Component({
    selector: 'payment-component',
    templateUrl: 'payment.html',
    styleUrls: ['./payment.scss']
})
export class PaymentComponent {
    @Input() numberDesign;   
}