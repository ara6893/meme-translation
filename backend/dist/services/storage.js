"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
// Imports the Google Cloud client library
const storage_1 = require("@google-cloud/storage");
// Creates a client
const storage = new storage_1.Storage();
function getBucketName(gsUri) {
    const uri = gsUri.replace('gs://', '');
    return uri.slice(0, uri.indexOf('/'));
}
function getFileName(gsUri) {
    const uri = gsUri.replace('gs://', '');
    return uri.slice(uri.indexOf('/') + 1);
}
function downloadFile(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {};
        let [response] = yield storage
            .bucket(getBucketName(uri))
            .file(getFileName(uri))
            .download(options);
        // Downloads the file
        return response;
    });
}
exports.downloadFile = downloadFile;
