export interface NewDate {
    m:string;
    Y:string;
}
export interface ListOfYears extends NewDate {
}
export interface PrevMonths extends NewDate {
}
export interface NextMonths extends NewDate {
}


export interface ClassInformation {
    first_class: string;
    next_class: string;
    no_of_past: string;
    no_of_reservation: string;
}
export interface BOOK {
    "idx": string,
    "regstamp":string,
    "idx_schedule_table": string,
    "idx_teacher":string,
    "idx_student":string,
    "book":string,
    "point":string,
    "date":string,
    "class_begin":string,
    "class_end":string,
    "absent_student":string,
    "absent_teacher":string,
    "rate_level":string,
    "rate_grammar":string,
    "rate_vocabulary":string,
    "rate_expression":string,
    "rate_pronounciation":string,
    "rate_speed":string,
    "rate_attitue":string,
    "rate_comment":string,
    "rate_stamp":string,
    "refund_request_stamp":string,
    "refund_request_reason":string,
    "refund_request_done_stamp":string,
    "classid":string,
    "domain":string,
    "ready":string,
    "check":string,
    "status_payment":string,
    "teacher":{
        "idx":string,
        "mb_name":string,
        "mb_nick":string
    },
    "ap":string,
    "mins":string,
    "icon":string,
    "kdate":string,
    "kday":string,
    "ktime":string
}

export type BOOKS = Array<BOOK>;
export type WEEKS = Array<BOOKS>;