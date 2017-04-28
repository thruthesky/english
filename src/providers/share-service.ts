import { Injectable } from '@angular/core';

import {
    PostData,
    _LIST,
    _POSTS,
    _POST_LIST_RESPONSE
} from 'angular-backend';

@Injectable()
export class ShareService {

    post_config_id: string = '';
    posts: _POSTS = [];

    constructor() {

    }
}