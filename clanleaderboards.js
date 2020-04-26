var key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImU2YWUyMDMyLTcwNjEtNDQ1MS04NTgyLWRhYzlkNTQ2OWYyZCIsImlhdCI6MTU4NzcwODkwNiwic3ViIjoiZGV2ZWxvcGVyLzJmMmZhYTk2LTc2NTItNmZjYi0zMTJhLTk5MzM0OGY3ZGU0MCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjczLjE2NC40Mi42MCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.9zb2g8-7742PUy6EPjfn8TgteJuvjMfEIoKGvGQMtbRda6iasUelNKttR7NcdttzF-2txpvBskrUFtMW1KG4Dw'
var base = 'https://api.clashofclans.com/v1/'
var chroma = '%23PURPCR90'
var eg = '%23YVORUO2Y'
var eg2 = '%2399JRGQG8'



const request = require('request');
const request2 = require('request');

var achievementCategories = ["Friend in Need", "Gold Grab", "Elixir Escapade", "Conqueror", "Unbreakable", "Heroic Heist"];
var baseCategories = ["expLevel", "warStars", "bestTrophies", "bestVersusTrophies"];
var playersInClan = {};


  function requesting2(options) {
    request2(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const info = JSON.parse(body);
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
          console.log(playersInClan)
        }
        else {
            console.log(error);
        }
        console.log('abc')
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
      if (!error && response.statusCode == 200) {
        const info = JSON.parse(body);
        for (const clanPlayer in info.items) {
          playersInClan[info.items[clanPlayer]["tag"]] = {};
          playersInClan[info.items[clanPlayer]["tag"]]['Name'] = info.items[clanPlayer]["name"];
        }
        for (const tag in playersInClan) {
          const options2 = {
            url: base.concat('players/', tag.replace('#', '%23')),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '.concat(key)
            }
          };
          requesting2(options2);
        }
      }
      else {
          console.log(error);
      }
    });
};
/*
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      for (const clanPlayer in info.items) {
        playersInClan[info.items[clanPlayer]["tag"]] = {};
        playersInClan[info.items[clanPlayer]["tag"]]['Name'] = info.items[clanPlayer]["name"];
      }
      //console.log(playersInClan);
      for (const tag in playersInClan) {
        const options2 = {
          url: base.concat('players/', tag.replace('#', '%23')),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '.concat(key)
          }
        };
        request(options2, callback2);
      }
    }
    else {
        console.log(error);
    }
  }
*/
function main() {
  requesting();
  console.log(playersInClan);
};

main();