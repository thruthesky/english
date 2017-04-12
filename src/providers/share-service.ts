import { Injectable } from '@angular/core';

import {
    PostData,
    _LIST, _POST_LIST_RESPONSE,
    _POSTS
} from '../angular-backend/angular-backend';

@Injectable()
export class ShareService {

    post_config_id: string = '';
    posts: _POSTS = [];

    constructor() {

    }
}