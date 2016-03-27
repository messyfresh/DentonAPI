var mongoose = require('mongoose'),
    md5 = require('md5'),
    request = require('request'),
    moment = require('moment'),
    express = require("express"),
    smiteSession = require('smite-session'),
    schedule = require('node-schedule'),
    app = express(),
    router = express.Router();

//Import config
var config = require('./config/config.json');

//Start Mongo connection
mongoose.connect(config.mongoUrl, function(err) {
    if (err) return console.log(err);
});

//Setup SessionID Schema
var sessionIdSchema = new mongoose.Schema({
    ret_msg: String,
    session_id: String,
    timestamp: {type: Date, default: Date.now}
}, {
    collection: 'sessionid'
});

var SessionId = mongoose.model('SessionId', sessionIdSchema);

smiteSession.set({
    devId: config.devId,
    authKey: config.authKey
});

//utcTime outside of scheduler to receive updated time when called

var rule = new schedule.RecurrenceRule();
rule.minute = [0,10,20,30,40,50];

//Automated session Generation every 10 min
var j = schedule.scheduleJob(rule, function(){
    console.log('Trying to get new Session ID');
    smiteSession.genSession()
      .then(function(data){

          var utcTime = new moment().utc().format("HHmmss");
          //Establish new Schema
          var sessionInfo = new SessionId({
              ret_msg: data.ret_msg,
              session_id: data.session_id
          });

          //Look for an existing Session ID
          SessionId.find({}, function(err, docs){
              if(err) return console.error(err);
              if(docs.length == 0){
                  sessionInfo.save(function(err, sessionId){
                      if (err) return console.error(err);
                  });
              } else if (docs.length >= 0){
                  SessionId.findOneAndUpdate({
                        _id:docs[0]._id},
                    {$set:{ret_msg:data.ret_msg, session_id: data.session_id, timestamp: Date.now()}},
                    function(err, sessionId){
                        console.log('Saved session id:', sessionId.session_id, 'to the DB');
                        if (err) return console.error(err);
                    });
              }
          });

      }).catch(function(error){
        console.log('Session ID error:',error);
    });
});






//GET for data usage
router.get('/getdataused', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var dataUsedHash = md5(config.devId + "getdataused" + config.authKey + utcTime);
    
    //Find Session ID
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //Build URL, Send get request to api, pipe response to output
        request(config.baseUrl + "getdatausedjson/" + config.devId + "/" + dataUsedHash + "/" + sessionId + "/" + utcTime).pipe(res);
    });
    
});
//GET for all gods
router.get('/getgods', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var godsHash = md5(config.devId + "getgods" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getgodsjson/" + config.devId + "/" + godsHash + "/" + sessionId + "/" + utcTime + "/" + "1").pipe(res);
    });
        
});
//GET for god recommendations
router.get('/getgodrecommendeditems/:godid', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var godItemsHash = md5(config.devId + "getgodrecommendeditems" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getgodrecommendeditemsjson/" + config.devId + "/" + godItemsHash + "/" + sessionId + "/" + utcTime + "/" + req.params.godid + "/" + "1").pipe(res);
    });
});
//GET for all items
router.get('/getitems', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var itemsHash = md5(config.devId + "getitems" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getitemsjson/" + config.devId + "/" + itemsHash + "/" + sessionId + "/" + utcTime + "/" + "1").pipe(res);
    });
});
//GET for player friends
router.get('/getfriends/:player', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var friendsHash = md5(config.devId + "getfriends" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getfriendsjson/" + config.devId + "/" + friendsHash + "/" + sessionId + "/" + utcTime + "/" + req.params.player).pipe(res);
    });
});
//GET for player information
router.get('/getplayer/:player', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var playerHash = md5(config.devId + "getplayer" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getplayerjson/" + config.devId + "/" + playerHash + "/" + sessionId + "/" + utcTime + "/" + req.params.player).pipe(res);
    });
});
//GET for player god ranks
router.get('/getgodranks/:player', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var godRanksHash = md5(config.devId + "getgodranks" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getgodranksjson/" + config.devId + "/" + godRanksHash + "/" + sessionId + "/" + utcTime + "/" + req.params.player).pipe(res);
    });
});
//GET for player match history
router.get('/getmatchhistory/:player', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var matchHistoryHash = md5(config.devId + "getmatchhistory" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getmatchhistoryjson/" + config.devId + "/" + matchHistoryHash + "/" + sessionId + "/" + utcTime + "/" + req.params.player).pipe(res);
    });
});
//GET for player status
router.get('/getplayerstatus/:player', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var playerStatusHash = md5(config.devId + "getplayerstatus" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getplayerstatusjson/" + config.devId + "/" + playerStatusHash + "/" + sessionId + "/" + utcTime + "/" + req.params.player).pipe(res);
    });
});
//GET to return a search for Teams
router.get('/getteam/:searchTeam', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var searchTeamHash = md5(config.devId + "searchteams" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "searchteamsjson/" + config.devId + "/" + searchTeamHash + "/" + sessionId + "/" + utcTime + "/" + req.params.searchTeam).pipe(res);
    });
});
//GET to return team info
router.get('/getteamdetails/:teamId', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var getTeamDeatilsHash = md5(config.devId + "getteamdetails" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getteamdetailsjson/" + config.devId + "/" + getTeamDeatilsHash + "/" + sessionId + "/" + utcTime + "/" + req.params.teamId).pipe(res);
    });
});
//GET to return team players
router.get('/getteamplayers/:teamId', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var getTeamPlayersHash = md5(config.devId + "getteamplayers" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getteamplayersjson/" + config.devId + "/" + getTeamPlayersHash + "/" + sessionId + "/" + utcTime + "/" + req.params.teamId).pipe(res);
    });
});
//Not tested due to requiring a live match id
router.get('/getmatchplayerdetails/:matchId', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var getMatchPlayerDetailsHash = md5(config.devId + "getmatchplayerdetails" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getmatchplayerdetailsjson/" + config.devId + "/" + getMatchPlayerDetailsHash + "/" + sessionId + "/" + utcTime + "/" + req.params.matchId).pipe(res);
    });
});
//GET for player queue stats
//Not tested at the moment
router.get('/getqueuestats/:player/:queue', function(req, res) {
    var utcTime = moment().utc().format("YYYYMMDDHHmmss");
    var queueStatsHash = md5(config.devId + "getqueuestats" + config.authKey + utcTime);
    SessionId.findOne({},'session_id', function(err, docs){
        if(err) return console.error(err);
        var sessionId = docs.session_id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(config.baseUrl + "getqueuestatsjson/" + config.devId + "/" + queueStatsHash + "/" + sessionId + "/" + utcTime + "/" + req.params.player + "/" + req.params.queue).pipe(res);
    });
});
app.use('/api', router);
app.use(pmx.expressErrorHandler());
app.listen(config.port, process.env.IP);