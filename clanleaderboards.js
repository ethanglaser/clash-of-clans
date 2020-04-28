var key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImU2YWUyMDMyLTcwNjEtNDQ1MS04NTgyLWRhYzlkNTQ2OWYyZCIsImlhdCI6MTU4NzcwODkwNiwic3ViIjoiZGV2ZWxvcGVyLzJmMmZhYTk2LTc2NTItNmZjYi0zMTJhLTk5MzM0OGY3ZGU0MCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjczLjE2NC40Mi42MCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.9zb2g8-7742PUy6EPjfn8TgteJuvjMfEIoKGvGQMtbRda6iasUelNKttR7NcdttzF-2txpvBskrUFtMW1KG4Dw'
var base = 'https://api.clashofclans.com/v1/'
var chroma = '%23PURPCR90'

const request = require('request');
const request2 = require('request');
const fs = require('fs');

var achievementCategories = ["Friend in Need", "Gold Grab", "Elixir Escapade", "Conqueror", "Unbreakable", "Heroic Heist"];
var baseCategories = ["expLevel", "warStars", "bestTrophies", "bestVersusTrophies"];
var categoryKey = {"expLevel": "Experience Level", "warStars": "War Stars", "bestTrophies": "Highest Trophy Count", "bestVersusTrophies": "Highest Versus Trophy Count", "Friend in Need": "Total Donations", "Gold Grab": "Gold Stolen (Capped at 2 billion)", "Elixir Escapade": "Elixir Stolen (Capped at 2 billion)", "Conqueror": "Multiplayer Attacks Won", "Unbreakable": "Multiplayer Defenses Won", "Heroic Heist": "Dark Elixir Stolen"};
var playersInClan = {};
var clanName = '';


  function formatter(rank, name, value) {
    line = '';
    line =+ String(rank) + '.  '
    if (rank < 10) {
      line += ' ';
    }
    line += name;
    if (name == 'bball ( ͡° ͜ʖ ͡') {
      line += String(value).padStart(38 - line.length, ' ');
    }
    else {
      line += String(value).padStart(35 - line.length, ' ');
    }
    fs.appendFileSync('leaderboards.txt', line + '\n', function (err) {
      if (err) throw err;
    });
  }

  function analysis() {
    categories = baseCategories.concat(achievementCategories);
    fs.appendFileSync('leaderboards.txt', 'Leaderboards for ' + clanName + '\n', function (err) {
      if (err) throw err;
    });
    for (index in categories) {
      categoryDict = {};
      category = categories[index];
      for (player in playersInClan){
        categoryDict[playersInClan[player].Name] = Number(playersInClan[player][category]);
      }
      rankedValues = new Set(Object.values(categoryDict).sort((a, b) => b - a));
      clanRank = 1;
      if (categories[index] in categoryKey) {
        fs.appendFileSync('leaderboards.txt', '\n' + categoryKey[categories[index]] + ':\n', function (err) {
          if (err) throw err;
        });   
      }
      else {
        fs.appendFileSync('leaderboards.txt', '\n' + categories[index] + ':\n', function (err) {
          if (err) throw err;
        });        
      }

      rankedValues.forEach(val => {
        numberAtValue = 0;
        for (player in categoryDict) {
          if (categoryDict[player] == val) {
            formatter(clanRank, player, val)
            numberAtValue += 1;
          }
        }
        clanRank += numberAtValue;
      });
  }
}

  function requesting2(options, status) {
    request2(options, (error, response, body) => {
          const info = JSON.parse(body);
          clanName = info["clan"]["name"];
          for (const base in info) {
            if (baseCategories.includes(base)) {
              playersInClan[info.tag][base] = info[base]
            }
          }
          for (const achievement in info.achievements) {
            if (achievementCategories.includes(info.achievements[achievement].name)) {
              playersInClan[info.tag][info.achievements[achievement].name] = info.achievements[achievement].value;
            }
          }
          if (status) {
            setTimeout(analysis, 2000);
          }
      });
  };
  function requesting() {
      const options = {
          url: base.concat('clans/', chroma, '/members'),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '.concat(key)
          }
        };
    request(options, (error, response, body) => {
        const info = JSON.parse(body);
        counter1 = 0;
        for (const clanPlayer in info.items) {
          counter1 += 1;
          playersInClan[info.items[clanPlayer]["tag"]] = {};
          playersInClan[info.items[clanPlayer]["tag"]]['Name'] = info.items[clanPlayer]["name"];
        }
        counter = 0;
        for (const tag in playersInClan) {
          counter += 1;
          status = (counter == counter1);
          const options2 = {
            url: base.concat('players/', tag.replace('#', '%23')),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '.concat(key)
            }
          };
          requesting2(options2, status);
        }
    });
};

requesting();