/* FIREBASE */
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';

/* MODULES */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngb-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/* COMPONENTS */
import { AppComponent } from './app.component';
import { CardGroupComponent } from './card-group/card-group.component';
import { StepComponent } from './card-group/step/step.component';
import { CardBoardComponent } from './card-board/card-board.component';
import { CardComponent } from './card-group/step/card/card.component';

/* ROUTING */
import { AppRoutingModule } from './app-routing.module';

/* OTHERS */
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CardGroupComponent,
    StepComponent,
    CardBoardComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FontAwesomeModule,
    ModalModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    AngularFirestore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
