import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeamSelectorPage } from './team-selector';

@NgModule({
  declarations: [
    TeamSelectorPage,
  ],
  imports: [
    IonicPageModule.forChild(TeamSelectorPage),
  ],
  exports: [
    TeamSelectorPage
  ]
})
export class TeamSelectorPageModule {}
