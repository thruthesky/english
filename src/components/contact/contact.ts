import { Component, Input } from '@angular/core';
@Component({
    selector: 'contact-component',
    templateUrl: 'contact.html',
    styleUrls: ['./contact.scss']
})
export class ContactComponent {
    @Input() numberDesign;   
}