import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule, Routes } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { BootstrapModule } from '../providers/bootstrap/bootstrap';

import { App } from '../providers/app';
import { ShareService } from '../providers/share-service';

import { AppComponent } from './app.component';

import { HomePage } from '../pages/home/home';

import { HeaderComponent } from '../components/header/header';
import { BigHeaderComponent } from '../components/header/components/big-header/big-header';
import { SmallHeaderComponent } from '../components/header/components/small-header/small-header';

import { ClassInfoModal } from '../components/modals/class-info/class-info';
import { LoginModal } from '../components/modals/login/login';
import { RegisterComponent } from '../components/modals/register/register';
import { ForgotPasswordComponent } from '../components/modals/forgot-password/forgot-password';
import { IntroComponent } from '../components/intro/intro';
import { PostViewModal } from '../components/modals/post-view/post-view';

import { CurriculumComponent } from '../components/curriculum/curriculum';
import { PaymentComponent } from '../components/payment/payment';
import { TeacherComponent } from '../components/teacher/teacher';
import { LevelTestComponent } from '../components/level-test/level-test';
import { CommentComponent } from '../components/comment/comment';
import { ReservationComponent } from '../components/reservation/reservation';
import { FooterComponent } from '../components/footer/footer';
import { ChangePasswordComponent } from '../components/modals/change-password/change-password';

import { SaehaComponent } from '../components/saeha/saeha';
import { FAQComponent } from '../components/faq/faq';

import { ForumComponent} from '../components/forum/forum';
import { PostListComponent } from '../components/forum/components/post-list-component/post-list-component';
import { FileFormComponent } from '../components/forum/components/file-form-component/file-form-component';

import { ForumPostComponent } from '../components/modals/forum-post/forum-post';
import { CommentReviewComponent } from '../components/modals/comment-review/comment-review';

import { BooksComponent } from '../components/books/books';

import { LevelTestButtonComponent } from '../components/level-test-button/level-test-button';

import { AsideComponent } from '../components/aside/aside';
import { ChatComponent } from '../components/chat/chat';
import { AdminPanelComponent } from '../components/admin-panel/admin-panel';

import { FirebaseChat } from '../providers/firebase';
import { LMS } from '../providers/lms';
import { AngularBackendModule } from 'angular-backend';
import { AngularBackendComponents } from '../angular-backend-components/angular-backend-components.module';
import { ValidateOnBlurDirective } from '../directives/validate-on-blur';

import { Message } from '../providers/message';

import { MyPageComponent } from '../components/my-page/my-page';
import { MyPageLMSComponent } from '../components/my-page-lms/my-page-lms';
import { MyPageAchievementComponent } from '../components/my-paeg-achievement/my-page-achievement';
import { EnglishNewsComponent } from '../components/english-news/english-news';
import { MyPageLeveltestComponent } from '../components/my-page-leveltest/my-page-leveltest';


const appRoutes:Routes = [
  { path: '', component: HomePage },
  { path: '**', component: HomePage }
];
@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    HeaderComponent,
    BigHeaderComponent,
    SmallHeaderComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    ClassInfoModal,
    LoginModal,
    PostViewModal,
    RegisterComponent,
    IntroComponent,
    IntroComponent,
    CurriculumComponent,
    PaymentComponent,
    TeacherComponent,
    LevelTestComponent,
    CommentComponent,
    ReservationComponent,
    FooterComponent,
    ForumComponent,
    PostListComponent,
    FileFormComponent,
    ForumPostComponent,
    CommentReviewComponent,
    AsideComponent,
    ChatComponent,
    AdminPanelComponent,
    BooksComponent,
    LevelTestButtonComponent,
    ValidateOnBlurDirective,
    SaehaComponent,
    FAQComponent,
    MyPageComponent,
    MyPageLMSComponent,
    MyPageAchievementComponent,
    MyPageLeveltestComponent,
    EnglishNewsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot( appRoutes ),
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularBackendModule.forRoot(),
    AngularBackendComponents,
    BootstrapModule
  ],
  providers: [ App, FirebaseChat, LMS, NgbActiveModal, ShareService, Message ],
  bootstrap: [AppComponent],
  entryComponents: [
    RegisterComponent,
    LoginModal,
    ClassInfoModal,
    PostViewModal,
    ForgotPasswordComponent,
    ForumPostComponent,
    CommentReviewComponent,
    ChangePasswordComponent
  ]
})
export class AppModule { }
