import { Component } from '@angular/core';
import { App } from './../../providers/app';
interface BOOK {
    img: string;
    title: string;
    desc: string;
}
type BOOKS = Array<BOOK>;
const BOOKS: BOOKS = [
        {
            img:"assets/img/book1.jpg",
            title:"잉글리시타임",
            desc:`읽기, 듣기, 쓰기, 말하기를 한번에 학습시켜주는 어린이 종합 영어 6권 시리즈.
                1~4 권은 기본 어휘 및 표현에 집중.
                5~6 권은 읽기와 쓰기를 중점적으로 학습.`
        },
        {
            img:"assets/img/book2.jpg",
            title:"Express Yourself",
            desc:`옥스포드에서 출판 한 중고등 및 성인용 교재.
                믿기 어려운 재미있는 스토리를 통해서 영어에 대한 흥미를 높이는 교재.
                숙어와 관용어를 배우는데 좋음.`
        },
        {
            img:"assets/img/book3.jpg",
            title:"Can you believe it?",
            desc:`즐겁고 흥겨운 내용의 기초영어
                5세~10세의 어린이가 사용하기 적당한 것으로 영어에 꼭 필요한 표현을 
                학습하여 어린이의 말하기 실력을 향상.`
        },
        {
            img:"assets/img/book4.jpg",
            title:"렛츠고",
            desc:`읽기, 듣기, 쓰기, 말하기를 한번에 학습시켜주는 어린이 종합 영어 6권 시리즈.
                1~4 권은 기본 어휘 및 표현에 집중.
                5~6 권은 읽기와 쓰기를 중점적으로 학습.`
        },
        {
            img:"assets/img/book5.jpg",
            title:"리딩 큐",
            desc:`균형 잡힌 리딩 스킬 학습을 위한 초등학생용 리딩 교재.
                아이들의 교양 및 관심 분야에 대한 정보를 재미있게 학습 할 수 있도록 편집.
                본격적인 읽기 학습을 위한 맞춤 교재.`
        },
        {
            img:"assets/img/book6.jpg",
            title:"Side by side",
            desc:`전 세계 교사와 학생들에게 30년 동안 끊임없이 사랑받아 온 최고의 교재로서 
                생동감있고 재미있는 회화와 독해, 작문 및 어휘력와 표현력을 높이는 짜임새 있는 영어 학습을 할 수 있습니다.`
        },
        {
            img:"assets/img/book7.jpg",
            title:"Smart Phonics",
            desc:`영어를 외국어로 공부하는(EFL) 유치원 아이들부터 초등학교 저학년생들이 배우기 쉽고, 부모나 교사들이 
                가르치기 쉽고 체계적으로 공부 할 수 있도록 구성된 파닉스 시리즈입니다.`
        },
        {
            img:"assets/img/book8.jpg",
            title:"Bricks Reading",
            desc:`총 3 레벨로 초급 단계로 리딩에 자신감을 부족한 아이한테 아이 스스로 학습해 나갈수 있도록 해준다.
                단어로만 대답하는 학생에게 짧은 문장을 통해 영어 표현의 관심도를 높임.`
        },

        {
            img:"assets/img/book24.jpg",
            title:"Debate Club",
            desc:`중급 이상의 영어 실력을 갖춘 학생들을 위한 토론 교재. 다양한 사황을 적합하게 도입한 학습교재로 실질직인 토론수업이 이뤄질 수 있도록 한 debate 연습 교재.`
        },

        {
            img:"assets/img/book15.jpg",
            title:"Express Ways",
            desc:`기능적, 상황적 대화와 문법을 함께 다루어 자연스러운 언어소개를 위해 실생활 상황을 사용 한 교재이다. 역할놀이, 비평적인 사고 및 문제해결등 상호작용의 학습에 중점을 둔 교재.`
        },
        {
            img:"assets/img/book16.jpg",
            title:"Exploring English",
            desc:`의사전달 (말하기,쓰기)을 중심으로 언어의 4가지 기능을 종합적으로 학습할 수 있도록 한 교재. 학습자의 수준과 목적에 학습할 수 있으며 롤 플레이를 통해 자연스럽게 수업을 진행.`
        },

        {
            img:"assets/img/book19.jpg",
            title:"Super Kids",
            desc:`New Superkids Super Kids New Edition은 입증된 교육 방식을 교재로 엮어 놓은 것으로 영어교재에서 가르쳐야 할 중요한 개념들을 한 눈에 쉽게 볼 수 있는 종합적인 교재입니다.`
        },
        {
            img:"assets/img/book9.jpg",
            title:"NEAT 교재",
            desc:`듣기 말하기 능력 향상 위주의 교재
                2009 년 시작된 국가 영어 능력 평가 시험으로 읽고, 쓰기에 듣고 말하기를 추가한 것으로 1급은 토익 시험에 상응한다.`
        },
        {
            img:"assets/img/book10.jpg",
            title:"베이스캠프",
            desc:`초/중학교 저학년 학생들을 대상으로 하는 기초 영어 교재. 초급 단계에서는 리스닝과 스피킹에 70% 정도의 비중, 
                중급 단계에서는 리스닝과 스피킹에 50%, 리딩과 라이팅에 `
        },
        {
            img:"assets/img/book11.jpg",
            title:"실전 어휘 학습교재",
            desc:`비지니스에 필요한 실전 어휘를 배울 수 있는 교재로 정확한 비지니스 용어와 표현법, 각 분야에 맞는 고급 
                영어를 구사하기 위한 고급 영어 실력 배양을 위한 교재.`
        },
        {
            img:"assets/img/book12.jpg",
            title:"Thoughts & Notions",
            desc:`독해와 어휘 실력을 동시에 향상 시키는 리딩 교재.
                영어 입문 단계 학생들을 위한 교재로 800 여개의 기본 어휘로 구성된 쉬운 교재로서 초등학교 4~6 학년에게 알맞음.`
        },
        {
            img:"assets/img/book13.jpg",
            title:"3개월 완성 300 패턴",
            desc:`영어 표현에서 반복적으로 쓰이는 문장을 간추려 석달 동안 공부하는 교재로 반복 연습을 통해 영어 표현을 몸에 
                베이게 하여 말하기 영어 실력 향상.`
        },
        {
            img:"assets/img/book14.jpg",
            title:"Cambridge IELTS",
            desc:`Cambridge IELTS는 아이엘츠교재(IELTS교재)의 BIBLE이라고 할 수 있을 정도로 가장 시험경향에 맞고 문제도 잘 만들었습니다. IELTS를 준비하는 많은 수험생들은 꼭 봐야 할 교재입니다.`
        },
        {
            img:"assets/img/book17.jpg",
            title:"It's Speaking",
            desc:`영어 말하기 / 쓰기에 익숙하지 않은 중급 레벨의 중학생과 고등학생들에게 적합한 교재로 Speaking 교재는 생각보다 어렵지 않으며 Writing 은 쉽게 영작을 할 수 있도록 해 준다.`
        },
        {
            img:"assets/img/book18.jpg",
            title:"Business One:One",
            desc:`1:1 비지니스 영어 강의를 위해 보다 상세하고 구체적으로 쓰여진 Business 전문 교재입니다. 학습자 중심의 교과 구성으로 비지니스 영어를 배우고자 하는 학생들에 좋은 교재입니다.`
        },
        {
            img:"assets/img/book20.jpg",
            title:"Cause & Effect",
            desc:`흥미롭고 다양한 내용으로 자연스럽게 학생의 독해력과 표현력을 향상시키는 교재. 그룹 스터디용으로 독해력을 집중 향상시키기 좋은 교재. 길지 않은 내용을 단락 별로 구성.`
        },
        {
            img:"assets/img/book21.jpg",
            title:"Chat Room",
            desc:`10대 청소년들의 세계와 그들의 생각, 상상력, 실제 관심사들을 빠짐없이 망라해 토론형식의 교재. 학습의 재미와 능률을 높이기 위해 다양한 그림들과 그것들을 바탕으로 진행.`
        },
        {
            img:"assets/img/book22.jpg",
            title:"Let's Talk",
            desc:`실생활과 아주 밀접하고 의견 대립이 나올 수 있는 주제를 선정 고급 토론 영어를 위한 기초를 다질 수 있도록 구성. 토론의 기초 단계인 쉬운 영어로 만들어 졌다.`
        },
        {
            img:"assets/img/book23.jpg",
            title:"Communicating in Business",
            desc:`비즈니스 상황에서 많이 사용되는 어휘, 회화 중심으로 구성된 교재. 비즈니스 관련 전화, 프리젠테이션, 회의, 협상 등에 필요한 어휘와 표현을 습득.`
        },
        {
            img:"assets/img/book25.jpg",
            title:"English Grammar",
            desc:`미국 초등학교 수준의 영어 문법 교재로서 우리나라 학원에서도 많이 활용되고 있는 교재. 문법 공부 뿐만아니라 영어 표현이나 회화를 익히기에도 적당한 교재.`
        },
        {
            img:"assets/img/book26.jpg",
            title:"Franny K. Stein",
            desc:`자연 과학에 관심이 많은 어린이들이 좋아하는 교재. 교재 레벨은 중급 정도. 간결한 문체와 과학적 사고, 실험을 꼬마 소녀를 통해 재미있게 그려 냄.`
        },
        {
            img:"assets/img/book27.jpg",
            title:"Grammar in Use",
            desc:`미국 영어를 배우기 원하는 중급 수준의 학습자를 대상으로 한 교재이며 이해하기 쉬운 문법 설명과 실제 상황에서 자주 쓰이는 예문을 바탕으로 문법적 접근을 한 교재.`
        },
        {
            img:"assets/img/book28.jpg",
            title:"Henry and Mudge",
            desc:`사랑스러운 꼬마 남자 아이 Henry와 그의 귀염둥이 강아지 Mudge의 우정을 그린 스토리 북으로 어린이의 교양을 북돋아 주는 교재. 초등학생 용 이야기 책.`
        },
        {
            img:"assets/img/book29.jpg",
            title:"Discover Debate",
            desc:`토론을 더욱 흥미있게 이끌어 주는 교재이다. 어렵게 생각하기 쉬운 토론의 전 과정을 초급자들이 쉽게 이해하여 접근할 수 있도록 구성하였다.`
        },
        {
            img:"assets/img/book30.jpg",
            title:"English Icebreak",
            desc:`말문이 터지는 잉글리시 아이스브레이크 시리즈 세트. 잉글리시 아이스브레이크(English Ice Break)는 비영어권 국가들의 영어학습자들을 위한 영어교재.`
        },
        {
            img:"assets/img/book31.jpg",
            title:"Impact Issue",
            desc:`토론에 알맞는 주제를 제공하는 흥미진진한 시리즈 교재. 영어로 자신의 의견을 자신감 있게 표현하는 실력을 키울 수 있도록 4단계 학습법으로 구성.`
        },
        {
            img:"assets/img/book32.jpg",
            title:"Judy Blume",
            desc:`중급 레벨의 스토리 교재. 어른스러운 형과 개구쟁이에다 갑자기 돈의 매력에 푹 빠져버린 여섯 살 동생이 서로를 이해해가는 과정을 그린 동화.`
        },
        {
            img:"assets/img/book33.jpg",
            title:"What A World",
            desc:`중급 영어 실력 이상을 갖춘 중학생 이상의 학습자용 독해 교재로서 영어 공부와 더불어 지구촌의 다양한 명소에 관한 양식을 흥미 진진하게 다루고 있다.`
        },
        {
            img:"assets/img/book34.jpg",
            title:"Let's Talk Business",
            desc:`20개의 현대 비지니스 주제가 78개의 Talkng Points를 제공. 수 백개의 다양한 어휘와 표현들이 예문과 함께 어우러져 Self-study 에 도움이 되는 교재.`
        },
        {
            img:"assets/img/book35.jpg",
            title:"Up And Away",
            desc:`전통적인 학습법과 문법에 기초를 둔 학습법이 조화를 이룬 교재. 단수, 복수 구분, 현재 진행형, 인칭 등 문법적 설명과 응용된 문장을 통해 문법 및 회화 실력을 다짐.`
        },
        {
            img:"assets/img/book36.jpg",
            title:"Nate The Grate",
            desc:`어린이를 위한 스토리북. 여러가지 사건을 해결하느라 정신 없이 뛰어다니는 Nate와 Sludge에 대한 이야기.`
        },
        {
            img:"assets/img/book37.jpg",
            title:"Reading Explorer",
            desc:`Reading Explorer는 4단계 시리즈로서 내셔널 지오그래픽의 텍스트와 이미지가 담겨 있습니다. 영어 학습자의 어휘 기술과 독해력을 신장시키는데 유용합니다.`
        },
        {
            img:"assets/img/book38.jpg",
            title:"Right On Track",
            desc:`주제별, 상황별 의사소통을 위한 Vocabulary, Speaking, Writing 등의 요소를 중심으로 엮은 교재. 단순한 언어 학습 뿐만 아니라 논리적 사고력 향상을 위한 교재.`
        },

        
        
    ];
    
@Component({
    selector: 'curriculum-component',
    templateUrl: 'curriculum.html',
    styleUrls: ['./curriculum.scss']
})
export class CurriculumComponent {
    showBook:boolean = false;
    books: BOOKS = null; // container of books to display on browser.
    first_8_books: BOOKS = null; // first_8
    constructor( public app: App ) {
        this.takeSomeTemporaryBooks();
    }
    takeSomeTemporaryBooks() {
        if ( this.app.widthSize == 'big' ) this.books = BOOKS.slice( 0, 12 );
        else this.books = BOOKS.slice( 0, 8 );
    }
    onClickShowMore() {
        this.showBook = !this.showBook;
        if(this.showBook) {
            this.books = BOOKS;
        }
        else {
            this.takeSomeTemporaryBooks();
            this.app.scrollTo('curriculum');
        }
    }
}