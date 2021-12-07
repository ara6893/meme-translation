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
// The ID of your GCS bucket
const bucketName = 'your-unique-bucket-name';
// The path to your file to upload
// const filePath = 'path/to/your/file';
// The new ID for your GCS file
// const destFileName = 'your-new-file-name';
// Imports the Google Cloud client library
const storage_1 = require("@google-cloud/storage");
// Creates a client
const storage = new storage_1.Storage();
function uploadFile(filePath, destFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield storage.bucket(bucketName).upload(filePath, {
            destination: destFileName,
        });
        console.log(`${filePath} uploaded to ${bucketName}`);
    });
}
