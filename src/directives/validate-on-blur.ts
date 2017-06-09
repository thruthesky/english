import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[validate-onblur]',
  host: {
      '(focus)': 'onFocus($event)',
      '(blur)' : 'onBlur($event)'
  }
})
export class ValidateOnBlurDirective {
  private hasFocus = false;
    constructor( public formControl: NgControl ) {
    }

    // mark control pristine on focus
    onFocus($event) {
        this.hasFocus = true;
        this.formControl.control.valueChanges
            .filter(() => this.hasFocus)
            .subscribe(() => {
                this.formControl.control.markAsPristine();
            });
    }

    // mark control  dirty on focus lost
    onBlur($event) {
        this.hasFocus = false;
        this.formControl.control.markAsDirty();
    }
}
