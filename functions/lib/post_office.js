"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailgun_js_1 = require("mailgun-js");
const config_1 = require("./config");
const client = mailgun_js_1.default(config_1.mailgun);
exports.sendEmail = (email) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        mailgun_js_1.default.messages().send(email, function (error, body) {
            if (error) {
                reject(error);
            }
            else {
                resolve(body);
            }
        });
    });
});
