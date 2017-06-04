import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Team } from '../team-selector/teams';
import { MlbApi } from '../../services'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  team: Team;
  todaysGames: any[] = []

  constructor(
    public navCtrl: NavController, 
    private navParams: NavParams,
    private mlbApi : MlbApi) 
  {
    this.team = navParams.data;
  }

  ionViewDidLoad() {
    this.getTodaysGames();
  }

  getTodaysGames() {
    this.mlbApi.getTodaysGames().subscribe(data => {
      this.todaysGames = data;
    });
  }


}
