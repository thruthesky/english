import { Injectable } from '@angular/core';
import { _ClassInformation } from '../components/reservation/reservation-interface'
import {
    PostData,
    _LIST,
    _POSTS,
    _POST_LIST_RESPONSE,
} from 'angular-backend';
@Injectable()
export class ShareService {

    clientChatId: string = null;
    ve_url: string = null;
    VE_ENDPOINT_URL = "http://onlineenglish.kr/~witheng/etc/ve_open.php";
    post_config_id: string = '';
    posts: _POSTS = [];
    class_info: _ClassInformation = null;
    idx_student: string = null;
    date:Date = new Date();
    year:number = this.date.getFullYear();
    month:number = parseInt(("0" + (this.date.getMonth() + 1)).slice(-2));

    defaultClassId = 'solution';
    user_profile = 'assets/images/user/user.jpg';

    constructor() {

    }



}
