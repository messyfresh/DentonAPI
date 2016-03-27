var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:5000/api');

describe("/getdataused", function(){
    it('Should return info about current API data usage', function(done){
        api.get('/getdataused')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('Active_Sessions');
                done();
            });
    });
});
describe("/getgods", function(){
    it('Should return all god info', function(done){
        api.get('/getgods')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('Ability1');
                done();
            });
    });
});
describe("/getgodrecommendeditems/1737", function(){
    it('Should return recommended items for Agni', function(done){
        api.get('/getgodrecommendeditems/1737')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('god_name');
                expect(res.body[0].god_name).to.equal('Agni');
                done();
            });
    });
});
describe("/getitems", function(){
    it('Should return all items', function(done){
        api.get('/getitems')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('Type');
                expect(res.body[0].Type).to.equal('Item');
                done();
            });
    });
});
describe("/getfriends/messyfresh", function(){
    it('Should return all friends of messyfresh', function(done){
        api.get('/getfriends/messyfresh')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('name');
                done();
            });
    });
});
describe("/getplayer/lassiz", function(){
    it('Should return all info on lassiz', function(done){
        api.get('/getplayer/lassiz')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('LeagueConquest');
                done();
            });
    });
});
describe("/getgodranks/lassiz", function(){
    it('Should return all god ranks of lassiz', function(done){
        api.get('/getgodranks/lassiz')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('Rank');
                done();
            });
    });
});
describe("/getmatchhistory/lassiz", function(){
    it('Should return match history of lassiz', function(done){
        api.get('/getmatchhistory/lassiz')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('Match');
                done();
            });
    });
});
describe("/getplayerstatus/lassiz", function(){
    it('Should return current player status of lassiz', function(done){
        api.get('/getplayerstatus/lassiz')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('status');
                done();
            });
    });
});
describe("/getteam/Eager", function(){
    it('Should return a search for Team Eager', function(done){
        api.get('/getteam/Eager')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('Founder');
                done();
            });
    });
});
describe("/getteamdetails/521915", function(){
    it('Should return details for Team Eager', function(done){
        api.get('/getteamdetails/521915')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('Tag');
                done();
            });
    });
});
describe("/getteamplayers/521915", function(){
    it('Should return players for Team Eager', function(done){
        api.get('/getteamplayers/521915')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                expect(res.body[0]).to.have.property('Name');
                done();
            });
    });
});