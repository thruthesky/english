import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    User,
    File,
    _FILE,
    _UPLOAD_RESPONSE, 
    _DELETE_RESPONSE,
    ERROR_NO_FILE_SELECTED
} from 'angular-backend';
@Component({
    selector: 'file-form-component',
    templateUrl:'./file-form-component.html',
    styleUrls: [ './file-form-component.scss' ]
})
export class FileFormComponent {
    @Input() files: Array<_FILE> = [];
    @Input() form: FormGroup;
    @Input() text_upload_title = "Upload Photos";
    @Input() text_upload_description = "Please select a photo to upload";

    constructor( public user: User,
                 private file: File ) {}
    onChangeFile( _ ) {
        this.file.uploadPostFile( _.files[0] ).subscribe( (res:_UPLOAD_RESPONSE) => {
            this.files.push( res.data );
        }, err => {
            if ( this.file.isError(err) == ERROR_NO_FILE_SELECTED ) return;
            this.file.alert(err);
        });
    }
    onClickDeleteFile( file ) {
        let req;
        if( this.user.logged ) {
            req = file.idx;
        }else {
            req = {
            idx: file.idx,
            password: this.form.get('password').value
        };
        }
        this.file.delete( req ).subscribe( (res:_DELETE_RESPONSE) => {
            let i = this.files.findIndex( (f:_FILE) => f.idx == res.data.idx );
            this.files.splice( i, 1 );
        }, err => { 
            this.file.alert(err);
         } );
    }
}