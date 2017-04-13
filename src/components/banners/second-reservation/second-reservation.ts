import { Component } from '@angular/core';
import { ClassInformation } from '../../reservation/reservation-interface';

@Component({
    selector: 'second-reservation-banner-component',
    templateUrl: 'second-reservation.html',
    styleUrls: ['./second-reservation.scss']
})
export class SecondReservationBannerComponent {
    classinformation:ClassInformation = null;
}