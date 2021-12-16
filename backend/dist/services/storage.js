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
exports.uploadFile = exports.downloadFile = void 0;
// Imports the Google Cloud client library
const storage_1 = require("@google-cloud/storage");
const stream_1 = require("stream");
// Creates a client
const storage = new storage_1.Storage();
const BUCKET_NAME = 'rsss415-asennyey';
const bucket = storage.bucket(BUCKET_NAME);
function getFileName(gsUri) {
    return gsUri.slice(gsUri.lastIndexOf('/') + 1);
}
function downloadFile(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let [response] = yield bucket.file(getFileName(uri)).download({});
        // Downloads the file
        return response;
    });
}
exports.downloadFile = downloadFile;
function uploadFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const gcsFile = bucket.file(file.originalname);
        const passthroughStream = new stream_1.PassThrough();
        passthroughStream.write(file.buffer);
        passthroughStream.end();
        return new Promise((res, rej) => {
            passthroughStream.pipe(gcsFile.createWriteStream()).on('finish', () => {
                // The file upload is complete
                console.log(gcsFile.baseUrl);
                res(`gs://${BUCKET_NAME}/${gcsFile.name}`);
            });
        });
    });
}
exports.uploadFile = uploadFile;
