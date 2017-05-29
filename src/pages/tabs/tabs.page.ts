import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { AboutPage } from '..';
import { ContactPage } from '..';
import { HomePage } from '..';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  team: any;

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor(private navParams: NavParams) {
      this.team = navParams.data;
  }
}
