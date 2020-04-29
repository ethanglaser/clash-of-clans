# Overview

These JavaScript files allow for organization of clan and account achievements, stats, etc. using the [Clash of Clans API](https://developer.clashofclans.com/#/).

# Getting Started

The first step is to create an account for the API. In order to use the API, authorization is needed using a JSON Web Token, which can be generated [here](https://developer.clashofclans.com/#/account). In order to generate the token, the user must be logged into their developer account and include the IP address of the device that will be used to access the API.

The node *requests* library is required for this repository. Running *npm install requests* in the terminal will install this.

# API features

The base API URL is *https://api.clashofclans.com/v1/*. All API calls will be based off of this base. Substitute '#' with '%23' when making an API call. Information on what sorts of data are accessible [here](https://developer.clashofclans.com/#/documentation). Essentially, anything visible within a player or clan's public profile are accessible by the API.

# Running the code

All of the code for this project is currently in *clanleaderboards.js*. This code takes a list of different achievements and profile features and creates leaderboards for each, accounting for each member of a specified clan. Command line arguments are needed for the API token and clan tag, as well as an optional file name.

The format looks like *node clanleaderboards.js* [TOKEN HERE] [CLAN TAG HERE] [FILE NAME HERE (optional)]

example: *node clanleaderboards.js abcdefghijklmnopqrstuvwxyz #ABCD1234 ClanEthan*

If no argument is provided for file name, it will default to *leaderboards*.

The code itself involves two levels of API calls, sorting/analysis of data, and the creation of the output file. The command line arguments are processed and then an API call is made to get the members of the specified clan. Then, additional API calls are made for each player to get their achievement data, current season data, etc. Once the data is compiled for each player, the information for each category is sorted, organized, and printed to the output file. Comments are provided throughout the file for further clarification.

Additional leaderboard categories can be added simply by appending the keys at the top of the file, depending on the type of category. Note that the value in either the achievementCategory or baseCategory must match exactly as it is in the API, but the text displayed for the category can be changed by adding a key-value pair to the categoryKey.

The current format of the output is suited best for text file generation, but can be modified for CSV/Excel use by implementing the comments towards the end of the *analysis* function.

Assuming all goes correctly, a text file will be created with leaderboards for every category specified, for the clan provided with the tag in the command line arguments.
