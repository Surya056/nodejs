var fs = require('fs');
var path = require('path');
var util = require('util');
const express = require('express')

var lineReader = require('line-reader');

var allStandards = ['Other Standard', 'Other Non-Standard', 'No Prior Insurance', '21st Century', 'A.Central', 'AAA', 'AARP', 'Acadia', 'Access General', 'Ace', 'Acuity', 'Adirondack Ins Exchange', 'Aegis', 'Affirmative', 'AIC', 'AIG', 'Alfa Alliance', 'Allied', 'Allstate', 'America First', 'American Commerce', 'American Family', 'American Freedom Insurance Company', 'American National', 'Amerisure', 'Amica', 'Anchor General', 'Arrowhead', 'ASI Lloyds', 'Atlantic Mutual', 'Austin Mutual', 'Autoone', 'Auto-Owners', 'AutoTex', 'Badger Mutual', 'Balboa', 'Bankers', 'Beacon National', 'Bear River Mutual', 'Brethern Mutual', 'Bristol West', 'Buckeye', 'California Casualty', 'Cameron Mutual', 'Capital Insurance Group', 'Celina', 'Centennial', 'Central Mutual of OH', 'Charter', 'Chubb', 'Cincinnati', 'Citizens', 'CNA', 'Colonial Penn', 'Colorado Casualty', 'Columbia', 'Commerce West', 'Constitutional Casualty', 'Consumers', 'Cornerstone', 'Countrywide', 'Country Insurance', 'CSE', 'Cumberland', 'Dairyland', 'Deerbrook', 'Delta Lloyds Insurance Company', 'Depositors', 'Direct', 'Direct General', 'Discovery', 'Donegal', 'Drive', 'Electric', 'EMC', 'Encompass', 'Erie', 'Esurance', 'Eveready', 'Explorer', 'Farm Bureau', 'Farmers', 'Federated', 'Fidelity', 'Financial Indemnity', 'Firemans Fund', 'First Acceptance', 'First American', 'First Auto', 'First Chicago', 'First Connect', 'Flagship Insurance', 'Foremost', 'Founders', 'Frankenmuth', 'Fred Loya', 'Gateway', 'Geico', 'General Casualty', 'Germantown Mutual', 'GMAC', 'Grange', 'Great American', 'GRE/Go America', 'Grinnell', 'Guide One', 'Hallmark Insurance Company', 'Hanover', 'Harbor', 'Harleysville', 'Hartford OMNI', 'Hartford', 'Hastings Mutual', 'Hawkeye Security', 'HDI', 'Horace Mann', 'Houston General', 'IFA', 'Imperial Casualty', 'IMT Ins', 'Indiana Farmers', 'Indiana', 'Infinity', 'Insuremax', 'Insurequest', 'Integon', 'Integrity', 'Kemper', 'Kingsway', 'Liberty Mutual', 'Liberty Northwest', 'MAIF', 'Main Street America', 'Mapfre', 'Markel', 'Maryland Auto Insurance', 'Mendakota', 'Mendota', 'Merchants Group', 'Mercury', 'MetLife', 'Metropolitan', 'Mid-Continent', 'Midwestern Indemnity', 'Montgomery', 'Motorists Mutual', 'MSA', 'Mt. Washington', 'Mutual Benefit', 'Mutual of Enumclaw', 'National Lloyds Insurance Company', 'Nationwide', 'National General', 'New York Central Mutual', 'NJ Manufacturers', 'NJ Skylands', 'Nodak Mutual', 'Northstar', 'NYAIP', 'Occidental', 'Ocean Harbor', 'Ohio Casualty', 'Omaha P/C', 'Omni Insurance Co', 'One Beacon', 'Oregon Mutual', 'Palisades', 'Patriot', 'Patrons Oxford', 'Peerless/Montgomery', 'Pekin', 'Pemco', 'Penn National', 'Phoenix Indemnity', 'Plymouth Rock', 'Preferred Mutual', 'Proformance', 'Progressive', 'Prudential', 'Republic', 'Response', 'Rockford Mutual', 'Royal and Sun Alliance', 'Safeco', 'Safe Auto', 'Safeway', 'Sagamore', 'SECURA', 'Selective', 'Sentry Ins', 'Shelter Insurance', 'Southern County', 'Southern Mutual', 'Southern Trust', 'St. Paul/Travelers', 'Standard Mutual', 'Star Casualty', 'State Auto', 'State Farm', 'StillWater', 'Stonegate', 'Titan', 'Topa', 'Tower', 'Travelers', 'TWFG', 'Unigard', 'United Automobile', 'United Fire and Casualty', 'Unitrin', 'Universal', 'USAA', 'Utica National', 'Victoria', 'West Bend', 'Western National', 'Western Reserve Group', 'Westfield', 'White Mountains', 'Wilshire', 'Wilson Mutual', 'Wisconsin Mutual', 'Windsor', 'Wind Haven', 'Zurich', 'Allied Trust Insurance Company', 'AmShield', 'AmWINS Star', 'Arrowhead Everest', 'ASI Select Auto Insurance Corp', 'Aspen', 'Aspire', 'Capitol Insurance Company', 'Century National', 'Cincinnati Casualty', 'Cincinnati Insurance', 'Commonwealth', 'Concord Group Insurance', 'Countryway Insurance', 'Empower', 'Enumclaw Insurance', 'Fitchburg Mutual', 'GAINSCO Auto Insurance', 'Goodville Mutual', 'Grange Insurance Association', 'Haulers Insurance Company', 'Iowa Mutual Insurance Company', 'Kemper Specialty', 'Legacy - Arizona Auto Ins. Co', 'LeMars Insurance', 'Madison Mutual Insurance Company', 'Maidstone Insurance', 'Michigan Insurance Company', 'Michigan Millers Mutual Insurance Company', 'MMG Insurance Company', 'Motor Club Insurance Company', 'NLC Insurance Companies', 'Northern Neck Insurance Company', 'NYCM Standard', 'Ohio Mutual', 'Partners Mutual Insurance', 'Peninsula Insurance Companies', 'Personal Service Insurance', 'Pioneer State Mutual', 'Providence Mutual Fire Insurance Company', 'QBE', 'Quincy Mutual', 'RAM Mutual Insurance Company', 'Rockingham Casualty Company', 'Sheboygan Falls Insurance', 'Sublimity Insurance Company', 'Sun Coast Platinum', 'The General', 'United Heritage Property and Casualty Company', 'United Home', 'Wadena Insurance Company', 'Workmens Auto Insurance Company', 'Worth Casualty Insurance Company'];

var readEachLineSync = require('read-each-line-sync')

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 * 
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir 
 * @param {Function} done 
 */
function filewalker(dir, dest, done) {

  !fs.existsSync(dest) && fs.mkdirSync(dest);
  let results = [];

  fs.readdir(dir, function (err, list) {
    if (err) return done(err);

    var pending = list.length;

    if (!pending) return done(null, results);//if it is a blank directory,it will return the message.

    list.forEach(function (file) {
      file = path.resolve(dir, file);
      var fromPath = file;//path.join(dir, file);
      var toPath = fromPath.substring(dir.toString().length);
      toPath = dest.replace("/", "\\") + toPath;

      fs.stat(file, function (err, stat) {

        // If directory, execute a recursive call

        if (stat && stat.isDirectory()) {

          //check direc exist and create
          !fs.existsSync(toPath) && fs.mkdirSync(toPath);

          // Add directory to array [comment if you need to remove the directories from the array]

          filewalker(file, toPath, function (err, res) {
          });
        } else {
          if (path.extname(fromPath) == ".scx") {
            var content;


            let convertdescriptions = [];
            //Loop by line and get the convertable strings in array
            readEachLineSync(fromPath, 'utf-8', '\n', function (line) {
              if (line.includes("this.convertvalue(<=this.getvariable(coverage_priorcarrier)>")) {
                console.log('***********' + fromPath + '**********************');
                // console.log(line);
                var index = line.lastIndexOf("<=this.getvariable(");
                // console.log(index);
                var convertvariable = line.substring(index + 19).split(")")[0];
                //console.log(convertvariable);
                if (!convertdescriptions.includes(convertvariable)) {
                  convertdescriptions.push(convertvariable);
                }
              }
              else {
                if (line.includes("this.convertvalue(&lt;=this.getvariable(coverage_priorcarrier)&gt;")) {
                  console.log('***********' + fromPath + '**********************');
                  // console.log(line);
                  var index = line.lastIndexOf("&lt;=this.getvariable(");
                  // console.log(index);
                  var convertvariable = line.substring(index + 22).split(")")[0];
                  //console.log(convertvariable);
                  if (!convertdescriptions.includes(convertvariable)) {
                    convertdescriptions.push(convertvariable);
                  }
                }

              }

            });

            if (fs.existsSync(toPath)) {
              fs.unlink(toPath, (err) => {
                if (err) throw err;
                console.log('file was deleted');
              });
            }

            //Loop by line and check with the array element and modify the line and write into the file//Pending
            readEachLineSync(fromPath, 'utf-8', '\n', function (line) {
              var converteddata = line;
              convertdescriptions.forEach(element => {
                if (line.includes("this.setvariable(" + element + ",")) {
                  //converteddata = CheckandReplace(line, element);
                  converteddata = CheckandReplaceArray(line);
                  //console.log(converteddata);
                }

              });

              fs.appendFileSync(toPath, converteddata + "\n");

            });

          }
        }
      });
    });
  });
};

function CheckandReplaceArray(input) {
  var finaldata;
  var actualArray = [];
  var otherStandardData;
  var pipedata = input.split(",")[1];
  var fmiddledata = '';
  if (pipedata.includes("Other Standard")) {
    var remainingData = pipedata.split("|");
    remainingData.forEach(element => {
      var standardsData = element.split("=");
      if (standardsData.includes("Other Standard")) {
        otherStandardData = standardsData[1];
      }
      if (standardsData.length == 2) {
        actualArray.push(standardsData[0]);
      }
    })
    var diffArray = difference(allStandards, actualArray);
    diffArray.forEach(e => {
      fmiddledata += e + '=' + otherStandardData + '|';
    })
    finaldata = fmiddledata + pipedata.trim();
  }
  else
    pipedata = finaldata;
  return input.replace(pipedata, finaldata);
}

function difference(a1, a2) {
  return a1.filter(x => !a2.includes(x));
}

var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
// Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;
function CheckandReplace(input, variable) {
  var finaldata;
  var pipedata = input.split(",")[1];
  //console.log(pipedata);
  var data25 = pipedata.split("|")[0];
  //console.log(data25);
  if (data25.includes("Other Standard")) {
    var datatoreplace = data25.split("=")[1];

    finaldata = " Windsor=" + datatoreplace + "|" + pipedata.trim();
    console.log(finaldata);
  }
  else
    pipedata = finaldata;

  return input.replace(pipedata, finaldata);

}


module.exports = {
  filewalker

}
