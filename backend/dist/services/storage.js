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
const uuid_1 = require("uuid");
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
        const fileName = `${(0, uuid_1.v4)()}.${file.originalname.substring(file.originalname.lastIndexOf('.') + 1)}`;
        const gcsFile = bucket.file(fileName);
        const passthroughStream = new stream_1.PassThrough();
        passthroughStream.write(file.buffer);
        passthroughStream.end();
        return new Promise((res, rej) => {
            passthroughStream.pipe(gcsFile.createWriteStream()).on('finish', () => {
                // The file upload is complete
                res(`gs://${BUCKET_NAME}/${fileName}`);
            });
        });
    });
}
exports.uploadFile = uploadFile;
