import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'findID-component',
    templateUrl: 'find-id.html'
})

export class FindIdModal implements OnInit{
    loading:boolean = false;
    id:string = '';
    email:string;

    constructor(
        private activeModal : NgbActiveModal
    ){}
  ngOnInit(){
      
  }
  onClickDismiss(){
    this.activeModal.close();
  }


  onClickFindID(){
    //   this.loading = true;
    //   this.user.get( 'email/'+this.email.replace('@', '+').replace('.', '-'), res =>{
    //       console.log('res ' + JSON.stringify(res))  
    //       this.id = res['id'];      
    //   }, error => console.error(' error ' +error ) )
  }





}