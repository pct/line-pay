"use strict";

require("dotenv").config();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const debug = require("debug")("bot-express:test");
const request = require("request");
const uuid = require("uuid/v4");
const line_pay = require("../module/line-pay.js")
const TIMEOUT = 5000;
Promise = require("bluebird");
Promise.promisifyAll(request);

chai.use(chaiAsPromised);
let should = chai.should();

let pay = new line_pay({
    channelId: process.env.LINE_PAY_CHANNEL_ID,
    channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
    isSandbox: true
});

describe("Test method in beginning status", function(){
    describe("Reserve payment missing required parameter.", function(){
        it("should throw error.", function(){
            this.timeout(TIMEOUT);
            return Promise.resolve().then(function(){
                let options = {
                    //productName: "demo product",
                    amount: 1,
                    currency: "JPY",
                    confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
                    orderId: uuid()
                }
                return pay.reserve(options);
            }).catch(function(e){
                e.should.be.instanceOf(Error);
                e.should.have.property("message");
            });
        });
    });

    describe("Reserve payment with invalid parameter.", function(){
        it("should throw error.", function(){
            this.timeout(TIMEOUT);
            return Promise.resolve().then(function(){
                let options = {
                    productName: "demo product",
                    amount: 1,
                    currency: "JPY",
                    confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
                    orderId: uuid(),
                    invalidParam: true
                }
                return pay.reserve(options);
            }).catch(function(e){
                e.should.be.instanceOf(Error);
                e.should.have.property("message");
            });
        });
    });

    describe("Reserve payment with correct option.", function(){
        it("should return result.", function(){
            this.timeout(TIMEOUT);
            return Promise.resolve().then(function(){
                let options = {
                    productName: "demo product",
                    amount: 1,
                    currency: "JPY",
                    confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
                    orderId: uuid(),
                    payType: "PREAPPROVED"
                }
                return pay.reserve(options);
            }).then(function(response){
                response.returnCode.should.equal("0000");
                response.info.should.have.property("transactionId");
                response.info.paymentUrl.should.have.property("web");
                response.info.paymentUrl.should.have.property("app");
                response.info.should.have.property("paymentAccessToken");
            });
        });
    });
});
