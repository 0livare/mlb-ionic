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
  todaysGames: any[] = [];
  nextTenGames: any[] = [];

  constructor(
    public navCtrl: NavController, 
    private navParams: NavParams,
    private mlbApi : MlbApi) 
  {
    this.team = navParams.data;
  }

  ionViewDidLoad() {
    this.getTodaysGames();
    this.getTenDaySchedule();
  }

  getTodaysGames() {
    this.mlbApi.getTodaysGames().subscribe(data => {
      this.todaysGames = data;
    });
  }

  getTenDaySchedule() {
    let tenGames = [];

    for (let i=0; i<10; ++i) {
      let date = new Date();
      date.setDate(new Date().getDate() + i);

      this.mlbApi.getGamesOnDate(date).subscribe(games => {

        for(let game of games) {
          if (game.home_team_name == this.team.name) {
            tenGames.push("vs " + game.away_team_name);
          } else if (game.away_team_name == this.team.name) {
            tenGames.push("vs " + game.home_team_name);
          }
        }


      })
    }

    this.nextTenGames = tenGames;
  }


}
