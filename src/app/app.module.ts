import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule, Routes } from '@angular/router';

import { App } from '../providers/app';

import { AppComponent } from './app.component';

import { HomePage } from '../pages/home/home';
import { SecondDesignPage } from '../pages/second-design/second-design';

import { PaymentBannerComponent } from '../components/banners/payment/payment';
import { LevelTestBannerComponent } from '../components/banners/level-test/level-test';


import { SecondPaymentBannerComponent } from '../components/banners/second-payment/second-payment';
import { SecondLevelTestBannerComponent } from '../components/banners/second-level-test/second-level-test';


import { HeaderComponent } from '../components/header/header';
import { BigHeaderComponent } from '../components/header/components/big-header/big-header';
import { SmallHeaderComponent } from '../components/header/components/small-header/small-header';

import { KkangHeaderComponent } from '../theme/kkang/kkang-header/kkang-header';
import { KkangFooterComponent } from '../theme/kkang/kkang-footer/kkang-footer';
import { KkangSmallHeaderComponent } from '../theme/kkang/kkang-header/components/kkang-small-header/kkang-small-header';
import { KkangBigHeaderComponent } from '../theme/kkang/kkang-header/components/kkang-big-header/kkang-big-header';


import { PlFooterComponent } from '../theme/plcenter/pl-footer/pl-footer';
import { PlHeaderComponent } from '../theme/plcenter/pl-header/pl-header';

import { PlSmallHeaderComponent } from '../theme/plcenter/pl-header/components/pl-small-header/pl-small-header';
import { PlBigHeaderComponent } from '../theme/plcenter/pl-header/components/pl-big-header/pl-big-header';

import { ClassInfoModal } from '../components/modals/class-info/class-info';
import { LoginModal } from '../components/modals/login/login';
import { RegisterComponent } from '../components/modals/register/register';
import { ForgotPasswordComponent } from '../components/modals/forgot-password/forgot-password';
import { FindIdModal } from '../components/modals/find-id/find-id';
import { AsideComponent } from '../components/aside/aside';
import { IntroComponent } from '../components/intro/intro';


import { ContactComponent } from '../components/contact/contact';
import { ContactFormComponent} from '../components/contact/components/contact-form/contact-form';
import { ContactInformationComponent} from '../components/contact/components/contact-information/contact-information';
import { CurriculumComponent } from '../components/curriculum/curriculum';
import { PaymentComponent } from '../components/payment/payment';
import { TeacherComponent } from '../components/teacher/teacher';
import { LevelTestComponent } from '../components/level-test/level-test';
import { CommentComponent } from '../components/comment/comment';
import { InquiryComponent } from '../components/inquiry/inquiry';
import { ReservationComponent } from '../components/reservation/reservation';
import { FooterComponent } from '../components/footer/footer';
import { QnaPostComponent } from '../components/modals/qna_post/post';


import { AngularBackend } from './../angular-backend/angular-backend';
import { BackendAdminPage } from './../angular-backend/pages/admin/index/index';


import { LMS } from '../providers/lms';


const appRoutes: Routes = [
  { path: 'admin', component: BackendAdminPage },
  { path: '', component: HomePage },
  { path: 'design2', component: SecondDesignPage }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    SecondDesignPage,
    HeaderComponent,
    PaymentBannerComponent,
    LevelTestBannerComponent,
    SecondLevelTestBannerComponent,
    SecondPaymentBannerComponent,
    BigHeaderComponent,
    SmallHeaderComponent,
    PlFooterComponent,
    PlHeaderComponent,
    PlSmallHeaderComponent,
    PlBigHeaderComponent,
    ForgotPasswordComponent,
    KkangHeaderComponent,
    KkangFooterComponent,
    KkangSmallHeaderComponent,
    KkangBigHeaderComponent,
    FindIdModal,
    ClassInfoModal,
    LoginModal,
    AsideComponent,
    RegisterComponent,
    IntroComponent,
    ContactInformationComponent,
    IntroComponent,
    ContactComponent,
    CurriculumComponent,
    PaymentComponent,
    TeacherComponent,
    LevelTestComponent,
    CommentComponent,
    InquiryComponent,
    ReservationComponent,
    FooterComponent,
    QnaPostComponent,
    ContactFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot( appRoutes, { useHash: !history.pushState }),
    NgbModule.forRoot(),
    AngularBackend
  ],
  providers: [ App, LMS, NgbActiveModal ],
  bootstrap: [AppComponent],
  entryComponents: [
    QnaPostComponent,
    RegisterComponent,
    FindIdModal,
    LoginModal,
    ClassInfoModal,
    ForgotPasswordComponent
  ]
})
export class AppModule { }
