import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'

import 'rxjs'
import { Observable } from 'rxjs/Observable'


@Injectable()
export class MlbApi {

  constructor(private http: Http) {

  }


  /**
   * Input:
   * 
   * mlb_s_left3=^San Francisco 7   Milwaukee 2 (FINAL)
   * mlb_s_right3_1=W: Samardzija L: Scahill
   * mlb_s_right3_count=1
   * mlb_s_url3=http://sports.espn.go.com/mlb/boxscore?gameId=370605108
   * 
   * Output:
   * 
   * {
   *   "inning": "FINAL",
   *   "away": {
   *     "score": "7",
   *     "team": "San Francisco",
   *     "won": true
   *   },
   *   "home": {
   *     "score": "2",
   *     "team": "Milwaukee",
   *     "won": false
   *   },
   *   "pitching": {
   *     "winner": "Samardzija",
   *     "loser": "Scahill"
   *   },
   *   "url": "http://sports.espn.go.com/mlb/boxscore?gameId=370605108"
   * },
   */
  getTodaysGames() : Observable<any> {
    return this.http.get('http://www.espn.com/mlb/bottomline/scores')
      .map((res) => {
        let encoded = res.text();
        let entries = encoded.replace(/%20/g, ' ').split('&');
        let games = parseDataLabels(entries);
        return parseDataValues(games);
      });

      function parseDataLabels(entries) {
        let games = {};
        for (var entry of entries) {
          let matches = /mlb_s_([a-z]+)(\d{1,2})_?(.{1,4})?=(.*)/g.exec(entry);
          if (!matches) continue;

          let dataType = matches[1];
          let gameNumber = matches[2];
          let subDataType = matches[3];
          let entryData = matches[4];

          if (!games[gameNumber]) games[gameNumber] = {};

          if (subDataType) {
            if (!games[gameNumber][dataType]) games[gameNumber][dataType] = {};
            games[gameNumber][dataType][subDataType] = entryData;
          } else {
            games[gameNumber][dataType] = entryData;
          }
        }
        return games;
      }

      function parseDataValues(gamesObj) {
        let gamesArray = [];
        for (let gameNumber in gamesObj) {
          let gameData = gamesObj[gameNumber];

          let gameObj = parseGameState(gameData['left']);
          gameObj = Object.assign(gameObj, parseRight(gameData['right']))
          gameObj['url'] = gameData['url'];

          gamesArray.push(gameObj);
        }
        return gamesArray;
      }

      function parseGameState(stateText) {
        let game = {}

        let match = stateText.match(/.+\((.+)\)/);
        let gameState = match[1];
        game['inning'] = gameState;
        stateText = stateText.substring(0, stateText.length - gameState.length - 2).trim();

        var isFutureGame = stateText.includes('at');
        if (isFutureGame) parseFutureGameState(stateText, game);
        else parsePastGameState(stateText, game);

        return game;
      }

      function parseFutureGameState(stateText, game) {
        let awayVsHome = stateText.split('at');
        game.home = {
          team: awayVsHome[1],
          score: 0,
          won: false,
        };
        game.away = {
          team: awayVsHome[0],
          score: 0,
          won: false,
        }
      }

      function parsePastGameState(stateText, game) {
        let teams = stateText.split('   ');
        for (var i=0; i<2; ++i) {
          let teamAndScore = teams[i];
          let teamWon = teamAndScore.startsWith('^');
          if (teamWon) teamAndScore = teamAndScore.substring(1);
          
          let match = teamAndScore.match(/.+(?: .+)* (\d+)/);
          if (!match) return {};
          let score = match[1];
          let teamName = teamAndScore.substring(0, teamAndScore.length - score.length).trim();

          let isHomeTeam = (i == 1);
          let location = isHomeTeam ? 'home' : 'away';
          game[location] = {
            score: score,
            team: teamName,
            won: teamWon,
          }
        }
      }

      function parseRight(rightObj) {
        if (!rightObj) return {};
        let data = rightObj['1'];

        if (data.includes('out')) {
          return {outs: data.match(/(\d) outs?/)[1]};
        } else {
          let match = data.match(/W: ([a-z|A-Z]+) L: ([a-z|A-Z]+)(?: S: ([a-z|A-Z]+))?/);
          if (!match) return {};

          return {
            pitching: {
              winner: match[1], 
              loser: match[2], 
              saver: (match.length >= 4) ? match[3] : undefined,
            }
          };
        }
      }
  }
}


 // Can also manipulate this url to get a fuckton of data
 // http://gd2.mlb.com/components/game/mlb/year_2017/month_05/day_29/master_scoreboard.json