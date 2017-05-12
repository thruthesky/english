import { Component } from '@angular/core';
import { ClassInformation } from '../../reservation/reservation-interface';
import { ShareService } from '../../../providers/share-service';
@Component({
    selector: 'reservation-banner-component',
    templateUrl: 'reservation.html',
    styleUrls: ['./reservation.scss']
})
export class ReservationBannerComponent {
    constructor( public share: ShareService ) { }
}