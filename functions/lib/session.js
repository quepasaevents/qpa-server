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
// Free API to get location from IP: http://freegeoip.net/json/149.11.144.50
const randomstring_1 = require("randomstring");
const post_office_1 = require("./post_office");
const config_1 = require("./config");
const repository_1 = require("./repository");
const newInvite = (user) => {
    return {
        oneTimeKey: randomstring_1.default.generate({
            length: 24,
            charset: 'alphabetic'
        }),
        userId: user.id
    };
};
exports.inviteUser = (user) => __awaiter(this, void 0, void 0, function* () {
    const invite = newInvite(user);
    try {
        yield repository_1.default.saveSessionInvite(invite);
    }
    catch (e) {
        console.error('Failed to save invite', invite);
        throw e;
    }
    try {
        yield post_office_1.sendEmail({
            to: user.email,
            from: `signin@${config_1.domain}`,
            text: `invitation for session key: ${invite.oneTimeKey}`,
            subject: 'Invitation for session'
        });
    }
    catch (e) {
        console.error('Failed to send invitation email', invite);
        throw e;
    }
});
