import { Component } from '@angular/core';
import { ClassInformation } from '../../reservation/reservation-interface';
@Component({
    selector: 'reservation-banner-component',
    templateUrl: 'reservation.html',
    styleUrls: ['./reservation.scss']
})
export class ReservationBannerComponent {
    classinformation:ClassInformation = null;
}