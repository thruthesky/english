import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from '../../../providers/app';

import { LMS } from '../../../providers/lms';

import { 
    RESPONSE,
    USER_REGISTER, USER_REGISTER_RESPONSE
    , USER_EDIT, USER_EDIT_RESPONSE, USER
} from './../../../angular-backend/interface';
import { User,
   } from './../../../angular-backend/user';

@Component({
    selector:'register-component',
    templateUrl: 'register.html'
})

export class RegisterComponent{
    loading     : boolean = false;
    form = <USER_REGISTER> {};

    login: boolean = false;
    result: RESPONSE = <RESPONSE> {};
    constructor (
        private app          : App,
        private activeModal  : NgbActiveModal,
        private lms          : LMS,
        private user         : User
    ) {
        ///////////////
        // this.form['gender'] = ""; //Default Select gender
        //////////////
        this.fakeData();
        // this.onClickRegister();
        // this.register();
    }

    // testforumpost(){
    //     this.forum
    //         .data('post', 'another post test')
    //         .data('comment', 'comment test')
    //         .create('QnA', res =>{
    //             console.log('res :: ' + res);
    //     }, err =>{
    //         this.app.alert('error :: ' + err );
    //     }, ()=> console.info( 'completed ') )
    // }


    onEnterRegister(event){
        if( event.keyCode == 13){
            if( this.user.logged ) this.updateProfile( callback => this.updateLMSprofile() );
            else this.register( callback => this.lmsRegister() );
        }
    }

    fakeData() {
        let id = 'user' + (new Date).getHours() + (new Date).getMinutes() + (new Date).getSeconds();  
        this.form.id = id;
        this.form.email = id + '@gmail.com';
        this.form.nickname = id;
        this.form.name = id;
        this.form.password = id;
        this.form.mobile = '09174678000';
        this.form.gender = 'M';
        this.form.birthday = '1990-12-30';
        
    }

    onClickDismiss() {
        this.activeModal.close();
    }

    ngOnInit(){
        if ( this.user.logged ) {
            this.getUserData();
        }
    }
    onClickRegister() {
        this.register( callback => this.lmsRegister() );


    }
    onClickUpdate() {
        this.updateProfile( callback => this.updateLMSprofile() );
    }

    getUserData() {
        this.loading = true;
        this.user.data().subscribe( (res: USER) => {
            this.getDataSuccess( res );
        }, error => {
            this.error( error );
        } );
    }
    register( callback? ) {
        // if ( this.validate() == false ) return;
        this.loading = true;

        this.splitBirthday(); 
        this.user.register( this.form ).subscribe( (res: USER_REGISTER_RESPONSE ) => {
            //this.successRegister( res );
            callback();
        }, error => {
            this.error( error );
        } );

    }
    splitBirthday() {
        if( this.form.birthday )
        {
            let date = this.form.birthday.split("-");
            this.form.birth_year  = date[0];
            this.form.birth_month = date[1];
            this.form.birth_day   = date[2];
            delete this.form.birthday;
        }
    }

    getDataSuccess( res:any ) {
        console.log(res);
        this.form = res['data'].user;
        this.form.birthday = this.concatBirthdate();
    }
    concatBirthdate() {
        let month = this.form.birth_month;
        let day =this.form.birth_day;
        if( this.form.birth_month.length < 2 ) month = "0"+ month;
        if( this.form.birth_day.length < 2 ) day = "0"+ day; 
        return this.form.birth_year + "-" + month + "-" +day;
    }
    successRegister( res: USER_REGISTER_RESPONSE) {

        console.log("user register success: ", res );
        this.loading = false;
        this.activeModal.close();
    }

    error( error ) {
        this.loading = false;
        this.result = error;
        console.log( this.result );
        return this.user.errorResponse( error );
    }

    lmsRegister(){
        this.lms.register( this.form, res =>{
            console.log(' registered on centerX ' + res );
            this.activeModal.close();
        }, error => console.error(' error on registration ' + error ) )
    }



    updateProfile( callback? ){
        // if ( this.validate() == false ) return;
        this.loading = true;
        this.splitBirthday();
        let data : USER_EDIT = {
            name: this.form.name,
            nickname: this.form.nickname,
            mobile: this.form.mobile,
            birth_year: this.form.birth_year,
            birth_month: this.form.birth_month,
            birth_day: this.form.birth_day,
            gender: this.form.gender
        }
        this.user.edit( data ).subscribe( (res: any) => {
            callback();
            this.successUpdate( res );

        }, error => {
            this.error( error );
        } );
        /*
        let data : USER_UPDATE_REQUEST_DATA ={
            name: this.form.name,
            nickname: this.form.nickname,
            mobile: this.form.mobile,
            landline: this.form.landline,
            gender: this.form.gender,
            birthday: this.form.birthday,
            country: this.form.country,
            province: this.form.province,
            city: this.form.city,
            address: this.form.address,
            zipcode: this.form.zipcode,
        }
        this.user.update( data, res =>{
            console.info( 'updated profile' + res );
        }, err =>console.error( 'error on update ' + err ), ()=>{});
        */
    }
    successUpdate( res: USER_EDIT_RESPONSE) {

        console.log("user update success: ", res );
        this.loading = false;
        this.activeModal.close();
    }
    updateLMSprofile(){
        this.lms.update( this.form , res =>{
            console.log(' lms user updated ' + res );
            this.activeModal.close();
        }, err =>{})
    }

//     validate() {
//         console.log('form: ', this.form);
// /*


//         if ( ! this.form.id ) return this.validateError('ID');
//         if( this.form.id.match(/[.#$\[\]]/g)) return this.validateError('valid id');
//         if ( ! this.form.email ) return this.validateError('Email');
//         if( ! this.form.password )return this.validateError('Password');

//         if ( ! this.form.name ) return this.validateError('Name');
//         if ( ! this.form.mobile ) return this.validateError('Mobile');
//         if ( ! this.form.gender ) return this.validateError('Gender');
//         if ( ! this.form.birthday ) return this.validateError('birthday');
// */
//         return true;
//     }

    validateError( name ) {
        this.app.alert( name + ' is required ...' );
        return false;
    }


}