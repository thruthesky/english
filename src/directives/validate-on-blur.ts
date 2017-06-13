import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[validate-onblur]',
  host: {
      '(ngModelChange)': 'onFirstChangeCheck($event)',
      '(focus)': 'onFocus($event)',
      '(blur)' : 'onBlur($event)'
  }
})
export class ValidateOnBlurDirective {
  private hasFocus = false;
  private onFirstChange = true;
    constructor( public formControl: NgControl ) {
    }
    onFirstChangeCheck( $event ) {
        if( !this.onFirstChange ) return;
        this.onFocus( $event );
    }
    onFocus($event) {
        this.hasFocus = true;
        this.formControl.control.markAsPristine();
        this.formControl.control.valueChanges
            .filter(() => this.hasFocus)
            .subscribe(() => {
                this.formControl.control.markAsPristine();
            });
    }

    onBlur($event) {
        this.hasFocus = false;
        this.formControl.control.markAsDirty();
    }
}
