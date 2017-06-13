import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'findID-component',
    templateUrl: 'find-id.html'
})

export class FindIdModal implements OnInit{
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

  }
}