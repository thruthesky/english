import { Component, OnInit } from '@angular/core';
import { App } from './../../providers/app';

@Component({
    moduleId: module.id,
    selector: 'level-test-button',
    templateUrl: 'level-test-button.html',
    styleUrls: ['level-test-button.scss']
})

export class LevelTestButtonComponent implements OnInit {
    constructor( public app: App ) { }

    ngOnInit() { }
}