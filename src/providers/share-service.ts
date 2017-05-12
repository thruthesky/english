import { Injectable } from '@angular/core';
import { ClassInformation } from '../components/reservation/reservation-interface'
import {
    PostData,
    _LIST,
    _POSTS,
    _POST_LIST_RESPONSE,
} from 'angular-backend';
@Injectable()
export class ShareService {

    post_config_id: string = '';
    posts: _POSTS = [];
    class_info: ClassInformation = null;
    constructor() {

    }
}