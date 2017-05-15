import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule, Routes } from '@angular/router';

import { App } from '../providers/app';
import { ShareService } from '../providers/share-service';


import { AppComponent } from './app.component';

import { HomePage } from '../pages/home/home';
import { SecondDesignPage } from '../pages/second-design/second-design';
import { ThirdDesignPage } from '../pages/third-design/third-design';

import { PaymentBannerComponent } from '../components/banners/payment/payment';
import { LevelTestBannerComponent } from '../components/banners/level-test/level-test';
import { InquiryBannerComponent } from '../components/banners/inquiry/inquiry';
import { ContactBannerComponent } from '../components/banners/contact/contact';
import { ReservationBannerComponent } from '../components/banners/reservation/reservation';


import { SecondPaymentBannerComponent } from '../components/banners/second-payment/second-payment';
import { SecondLevelTestBannerComponent } from '../components/banners/second-level-test/second-level-test';
import { SecondInquiryBannerComponent } from '../components/banners/second-inquiry/second-inquiry';
import { SecondContactBannerComponent } from '../components/banners/second-contact/second-contact';
import { SecondReservationBannerComponent } from '../components/banners/second-reservation/second-reservation';

import { HeaderComponent } from '../components/header/header';
import { BigHeaderComponent } from '../components/header/components/big-header/big-header';
import { SmallHeaderComponent } from '../components/header/components/small-header/small-header';

import { HeadersComponent } from '../components/headers/headers';
import { BigHeadersComponent } from '../components/headers/components/big-headers/big-headers';
import { SmallHeadersComponent } from '../components/headers/components/small-headers/small-headers';

import { KkangHeaderComponent } from '../theme/kkang/kkang-header/kkang-header';
import { KkangFooterComponent } from '../theme/kkang/kkang-footer/kkang-footer';
import { KkangSmallHeaderComponent } from '../theme/kkang/kkang-header/components/kkang-small-header/kkang-small-header';
import { KkangBigHeaderComponent } from '../theme/kkang/kkang-header/components/kkang-big-header/kkang-big-header';


import { ClassInfoModal } from '../components/modals/class-info/class-info';
import { LoginModal } from '../components/modals/login/login';
import { RegisterComponent } from '../components/modals/register/register';
import { ForgotPasswordComponent } from '../components/modals/forgot-password/forgot-password';
import { FindIdModal } from '../components/modals/find-id/find-id';
import { AsideComponent } from '../components/aside/aside';
import { IntroComponent } from '../components/intro/intro';
import { PostViewModal } from '../components/modals/post-view/post-view';

import { ContactComponent } from '../components/contact/contact';
import { ContactFormComponent} from '../components/contact/components/contact-form/contact-form';
import { ContactInformationComponent} from '../components/contact/components/contact-information/contact-information';
import { CurriculumComponent } from '../components/curriculum/curriculum';
import { PaymentComponent } from '../components/payment/payment';
import { TeacherComponent } from '../components/teacher/teacher';
import { LevelTestComponent } from '../components/level-test/level-test';
import { CommentComponent } from '../components/comment/comment';
import { ReservationComponent } from '../components/reservation/reservation';
import { FooterComponent } from '../components/footer/footer';
import { ChangePasswordComponent } from '../components/modals/change-password/change-password';

import { ForumComponent} from '../components/forum/forum';
import { PostListComponent } from '../components/forum/components/post-list-component/post-list-component';
import { PostViewComponent } from '../components/forum/components/post-view-component/post-view-component';
import { FileFormComponent } from '../components/forum/components/file-form-component/file-form-component';

import { ForumPostComponent } from '../components/modals/forum-post/forum-post';

import { LMS } from '../providers/lms';
import { AngularBackendModule } from 'angular-backend';

// import { PageNavigationComponent } from '../components/pagination/pagination.component';
import { AngularBackendComponents } from '../angular-backend-components/angular-backend-components.module';

const appRoutes:Routes = [
  { path: '', component: HomePage },
  { path: 'seconddesign', component:SecondDesignPage },
  { path: 'thirddesign', component:ThirdDesignPage }
];

@NgModule({
  declarations: [
    AppComponent,
    // EnhanceSample,
    HomePage,
    SecondDesignPage,
    ThirdDesignPage,
    HeadersComponent,
    HeaderComponent,
    PaymentBannerComponent,
    InquiryBannerComponent,
    ContactBannerComponent,
    ReservationBannerComponent,
    LevelTestBannerComponent,
    SecondLevelTestBannerComponent,
    SecondPaymentBannerComponent,
    SecondInquiryBannerComponent,
    SecondContactBannerComponent,
    SecondReservationBannerComponent,
    BigHeaderComponent,
    SmallHeaderComponent,
    BigHeadersComponent,
    SmallHeadersComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    KkangHeaderComponent,
    KkangFooterComponent,
    KkangSmallHeaderComponent,
    KkangBigHeaderComponent,
    FindIdModal,
    ClassInfoModal,
    LoginModal,
    PostViewModal,
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
    ReservationComponent,
    FooterComponent,
    ContactFormComponent,
    ForumComponent,
    PostListComponent,
    PostViewComponent,
    FileFormComponent,
    ForumPostComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot( appRoutes ),
    NgbModule.forRoot(),
    AngularBackendModule.forRoot(),
    AngularBackendComponents
  ],
  providers: [ App, LMS, NgbActiveModal, ShareService ],
  bootstrap: [AppComponent],
  entryComponents: [
    RegisterComponent,
    FindIdModal,
    LoginModal,
    ClassInfoModal,
    PostViewModal,
    ForgotPasswordComponent,
    ForumPostComponent,
    ChangePasswordComponent
  ]
})
export class AppModule { }
