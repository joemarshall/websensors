---
---
// this could be either local or session storage
    // set it to local storage so that it persists
    // across devices in some browsers
    var storageLocation=localStorage;

    var redirectUri = "{{ '/filedownload.html' |absolute_url }}";

    const msalConfig = {
        auth: {
            clientId: 'bb2de524-1225-4957-a924-f91c5efe963f'
        },
        cache: {
            cacheLocation: "localStorage", // This configures where your cache will be stored
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        }
    };

    var msalInstance = new msal.PublicClientApplication(msalConfig);
    let loggedIn = false;

    function oneDriveLoggedIn() {
        return loggedIn;
    }

    var oneDriveAuthCallbacks=[];
    function fireAuthCallbacks()
    {
        oneDriveAuthCallbacks.forEach((x)=>{x(loggedIn)});
    }

    function addAuthCallback(cb)
    {
        oneDriveAuthCallbacks.push(cb);
    }

    async function msLogout() {
        msalInstance.logoutPopup();
        loggedIn = false;
    }


    async function msLogin(autoLogin = false) {
        loggedIn = false;
        let currentAccounts = msalInstance.getAllAccounts();
        if (currentAccounts === null || currentAccounts.length == 0) {
            if (autoLogin) {
                try {
                    const loginResponse = await msalInstance.loginPopup({ redirectUri: redirectUri });                    
                    currentAccounts = msalInstance.getAllAccounts();
                } catch (err) {
                    if(err.errorCode=='user_cancelled')
                    {
                        return "cancelled";
                    }else
                    {
                        console.log(err);
                        // handle login error
                        return undefined;
                    }
                }
            } else {
                return undefined;
            }
        }

        msalInstance.setActiveAccount(currentAccounts[0]);
        var request = {
            scopes: ["Files.ReadWrite.All"],
            redirectUri: redirectUri,
        };

        var authToken, tokenResponse;
        try {
            tokenResponse = await msalInstance.acquireTokenSilent(request);
            authToken = tokenResponse.accessToken;
        } catch (err) {
            console.log("No silent token", err);
            try {
                tokenResponse = msalInstance.acquireTokenPopup(request);
                authToken = tokenResponse.accessToken;
            } catch (err) {
                console.log("Couldn't authenticate", err);
                return;
            }
        }
        if (authToken) {
            loggedIn = true;
        }
        return authToken;
    }

    class OneDriveFileRef
    {


        constructor(id)
        {
            this.id=id;
        }

        async login(allowPopup)
        {
            let retVal=await msLogin(allowPopup);
            fireAuthCallbacks;
            return retVal;

        }

        async logout()
        {
            let retVal=await msLogout();
            fireAuthCallbacks();
            return retVal;
        }

        loggedIn()
        {
            return oneDriveLoggedIn();
        }

        setLoginCallback(cb)
        {
            addAuthCallback(cb);
        }

        keyName(key)
        {
            return key+":["+this.id+"]";
        }

        async checkAuth(allowPopup)
        {
            this.authToken = await msLogin(allowPopup);
            fireAuthCallbacks();
            this.authURL = storageLocation.getItem('onedrive_url');
            this.fileID = storageLocation.getItem(this.keyName('onedrive_file'));
            this.driveID = storageLocation.getItem(this.keyName('onedrive_drive'));
            this.folderID = storageLocation.getItem(this.keyName('onedrive_folder'));
        }

        async reload()
        {
            await this.checkAuth(false);
            if (this.authURL && this.authToken && this.driveID) 
            {
                let fileContents;
                let fileName;
                let folderName;
                // if we have a file ID, then return it
                if(this.fileID)
                {
                    // get a download URL for this file
                    var url = `${this.authURL}/drives/${this.driveID}/items/${this.fileID}`;
                    //        var url=`${authURL}/drives/${driveID}/items/${fileID}?select=id,folder,@microsoft.graph.downloadUrl`;
                    var response = await fetch(url, {
                        headers:
                        {
                            'Authorization': "Bearer " + this.authToken
                        }
                    });
                    var json = await response.json();
                    url = json['@microsoft.graph.downloadUrl'];
                    storageLocation.setItem(this.keyName('onedrive_folder'), json.parentReference.id);
                    fileName=json.name;
                    // now actually download the file (non-authenticated)
                    response = await fetch(url);
                    fileContents = await response.text();
                }
                if(this.folderID)
                {
                    folderName = await this.getFolderName();
                }
                return {fileContents, fileName,folderName};
            }
        }

        async save(codeFile,fromSaveAs)
        {
            await this.checkAuth(true);
            if (!this.authToken || !this.fileID) 
            {
                if(!fromSaveAs)
                {
                    return this.saveAs(codeFile,true)
                }else
                {
                    console.log("Loop in saveas");
                    return {};
                }
                
            }else
            {
                // send to the simple upload URL for drive
                // PUT /drives/{drive-id}/items/{item-id}/content
                var url = `${this.authURL}/drives/${this.driveID}/items/${this.fileID}/content`;
                var response = await fetch(url, {
                    method: 'PUT', headers:
                    {
                        'Content-Type': 'text/plain',
                        'Authorization': "Bearer " + this.authToken
                    },
                    body: codeFile,
                });
                var json = await response.json();
                console.log(json.name)
                var fileName=json.name;
                var folderName = await this.getFolderName();
                var fileContents=codeFile;
                return {fileContents,folderName,fileName};
            }
        }

        async saveInCurrentFolder(codeFile,saveName)
        {
            await this.checkAuth(true);
            if(!this.authToken)
            {
                return;
            }
            var url = `${this.authURL}drives/${this.driveID}/items/${this.folderID}:/${saveName}:/content`;
            var response = await fetch(url, {
                method: 'PUT', headers:
                {
                    'Content-Type': 'text/plain',
                    'Authorization': "Bearer " + this.authToken
                },
                body: codeFile,
            });
            var json = await response.json();
            // update our session storage to point at 
            // this new or updated file
            storageLocation.setItem(this.keyName('onedrive_file'), json.id);
            var fileName=json.name;
            var folderName = await this.getFolderName();
            var fileContents=codeFile;
            return {fileContents,folderName,fileName};
        }

        async saveAs(codeFile)
        {
            let caller=this;
            const dataURL="data:text/plain;base64," + btoa(codeFile);
            await this.checkAuth(true);
            var valuePromise = new Promise(
                (resolve, reject) => 
                {
                    var odOptions =
                    {
                        clientId: "bb2de524-1225-4957-a924-f91c5efe963f",
                        action: "save",
                        multiSelect: false,
                        nameConflictBehavior:"replace",
                        sourceUri:dataURL,
                        fileName:"test.py",
                        advanced: {
                            redirectUri: redirectUri,
//                            scopes: ["files.ReadWrite.All"],
                        },
                        success: async function(files){
                            // save this file id to session storage so we can save changes back
                            let file = files.value[0];
                            storageLocation.setItem('onedrive_url', files.apiEndpoint);
                            storageLocation.setItem(caller.keyName('onedrive_file'), file.id);
                            storageLocation.setItem(caller.keyName('onedrive_drive'), file.parentReference.driveId);
                            var fileName=file.name;
                            var folderName = await this.getFolderName();
                            var fileContents=codeFile;
                            return {fileContents,folderName,fileName};

                        },
                    }
                    OneDrive.save(odOptions);
                }
            );
            await valuePromise;
        }


        async open()
        {
            let caller=this;
            await this.checkAuth(true);

            var valuePromise = new Promise(
                (resolve, reject) => 
                {
                    // open file from file picker
                    var odOptions =
                    {
                        clientId: "bb2de524-1225-4957-a924-f91c5efe963f",
                        action: "query",
                        multiSelect: false,
                        advanced: {
                            redirectUri: redirectUri,
                            scopes: ["files.ReadWrite.All"],
                        },
                        success: async function(files){
                            // save this file id to session storage so we can save changes back
                            let file = files.value[0];
                            storageLocation.setItem('onedrive_url', files.apiEndpoint);
                            storageLocation.setItem(caller.keyName('onedrive_file'), file.id);
                            storageLocation.setItem(caller.keyName('onedrive_drive'), file.parentReference.driveId);
                            // GET /drives/{drive-id}/items/{item-id}/content
                            resolve(await caller.reload());
                        },
                        cancel: function () { reject("Cancel"); },
                        error: function (error) { reject(error); }
                    };
                    OneDrive.open(odOptions);
                }
            );
            return await valuePromise;
        }

        async getFolderName()
        {
            await this.checkAuth(false);
            if(!this.folderID)
            {
                return;
            }
            var url = `${this.authURL}drives/${this.driveID}/items/${this.folderID}`;
            var response = await fetch(url, {
                headers:
                {
                    'Authorization': "Bearer " + this.authToken
                }
            });
            var folderJSON = await response.json();
            var folderName = folderJSON["name"];
            if(folderJSON.parentReference && folderJSON.parentReference.path && String(folderJSON.parentReference.path).indexOf(":")!=-1)
            {
                folderName = folderJSON.parentReference.path.split(":")[1] + "/" + folderName;
            }else
            {
                folderName="/"+folderName;
            }
            return folderName;
        }

        close()
        {
            storageLocation.removeItem(this.keyName('onedrive_file'));
        }

        async chooseFolder()
        {
            await this.checkAuth(true);
            let caller=this;
            // change selected folder using file picker
            // and return name of folder in promise
            var valuePromise = new Promise(
                (resolve, reject) => {
                    var odOptions =
                    {
                        clientId: "bb2de524-1225-4957-a924-f91c5efe963f",
                        action: "query",
                        multiSelect: false,
                        fileName: "",
                        advanced: {
                            redirectUri: redirectUri,
                        },
                        success: async function (files) {
                            // folder actually
                            var folder = files.value[0];

                            var authToken = files.accessToken;
                            var authURL = files.apiEndpoint;


                            storageLocation.setItem('onedrive_url', authURL);
                            storageLocation.setItem(caller.keyName('onedrive_folder'), folder.id);
                            storageLocation.removeItem(caller.keyName('onedrive_file'));
                            storageLocation.setItem(caller.keyName('onedrive_drive'), folder.parentReference.driveId);

                            resolve(await caller.getFolderName());

                        },
                        cancel: function () { reject("cancelled"); },
                        error: function (error) { reject(error) }
                    };
                    OneDrive.save(odOptions);
                }
            );
            return await valuePromise;
        }
    }


    window.OneDriveFileRef=OneDriveFileRef;
