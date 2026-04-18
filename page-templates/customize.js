const params = new URLSearchParams( location.search );
const clientId = "8m07ghhogjy0q09moeunnpdu51i60n";
const baseUrl = window.location.origin;
const plushApiUrl = "https://api.pixelplush.dev/v1"; //"http://localhost:3000/v1";
const plushScoreUrl = "https://stats.pixelplush.dev/v1"; //"http://localhost:3000/v1";
let twitch = {};
let account = {};
let catalog = {};
let items = {};
let animationTimer = null;
let animationFrame = 0;
let subReference = {
    "83118047": "instafluff",
    "29788274": "maaya",
};
let twitchSubs = {};

$( ".not-logged-in" ).show();
$( ".logged-in" ).hide();

ComfyTwitch.SetAuthEndpoint( `${plushScoreUrl}/auth/code` );
ComfyTwitch.SetRefreshEndpoint( `${plushScoreUrl}/auth/refresh` );

ComfyTwitch.Check()
.then( async result => {
    // console.log( result );
    if( result ) {
        try {
            account = await fetch( `${plushScoreUrl}/accounts`, {
                headers: {
                    Twitch: result.token
                }
            } ).then( r => r.json() );

            console.log( account );

            if( account.error ) {
                throw "Login Error";
            }

            $( ".not-logged-in" ).hide();
            $( ".logged-in" ).show();

            $( ".account-image" ).attr( "src", account.profileImage );
            $( ".user-name" ).text( account.displayName || account.username );
            $( ".user-coins" ).text( account.coins );

            if( !ComfyTwitch.Scopes || ComfyTwitch.Scopes.includes( "user:read:subscriptions" ) ) {
                for( let channel in subReference ) {
                    let subCheck = await fetch( `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=${channel}&user_id=${account.platformId}`, {
                        headers: {
                            "Client-ID": clientId,
                            Authorization: `Bearer ${result.token}`
                        }
                    } ).then( r => r.json() );
                    twitchSubs[ subReference[ channel ] ] = ( subCheck && subCheck.data && subCheck.data.length > 0 && !!subCheck.data[ 0 ].tier );
                }
            }

            // document.querySelector( "#userid" ).innerText = r.key;
        }
        catch( error ) {
            // TODO: Auth Failed
            console.log( "Auth Validate Failed", error );
            toastr.error( error, "Authentication Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
        }
    }
    else {
        $( ".not-logged-in" ).show();
        $( ".logged-in" ).hide();
    }

    catalog = await fetch( "https://www.pixelplush.dev/assets/catalog.json", {
    }).then( r => r.json() );

    // console.log( catalog );

    catalog.forEach( x => {
        items[ x.id ] = x;
    });

    // console.log( items );

    // Populate Catalog
    // $( "#inputItemList" ).empty();

    // inputItemList
    populateItemList( $( "#market-search" ).val() );

    $( ".logout" ).on( "click", function() {
        ComfyTwitch.Logout();
        window.location.reload();
    });
});

$( document ).ready(function() {
        $( "#market-search" ).on( "input", ( e ) => {
            populateItemList( e.target.value );
        });
        $( "#checkboxChars" ).on( "change", ( e ) => {
            populateItemList( $( "#market-search" ).val() );
        });
        $( "#checkboxPets" ).on( "change", ( e ) => {
            populateItemList( $( "#market-search" ).val() );
        });
        $( "#checkboxAddons" ).on( "change", ( e ) => {
            populateItemList( $( "#market-search" ).val() );
        });
        $( "#checkboxBundles" ).on( "change", ( e ) => {
            populateItemList( $( "#market-search" ).val() );
        });
        $( "#checkboxOutfits" ).on( "change", ( e ) => {
            populateItemList( $( "#market-search" ).val() );
        });
});

function populateItemList( searchText = "" ) {
    $( "#catalog-list" ).empty();
    let filteredCatalog = catalog.filter( x => x.id.includes( searchText ) || x.theme.toLowerCase().includes( searchText ) );
    filteredCatalog = filteredCatalog.filter( x => x.id !== "coin_remove" );
    if( !$( "#checkboxChars" ).prop( "checked" ) ) {
        filteredCatalog = filteredCatalog.filter( x => x.type !== "character" );
    }
    if( !$( "#checkboxPets" ).prop( "checked" ) ) {
        filteredCatalog = filteredCatalog.filter( x => x.type !== "pet" );
    }
    if( !$( "#checkboxAddons" ).prop( "checked" ) ) {
        filteredCatalog = filteredCatalog.filter( x => x.type !== "add-on" );
    }
    if( !$( "#checkboxBundles" ).prop( "checked" ) ) {
        filteredCatalog = filteredCatalog.filter( x => x.type !== "bundle" );
    }
    if( !$( "#checkboxOutfits" ).prop( "checked" ) ) {
        filteredCatalog = filteredCatalog.filter( x => !x.id.startsWith( "outfit" ) );
    }

    // Add Deselect-All Option
    $( "#catalog-list" ).append( `
        <div class="col-sm-3 col-6 mb-2">
            <div id="item_none" class="card h-100 text-center bg-success bg-light">
            <div class="card-content">
                <div class="card-body py-1">
                <div class="badge-circle badge-circle-xlg badge-circle-character mx-auto mb-50">
                    <img id="item_none_preview" class="pixelated item-scale" src=""/>
                </div>
                <div class="badge badge-pill badge-character d-inline-flex align-items-center">
                    <span>Outfits/Character/Pet</span>
                </div>
                <h5 class="mb-0">Deselect All</h5>
                <div class="pt-1">
                    <button class="btn btn-sm btn-danger" type="button" onclick="deactivateItem('coin_remove').then( () => deactivateItem('pet_none') ).then( () => deactivateItem('outfit_skin1') );"><strong>Deselect All</strong></button>
                </div>
                </div>
            </div>
            </div>
        </div>
    `);

    // Sort by selected
    filteredCatalog.sort( ( a, b ) => {
        let isASelected = false;
        let isBSelected = false;
        if( account.style &&
            ( account.style[ a.category || a.type ] && account.style[ a.category || a.type ] === a.id ) ) {
            isASelected = true;
        }
        else if( account.styles &&
            account.styles[ a.category || a.type ] && account.styles[ a.category || a.type ].includes( a.id ) ) {
            isASelected = true;
        }
        if( account.style &&
            ( account.style[ b.category || b.type ] && account.style[ b.category || b.type ] === b.id ) ) {
            isBSelected = true;
        }
        else if( account.styles &&
            account.styles[ b.category || b.type ] && account.styles[ b.category || b.type ].includes( b.id ) ) {
            isBSelected = true;
        }
        
        if( isASelected && !isBSelected ) {
            return -1;
        }
        else if( !isASelected && isBSelected ) {
            return 1;
        }
        else {
            return 0;
        }
    } );

    // Handle adding subscription items
    filteredCatalog.filter( x => !!x.subscription ).forEach( ( item, index ) => {
        let typeBG = "primary";
        let showSelectionButtons = true;
        switch( item.type ) {
            case "character":
                typeBG = "primary";
                break;
            case "pet":
                typeBG = "danger";
                break;
            case "add-on":
                typeBG = "success";
                showSelectionButtons = false;
                break;
            case "bundle":
                typeBG = "info";
                showSelectionButtons = false;
                break;
            case "body":
            case "equipment":
            case "accessory":
            case "outfit":
            case "effect":
                typeBG = "warning";
                break;
            default:
                typeBG = "primary";
                break;
        }
        if( account.style &&
            ( account.style[ item.category || item.type ] && account.style[ item.category || item.type ] === item.id ) ) {
            // Selected Skin
            $( "#catalog-list" ).append( `
                <div class="col-sm-3 col-6 mb-2">
                    <div id="item_${item.id}" class="card h-100 text-center bg-success bg-light">
                    <div class="card-content">
                        <div class="card-body py-1">
                        <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                            <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                        </div>
                        <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                            <span>${item.type}</span>
                        </div>
                        <h5 class="mb-0">${item.name}</h5>
                        <div class="pt-1">
                            <button class="btn btn-sm btn-info" type="button" onclick="queueItem('${item.id}', false)"><i class="bx bxl-twitch font-medium-3"></i> <strong>Unselect</strong></button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            `);
        }
        else if( twitchSubs[ item.subscription.toLowerCase() ] ) {
            if( account.styles &&
                account.styles[ item.category || item.type ] && account.styles[ item.category || item.type ].includes( item.id ) ) {
                // Already queued
                if( showSelectionButtons ) {
                    $( "#catalog-list" ).append( `
                        <div class="col-sm-3 col-6 mb-2">
                            <div id="item_${item.id}" class="card h-100 text-center bg-secondary bg-light">
                            <div class="card-content">
                                <div class="card-body py-1">
                                <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                                    <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                                </div>
                                <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                                    <span>${item.type}</span>
                                </div>
                                <h5 class="mb-0">${item.name}</h5>
                                <div class="pt-1">
                                    <button class="btn btn-sm btn-info" type="button" onclick="queueItem('${item.id}', false)"><i class="bx bxl-twitch font-medium-3"></i> <strong>Unselect</strong></button>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    `);
                }
                else {
                    $( "#catalog-list" ).append( `
                        <div class="col-sm-3 col-6 mb-2">
                            <div id="item_${item.id}" class="card h-100 text-center bg-secondary bg-light">
                            <div class="card-content">
                                <div class="card-body py-1">
                                <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                                    <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                                </div>
                                <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                                    <span>${item.type}</span>
                                </div>
                                <h5 class="mb-0">${item.name}</h5>
                                </div>
                            </div>
                            </div>
                        </div>
                    `);
                }
            }
            else {
                // Not queued
                if( showSelectionButtons ) {
                    $( "#catalog-list" ).append( `
                        <div class="col-sm-3 col-6 mb-2">
                            <div id="item_${item.id}" class="card h-100 text-center bg-secondary bg-light">
                            <div class="card-content">
                                <div class="card-body py-1">
                                <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                                    <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                                </div>
                                <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                                    <span>${item.type}</span>
                                </div>
                                <h5 class="mb-0">${item.name}</h5>
                                <div class="pt-1">
                                    <button class="btn btn-sm btn-twitch" type="button" onclick="queueItem('${item.id}', true)"><i class="bx bxl-twitch font-medium-3"></i> <strong>Select</strong></button>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    `);
                }
                else {
                    $( "#catalog-list" ).append( `
                        <div class="col-sm-3 col-6 mb-2">
                            <div id="item_${item.id}" class="card h-100 text-center bg-secondary bg-light">
                            <div class="card-content">
                                <div class="card-body py-1">
                                <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                                    <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                                </div>
                                <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                                    <span>${item.type}</span>
                                </div>
                                <h5 class="mb-0">${item.name}</h5>
                                </div>
                            </div>
                            </div>
                        </div>
                    `);
                }
            }
        }
        else {
            $( "#catalog-list" ).append( `
                <div class="col-sm-3 col-6 mb-2">
                    <div id="item_${item.id}" class="card h-100 text-center bg-purple">
                    <div class="card-content">
                        <div class="card-body py-1">
                        <div class="badge-circle badge-circle-xlg badge-circle-light-${typeBG} mx-auto mb-50">
                            <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                        </div>
                        <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                            <span>${item.type}</span>
                        </div>
                        <h5 class="mb-0">${item.name}</h5>
                        <div class="pt-1">
                            <button class="btn btn-sm btn-twitch" type="button" onclick="verifySub('${item.id}')"><i class="bx bxl-twitch font-medium-3"></i> <strong>Verify ${item.subscription} Sub</strong></button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            `);
        }

        $( `#item_${item.id}` ).hover( function() {
            if( animationTimer ) {
                clearInterval( animationTimer );
            }
            if( item.type === "add-on" ) { return; }
            if( item.type === "bundle" ) { return; }
            animationTimer = setInterval( () => {
                animationFrame++;
                let preview = getItemPreview( item.id, animationFrame );
                if( document.querySelector( `#item_${item.id}_preview` ) ) {
                    document.querySelector( `#item_${item.id}_preview` ).setAttribute( "src", preview );
                }
            }, 100 );
        }, function() {
            clearInterval( animationTimer );
            animationFrame = 0;
            let preview = getItemPreview( item.id, 0 );
            document.querySelector( `#item_${item.id}_preview` ).setAttribute( "src", preview );
        });
    });

    // Add the owned items first
    if( account && account.owned ) {
        filteredCatalog.filter( x => account.owned.includes( x.id ) ).forEach( ( item, index ) => {
            let typeBG = "primary";
            let showSelectionButtons = true;
            switch( item.type ) {
                case "character":
                    typeBG = "primary";
                    break;
                case "pet":
                    typeBG = "danger";
                    break;
                case "add-on":
                    typeBG = "success";
                    showSelectionButtons = false;
                    break;
                case "bundle":
                    typeBG = "info";
                    showSelectionButtons = false;
                    break;
                case "body":
                case "equipment":
                case "accessory":
                case "outfit":
                case "effect":
                    typeBG = "warning";
                    break;
                default:
                    typeBG = "primary";
                    break;
            }
            if( account.style &&
                ( account.style[ item.category || item.type ] && account.style[ item.category || item.type ] === item.id ) ) {
                // Selected Skin
                $( "#catalog-list" ).append( `
                    <div class="col-sm-3 col-6 mb-2">
                        <div id="item_${item.id}" class="card h-100 text-center bg-success bg-light">
                        <div class="card-content">
                            <div class="card-body py-1">
                            <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                                <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                            </div>
                            <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                                <span>${item.type}</span>
                            </div>
                            <h5 class="mb-0">${item.name}</h5>
                            <div class="pt-1">
                                <button class="btn btn-sm btn-info" type="button" onclick="queueItem('${item.id}', false)"><strong>Unselect</strong></button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                `);
            }
            else {
                if( account.styles &&
                    account.styles[ item.category || item.type ] && account.styles[ item.category || item.type ].includes( item.id ) ) {
                    if( showSelectionButtons ) {
                        $( "#catalog-list" ).append( `
                            <div class="col-sm-3 col-6 mb-2">
                                <div id="item_${item.id}" class="card h-100 text-center bg-secondary bg-light">
                                <div class="card-content">
                                    <div class="card-body py-1">
                                    <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                                        <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                                    </div>
                                    <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                                        <span>${item.type}</span>
                                    </div>
                                    <h5 class="mb-0">${item.name}</h5>
                                    <div class="pt-1">
                                        <button class="btn btn-sm btn-info" type="button" onclick="queueItem('${item.id}', false)"><strong>Unselect</strong></button>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        `);
                    }
                    else {
                        $( "#catalog-list" ).append( `
                            <div class="col-sm-3 col-6 mb-2">
                                <div id="item_${item.id}" class="card h-100 text-center bg-secondary bg-light">
                                <div class="card-content">
                                    <div class="card-body py-1">
                                    <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                                        <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                                    </div>
                                    <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                                        <span>${item.type}</span>
                                    </div>
                                    <h5 class="mb-0">${item.name}</h5>
                                    </div>
                                </div>
                                </div>
                            </div>
                        `);
                    }
                }
                else {
                    if( showSelectionButtons ) {
                        $( "#catalog-list" ).append( `
                            <div class="col-sm-3 col-6 mb-2">
                                <div id="item_${item.id}" class="card h-100 text-center bg-secondary bg-light">
                                <div class="card-content">
                                    <div class="card-body py-1">
                                    <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                                        <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                                    </div>
                                    <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                                        <span>${item.type}</span>
                                    </div>
                                    <h5 class="mb-0">${item.name}</h5>
                                    <div class="pt-1">
                                        <button class="btn btn-sm btn-secondary" type="button" onclick="queueItem('${item.id}', true)"><strong>Select</strong></button>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        `);
                    }
                    else {
                        $( "#catalog-list" ).append( `
                            <div class="col-sm-3 col-6 mb-2">
                                <div id="item_${item.id}" class="card h-100 text-center bg-secondary bg-light">
                                <div class="card-content">
                                    <div class="card-body py-1">
                                    <div class="badge-circle badge-circle-xlg badge-circle-${typeBG} mx-auto mb-50">
                                        <img id="item_${item.id}_preview" class="pixelated item-scale" src="${getItemPreview( item.id, 0 )}"/>
                                    </div>
                                    <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                                        <span>${item.type}</span>
                                    </div>
                                    <h5 class="mb-0">${item.name}</h5>
                                    </div>
                                </div>
                                </div>
                            </div>
                        `);
                    }
                }
            }

            $( `#item_${item.id}` ).hover( function() {
                if( animationTimer ) {
                    clearInterval( animationTimer );
                }
                if( item.type === "add-on" ) { return; }
                if( item.type === "bundle" ) { return; }
                animationTimer = setInterval( () => {
                    animationFrame++;
                    let preview = getItemPreview( item.id, animationFrame );
                    if( document.querySelector( `#item_${item.id}_preview` ) ) {
                        document.querySelector( `#item_${item.id}_preview` ).setAttribute( "src", preview );
                    }
                }, 100 );
            }, function() {
                clearInterval( animationTimer );
                animationFrame = 0;
                let preview = getItemPreview( item.id, 0 );
                document.querySelector( `#item_${item.id}_preview` ).setAttribute( "src", preview );
            });
        });
    }
}

function getItemPreview( itemId, frame ) {
    let item = items[ itemId ];
    if( item.theme === "None" ) { return ""; }
    let dir = "";
    switch( item.type ) {
        case "bundle":
            return `https://www.pixelplush.dev/assets/bundles/${item.path}`;
        case "add-on":
            return `https://www.pixelplush.dev/assets/add-ons/${item.path}`;
        case "pet":
            dir = `pets/${item.path}`;
            break;
        case "body":
            dir = `skins/body/${item.category}/${item.path}`;
            break;
        case "equipment":
            dir = `skins/equipment/${item.category}/${item.path}`;
            break;
        case "accessory":
            dir = `skins/accessories/${item.category}/${item.path}`;
            break;
        case "outfit":
            dir = `skins/outfits/${item.category}/${item.path}`;
            break;
        case "effect":
            dir = `skins/effects/${item.path}`;
            break;
        case "character":
        default:
            dir = `${item.type}s/${item.id}`;
            break;
    }

    let animFrame = frame % 10;
    let direction = "front";
    switch( Math.floor( ( frame % 80 ) / 20 ) ) {
        case 0:
            direction = "front";
            break;
        case 1:
            direction = "left";
            break;
        case 2:
            direction = "back";
            break;
        case 3:
            direction = "right";
            break;
    }

    return `https://www.pixelplush.dev/assets/${dir}/${item.path}_${direction}/${item.path}_${direction}${animFrame + 1}.png`;
}

async function verifySub( itemId ) {
    try {
        let result = await Swal.fire({
            title: `Verify Twitch subscription to ${items[ itemId ].subscription}?`,
            // type: 'success',
            imageUrl: `${getItemPreview( itemId, 0 )}`,
            imageWidth: 48,
            imageHeight: 48,
            confirmButtonClass: 'btn btn-twitch',
            cancelButtonClass: 'btn btn-danger ml-1',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            buttonsStyling: false,
        });
        if( result.value ) {
            ComfyTwitch.Logout();
            localStorage.setItem( "redirectPage", window.location.href );
            ComfyTwitch.Login( clientId, `${baseUrl}/redirect.html`, [ "user:read:email", "user:read:subscriptions" ] );
        }
    }
    catch( err ) {
        // console.log( err );
        toastr.error( err, "Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
}

async function activateItem( itemId ) {
    try {
        // console.log( itemId );
        let result = await fetch( `${plushScoreUrl}/accounts/design`, {
            method: "POST",
            headers: {
                Twitch: ComfyTwitch.Token,
            },
            body: JSON.stringify( {
                item: itemId
            })
        } ).then( r => r.json() );
        // console.log( "activating!", result );
        if( result.error ) {
            throw result.error;
        }
        // window.location.reload();

        account = await fetch( `${plushScoreUrl}/accounts`, {
            headers: {
                Twitch: ComfyTwitch.Token
            }
        } ).then( r => r.json() );
        $( ".user-coins" ).text( account.coins );
        populateItemList( $( "#market-search" ).val() );
        // toastr.success( `Set to ${items[ itemId ].name}!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
    catch( err ) {
        // console.log( err );
        toastr.error( err, "Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
}

async function deactivateItem( itemId ) {
    try {
        // console.log( itemId );
        let result = await fetch( `${plushScoreUrl}/accounts/design/unset`, {
            method: "POST",
            headers: {
                Twitch: ComfyTwitch.Token,
            },
            body: JSON.stringify( {
                item: itemId
            })
        } ).then( r => r.json() );
        // console.log( "deactivating!", result );
        if( result.error ) {
            throw result.error;
        }
        // window.location.reload();

        account = await fetch( `${plushScoreUrl}/accounts`, {
            headers: {
                Twitch: ComfyTwitch.Token
            }
        } ).then( r => r.json() );
        $( ".user-coins" ).text( account.coins );
        populateItemList( $( "#market-search" ).val() );
        // toastr.success( `Set to ${items[ itemId ].name}!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
    catch( err ) {
        // console.log( err );
        toastr.error( err, "Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
}

async function queueItem( itemId, queue = true ) {
    try {
        // console.log( itemId, queue );
        let result = await fetch( `${plushScoreUrl}/accounts/design/list`, {
            method: "POST",
            headers: {
                Twitch: ComfyTwitch.Token,
            },
            body: queue ? JSON.stringify( {
                item: itemId
            }) : JSON.stringify( {
                item: itemId,
                remove: true
            })
        } ).then( r => r.json() );
        // console.log( "activating!", result );
        if( result.error ) {
            throw result.error;
        }
        // window.location.reload();

        account = await fetch( `${plushScoreUrl}/accounts`, {
            headers: {
                Twitch: ComfyTwitch.Token
            }
        } ).then( r => r.json() );
        $( ".user-coins" ).text( account.coins );
        populateItemList( $( "#market-search" ).val() );
        // toastr.success( `Set to ${items[ itemId ].name}!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
    catch( err ) {
        // console.log( err );
        toastr.error( err, "Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
}

async function buyItem( itemId ) {
    try {
        let result = await Swal.fire({
            title: `Add ${items[ itemId ].name} to your account?`,
            text: `This will use ${Math.floor( items[ itemId ].sale ? items[ itemId ].cost / 2 : items[ itemId ].cost )} coins`,
            // type: 'success',
            imageUrl: `${getItemPreview( itemId, 0 )}`,
            imageWidth: 48,
            imageHeight: 48,
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn btn-danger ml-1',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            buttonsStyling: false,
        });
        if( result.value ) {
            let result = await fetch( `${plushApiUrl}/shop/buy`, {
                method: "POST",
                headers: {
                    Twitch: ComfyTwitch.Token,
                },
                body: JSON.stringify( {
                    item: itemId
                })
            } ).then( r => r.json() );
            // console.log( "done!", result );
            if( result.error ) {
                throw result.error;
            }
            // window.location.reload();

            account = await fetch( `${plushScoreUrl}/accounts`, {
                headers: {
                    Twitch: ComfyTwitch.Token
                }
            } ).then( r => r.json() );
            $( ".user-coins" ).text( account.coins );
            populateItemList( $( "#market-search" ).val() );
            toastr.success( `You got ${items[ itemId ].name}!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
            if( !itemId.startsWith( "addon" ) ) {
                let confirm = await Swal.fire({
                    title: `Use ${items[ itemId ].name}?`,
                    text: `Would you like to set ${items[ itemId ].name} as your active ${items[ itemId ].type}?`,
                    // type: 'success',
                    imageUrl: `${getItemPreview( itemId, 0 )}`,
                    imageWidth: 48,
                    imageHeight: 48,
                    confirmButtonClass: 'btn btn-primary',
                    cancelButtonClass: 'btn btn-danger ml-1',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes!',
                    cancelButtonText: 'No',
                    buttonsStyling: false,
                });
                if( confirm.value ) {
                await activateItem( itemId );
                    toastr.success( `${items[ itemId ].name} is now selected!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
                }
            }
        }
    }
    catch( err ) {
        // console.log( err );
        toastr.error( err, "Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
}
