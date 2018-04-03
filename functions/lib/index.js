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
const url_1 = require("url");
const user_1 = require("./user");
exports.isUserAvailable = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const params = url_1.parse(req.url, true).query;
    const user = yield user_1.getUser({
        email: params.email,
        username: params.username
    });
    console.log('got user from repository', JSON.stringify(user));
    res.send({
        exists: !!user
    });
    return true;
});
