var base = 'https://api.clashofclans.com/v1/'

const request = require('request');
const request2 = require('request');
const fs = require('fs');

//additional leaderboards can be added simply by adding the category to the appropriate list - anything from the base profile should be added to baseCategories, achievements added to achievementCategories, and optionally add a description that will be displayed in the text file, or modify the existing keys
var achievementCategories = ["Friend in Need", "Gold Grab", "Elixir Escapade", "Conqueror", "Unbreakable", "Heroic Heist"];
var baseCategories = ["expLevel", "warStars", "bestTrophies", "bestVersusTrophies"];
var categoryKey = {"expLevel": "Experience Level", "warStars": "War Stars", "bestTrophies": "Highest Trophy Count", "bestVersusTrophies": "Highest Versus Trophy Count", "Friend in Need": "Total Donations", "Gold Grab": "Gold Stolen (Capped at 2 billion)", "Elixir Escapade": "Elixir Stolen (Capped at 2 billion)", "Conqueror": "Multiplayer Attacks Won", "Unbreakable": "Multiplayer Defenses Won", "Heroic Heist": "Dark Elixir Stolen"};
var playersInClan = {};
var clanName = '';

//implement command line arguments
if (process.argv.length < 4) {
  throw new Error('Please include token and clan tag in command line arguments');
}
var key = process.argv[2];
var clanTag = process.argv[3].replace('#', '%23');
if (process.argv.length > 4) {
  fileName = process.argv[4] + '.txt';
}
else {
  fileName = 'leaderboards.txt';
}
fs.unlink(fileName, function(err){});  //Delete file if it already exists

requesting();

//format the lines of the text file to line up the rank, name and value properly
//Note that names with emojis or non-ASCII characters will likely disrupt the organization
function formatter(rank, name, value) {
  line = String(rank) + '.  '
  if (rank < 10) {
    line += ' ';
  }
  line += name;
  line += String(value).padStart(35 - line.length, ' ');

  fs.appendFileSync(fileName, line + '\n', function (err) {
    if (err) throw err;
  });
}

//takes the data for each achievement and sorts it in order
function analysis() {
  categories = baseCategories.concat(achievementCategories);

  //print text file header
  fs.appendFileSync(fileName, 'Leaderboards for ' + clanName + '\n', function (err) {
    if (err) throw err;
  });

  for (index in categories) {
    //create dictionary of name:value for each achievement (categoryDict) and sorted list of all values (rankedValues)
    categoryDict = {};
    category = categories[index];
    for (player in playersInClan){
      categoryDict[playersInClan[player].Name] = Number(playersInClan[player][category]);
    }
    rankedValues = new Set(Object.values(categoryDict).sort((a, b) => b - a));
    
    //print header for each achievement based on categoryKey
    if (categories[index] in categoryKey) {
      fs.appendFileSync(fileName, '\n' + categoryKey[categories[index]] + ':\n', function (err) {
        if (err) throw err;
      });   
    }
    else {
      fs.appendFileSync(fileName, '\n' + categories[index] + ':\n', function (err) {
        if (err) throw err;
      });        
    }

    //send the data to be formatted and printed to the text file
    clanRank = 1;
    rankedValues.forEach(val => {
      numberAtValue = 0;
      for (player in categoryDict) {
        if (categoryDict[player] == val) {
          formatter(clanRank, player, val)
          //Can make it more conducive to creating CSV files if desired - comment out the formatter call and uncomment these 3 lines
          /*fs.appendFileSync(fileName', clanRank + ',' + player + ',' + val + '\n', function (err) {
            if (err) throw err;
          });*/  
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

    //add data from main profile
    for (const base in info) {
      if (baseCategories.includes(base)) {
        playersInClan[info.tag][base] = info[base]
      }
    }

    //add data from achievements list
    for (const achievement in info.achievements) {
      if (achievementCategories.includes(info.achievements[achievement].name)) {
        playersInClan[info.tag][info.achievements[achievement].name] = info.achievements[achievement].value;
      }
    }

    //times out to account for API data delay - this is scrappy and can definitely be improved
    if (status) {
      setTimeout(analysis, 2000);
    }
  });
};

function requesting() {
  //initialize API call
  const options = {
    url: base.concat('clans/', clanTag, '/members'),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '.concat(key)
    }
  };

  request(options, (error, response, body) => {
    const info = JSON.parse(body);
    counter, counter1 = 0, 0;

    //initialize dict to tag:name
    for (const clanPlayer in info.items) {
      counter1 += 1;
      playersInClan[info.items[clanPlayer]["tag"]] = {};
      playersInClan[info.items[clanPlayer]["tag"]]['Name'] = info.items[clanPlayer]["name"];
    }

    //player API call to get more data on each player in the clan
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