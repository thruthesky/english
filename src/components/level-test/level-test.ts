import { Component, Input } from '@angular/core';
@Component({
    selector: 'level-test-component',
    templateUrl: 'level-test.html',
    styleUrls: ['./level-test.scss']
})
export class LevelTestComponent {
    @Input() numberDesign;
}