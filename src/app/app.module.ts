import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule, Routes } from '@angular/router';


// Angular & angularfire
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';



//
import { App } from '../providers/app';
import { ShareService } from '../providers/share-service';


import { AppComponent } from './app.component';

import { HomePage } from '../pages/home/home';
// import { SecondDesignPage } from '../pages/second-design/second-design';
// import { ThirdDesignPage } from '../pages/third-design/third-design';

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

import { ClassInfoModal } from '../components/modals/class-info/class-info';
import { LoginModal } from '../components/modals/login/login';
import { RegisterComponent } from '../components/modals/register/register';
import { ForgotPasswordComponent } from '../components/modals/forgot-password/forgot-password';
import { FindIdModal } from '../components/modals/find-id/find-id';
import { AsideComponent } from '../components/aside/aside';
import { IntroComponent } from '../components/intro/intro';
import { PostViewModal } from '../components/modals/post-view/post-view';

//import { ContactComponent } from '../components/contact/contact';
//import { ContactFormComponent} from '../components/contact/components/contact-form/contact-form';
//import { ContactInformationComponent} from '../components/contact/components/contact-information/contact-information';
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

import { ChatComponent } from '../components/chat/chat';
import { AdminPanelComponent } from './../components/admin-panel/admin-panel'

import { FirebaseChat } from '../providers/firebase';
import { LMS } from '../providers/lms';
import { AngularBackendModule } from 'angular-backend';
import { AngularBackendComponents } from '../angular-backend-components/angular-backend-components.module';

const appRoutes:Routes = [
  { path: '', component: HomePage },
  { path: '**', component: HomePage }
];

@NgModule({
  declarations: [
    AppComponent,
    // EnhanceSample,
    HomePage,
    // SecondDesignPage,
    // ThirdDesignPage,
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
    ForgotPasswordComponent,
    ChangePasswordComponent,
    FindIdModal,
    ClassInfoModal,
    LoginModal,
    PostViewModal,
    AsideComponent,
    RegisterComponent,
    IntroComponent,
//    ContactInformationComponent,
    IntroComponent,
//    ContactComponent,
    CurriculumComponent,
    PaymentComponent,
    TeacherComponent,
    LevelTestComponent,
    CommentComponent,
    ReservationComponent,
    FooterComponent,
//    ContactFormComponent,
    ForumComponent,
    PostListComponent,
    PostViewComponent,
    FileFormComponent,
    ForumPostComponent,
    ChatComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot( appRoutes ),
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularBackendModule.forRoot(),
    AngularBackendComponents
  ],
  providers: [ App, FirebaseChat, LMS, NgbActiveModal, ShareService ],
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
