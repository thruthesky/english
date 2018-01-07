import { Component } from '@angular/core';


@Component({
    selector: 'my-page-component',
    templateUrl: 'my-page.html',
    styleUrls: ['./my-page.scss']
})
export class MyPageComponent {

    option: number = 2;
    constructor( ) {}

}
