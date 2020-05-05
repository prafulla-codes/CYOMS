// Add All Tests Here

const chai = require('chai');
var expect = chai.expect;
var request = require('request')

describe('API Test',function(){
    it('api call should return status 200',(done)=>{
        //expect(fetch("",{
     request('https://launchermeta.mojang.com/mc/game/version_manifest.json',(err,res,body)=>{
       expect(res.statusCode).to.equal(200);
       done();
     })

    })
})