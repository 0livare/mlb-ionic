import { Team } from '../../interfaces'

var mlb = {
  al: {
    east: [
      {
        name: 'Yankees',
        city: 'New York',
        iconUrl: 'http://www.jeffs-icons.com/71354/LK-New_York_Yankees.gif',
      },
    ],
    central: [],
    west: []
  },

  nl: {
    east: [],
    central: [
      {
        name: 'Brewers',
        city: 'Milwaukee',
        iconUrl: 'http://www.jeffs-icons.com/71354/LK-Milwaukee_Brewers.gif',
      },
      {
        name: 'Cubs',
        city: 'Chicago',
        iconUrl: 'http://www.jeffs-icons.com/71354/LK-Chicago_Cubs.gif',
      },
    ],
    west: []
  }
};




// Parse the mlb league structure into a flat list of teams
var teams : Team[] = [];
var leagueOptions = ['al', 'nl'];
var divisionOptions = ['east', 'central', 'west'];

for (var league of leagueOptions) {
  for (var division of divisionOptions) {
    for (var team of mlb[league][division]) {
      teams.push(team);
    }
  }
}


export { mlb };
export default teams;