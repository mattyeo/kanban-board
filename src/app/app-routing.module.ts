import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardBoardComponent } from './card-board/card-board.component';

const routes: Routes = [
  {path: '', component: CardBoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
