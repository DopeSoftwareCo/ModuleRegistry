import { Package } from "../Types/Models";
import {Authentica}
const UDS_CODES = ["000", "001", "010", "011", "100", "101", "110", "111"];


type Upload_Request = {};
type Download_Request = {};
type Search_Request = {};

type UploadFunction = (req: Upload_Request) => UploadResult;
type DownloadFunction = (req: Download_Request) => DownloadResult;
type SearchFunction = (req: Search_Request) => SearchResult;

type AuthenticationError = {
    success: boolean;
    message: string;
};

type DownloadResult = {
    content: Array<Package> | null;
    error: AuthenticationError?;
} | null;

type UploadResult  = {
    success: boolean;
    error: AuthenticationError;
} | null;

type SearchResult  = {
    content: Array<Package>;
    error: AuthenticationError;
} | null;


export class AccessPermit {
    u: UploadFunction | null = null;
    d: DownloadFunction | null = null;
    s: SearchFunction | null = null;

    constructor(binaryPermission: string) {
        // Give me the proper input, or you will get NO permissions.
        if (binaryPermission.length == 3) {
            if (binaryPermission[0] == "1") {
                this.Enable_Searching();
            }
            if (binaryPermission[1] == "1") {
                this.Enable_Downloading();
            }
            if (binaryPermission[2] == "1") {
                this.Enable_Uploading();
            }
        }

        this.u = this.NullMethod;
        this.d = this.NullMethod;
        this.s = this.NullMethod;
    }
    NullMethod() : null
    {
        return null;
    }


    private Enable_Uploading(): void {
        this.u = this.Upload;
    }

    private Enable_Downloading(): void{
        this.d = this.Download;
    }

    private Enable_Searching(): void {
        this.s = this.Search;
    }

    
    private Upload(): UploadResult {
        let result: UploadResult;
    }

    private Download(): DownloadResult{
        let result: DownloadResult;
    }

    private Search(): SearchResult{
        let result: SearchResult;

    }


    Access_Upload(): UploadFunction | null {
        return this.u();
    }

    Access_Download(): DownloadResult {
        let result: DownloadResult;
    }

    Access_Search(): SeachResult {
        
    }
}



class Flyweight_AccessPermitFactory
{
    none: AccessPermit;
    only_search: AccessPermit;
    only_download: AccessPermit;
    download_search: AccessPermit;
    only_upload: AccessPermit;
    upload_search: AccessPermit;
    upload_download: AccessPermit;
    all: AccessPermit;

    constructor()
    {
        this.none = new AccessPermit(UDS_CODES[0]);
        this.only_search = new AccessPermit(UDS_CODES[1]);
        this.only_download = new AccessPermit(UDS_CODES[2]);
        this.download_search = new AccessPermit(UDS_CODES[3]);
        this.only_upload = new AccessPermit(UDS_CODES[4]);
        this.upload_search = new AccessPermit(UDS_CODES[5]);
        this.upload_download = new AccessPermit(UDS_CODES[6]);
        this.all = new AccessPermit(UDS_CODES[7]);
    }

    
    get None() : AccessPermit
    {
        return this.none;
    }
  
    get Only_Search() : AccessPermit
    {
        return this.only_search;
    }
    
    get Only_Download() : AccessPermit
    {
        return this.only_download;
    }

    get Download_Search() : AccessPermit
    {
        return this.download_search;
    }

    get Only_Upload() : AccessPermit
    {
        return this.only_upload;
    }

    get Upload_Search() : AccessPermit
    {
        return this.upload_search;
    }

    get Upload_Download() : AccessPermit
    {
        return this.upload_download;
    }

    get All() : AccessPermit
    {
        return this.all;
    }
}