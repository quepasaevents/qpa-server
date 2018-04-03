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
const Datastore = require('@google-cloud/datastore');
const config_1 = require("./config");
const datastore = Datastore({
    projectId: config_1.projectId,
});
class Repository {
    static createUser(user) {
        const entity = {
            key: datastore.key('User'),
            data: user
        };
        return datastore.save(entity);
    }
    static saveSessionInvite(invite) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = {
                key: datastore.key('SessionInvite'),
                data: invite
            };
            return yield datastore.save(entity);
        });
    }
    static getUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Search for user', JSON.stringify(user));
            let query = datastore
                .createQuery('user');
            if (user.email) {
                query = query.filter('email', '=', user.email);
            }
            if (user.username) {
                query = query.filter('username', '=', user.username);
            }
            return yield datastore.runQuery(query)
                .then(results => {
                console.log('Got results', JSON.stringify(results));
                const resultSet = results[0];
                if (resultSet.length > 1) {
                    console.warn('Got more than one user, should have gotten at most one', JSON.stringify(resultSet));
                }
                return resultSet.length ? resultSet[0] : null;
            });
        });
    }
    ;
}
exports.default = Repository;
