import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[validate-onblur]',
  host: {
      '(ngModelChange)': 'onFocus($event)',
      '(focus)': 'onFocus($event)',
      '(blur)' : 'onBlur($event)'
  }
})
export class ValidateOnBlurDirective {
  private hasFocus = false;
    constructor( public formControl: NgControl ) {
    }

    // mark control pristine on focus or on first change
    onFocus($event) {
        this.hasFocus = true;
        this.formControl.control.markAsPristine();
        this.formControl.control.valueChanges
            .filter(() => this.hasFocus)
            .subscribe(() => {
                this.formControl.control.markAsPristine();
            });
    }

    // mark control  dirty on focus lost
    onBlur($event) {
        console.log("Blurry");
        this.hasFocus = false;
        this.formControl.control.markAsDirty();
    }
}
