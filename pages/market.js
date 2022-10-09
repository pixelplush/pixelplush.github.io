const params = new URLSearchParams( location.search );
const clientId = "8m07ghhogjy0q09moeunnpdu51i60n";
const baseUrl = window.location.origin;
const plushApiUrl = "https://api.pixelplush.dev/v1"; //"http://localhost:3000/v1";
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

ComfyTwitch.Check()
.then( async result => {
    // console.log( result );
    if( result ) {
        try {
            account = await fetch( `${plushApiUrl}/accounts`, {
                headers: {
                    Twitch: result.token
                }
            } ).then( r => r.json() );

            // console.log( account );

            if( account.error ) {
                throw "Login Error";
            }

            $( ".not-logged-in" ).hide();
            $( ".logged-in" ).show();

            $( ".account-image" ).attr( "src", account.profileImage );
            $( ".user-name" ).text( account.displayName || account.username );
            $( ".user-coins" ).text( account.coins );

            if( ComfyTwitch.Scopes.includes( "user:read:subscriptions" ) ) {
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
    // catalog = await fetch( "http://localhost:10000/catalog.json", {
    }).then( r => r.json() );

    // catalog = catalog.filter( x => !x.hidden );

    // console.log( catalog );

    catalog.forEach( x => {
        items[ x.id ] = x;
    });

    // console.log( items );

    // Populate Catalog
    // $( "#inputItemList" ).empty();

    // inputItemList
    populateItemList();

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
    let filteredCatalog = catalog.filter( x => x.group.toLowerCase().includes( searchText ) || x.name.toLowerCase().includes( searchText ) || x.theme.toLowerCase().includes( searchText ) );
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

    // Handle adding subscription items
    filteredCatalog.filter( x => !!x.subscription ).forEach( ( item, index ) => {
        let typeBG = "primary";
        switch( item.type ) {
            case "character":
                typeBG = "primary";
                break;
            case "pet":
                typeBG = "danger";
                break;
            case "add-on":
                typeBG = "success";
                break;
            case "bundle":
                typeBG = "info";
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
        // console.log( item );
        if( twitchSubs[ item.subscription.toLowerCase() ] ) {
            $( "#catalog-list" ).append( `
                <div class="col-sm-3 col-6 mb-2">
                    <div id="item_${item.id}" class="card h-100 text-center bg-dark bg-light">
                    <div class="card-content">
                        <div class="card-body py-1">
                        <div class="badge-circle badge-circle-xlg badge-circle-light-${typeBG} mx-auto mb-50">
                            <img id="item_${item.id}_preview" class="pixelated item-scale" width="26" src="${getItemPreview( item.id, 0 )}"/>
                        </div>
                        <div class="badge badge-pill badge-light-${typeBG} d-inline-flex align-items-center">
                            <span>${item.type}</span>
                        </div>
                        <h5 class="mb-0">${item.name}</h5>
                        <div class="pt-1">
                            <button class="btn btn-sm btn-outline-secondary" type="button" disabled><i class="bx bxl-twitch font-medium-3"></i> <strong>Owned</strong></button>
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
                            <button class="btn btn-sm btn-twitch" type="button" onclick="verifySub('${item.id}')"><i class="bx bxl-twitch font-medium-3"></i> <strong>${item.subscription}</strong></button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            `);
        }
    });

    filteredCatalog.forEach( ( item, index ) => {
        let typeBG = "primary";
        switch( item.type ) {
            case "character":
                typeBG = "primary";
                break;
            case "pet":
                typeBG = "danger";
                break;
            case "add-on":
                typeBG = "success";
                break;
            case "bundle":
                typeBG = "info";
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
        if( account && account.owned && account.owned.includes( item.id ) ) {
            if( item.hidden && !( ( account.username === "instafluff" || account.username === "maaya" ) && item.beta ) ) {
                // --- Skip the hidden items from the marketplace (2022-03-30) ---
                // $( "#catalog-list" ).append( `
                //     <div class="col-sm-3 col-6 mb-2">
                //         <div id="item_${item.id}" class="card h-100 text-center bg-dark bg-light">
                //         <div class="card-content">
                //             <div class="card-body py-1">
                //             <div class="badge-circle badge-circle-xlg badge-circle-light-${typeBG} mx-auto mb-50">
                //                 <img id="item_${item.id}_preview" class="pixelated item-scale" width="26" src="${getItemPreview( item.id, 0 )}"/>
                //             </div>
                //             <div class="badge badge-pill badge-secondary d-inline-flex align-items-center">
                //                 <span>${item.type}</span>
                //             </div>
                //             <h5 class="mb-0">${item.name}</h5>
                //             <div class="pt-1">
                //                 <button class="btn btn-sm btn-outline-secondary" type="button" disabled><strong>Owned</strong></button>
                //             </div>
                //             </div>
                //         </div>
                //         </div>
                //     </div>
                // `);
            }
            else {
                $( "#catalog-list" ).append( `
                    <div class="col-sm-3 col-6 mb-2">
                        <div id="item_${item.id}" class="card h-100 text-center bg-dark bg-light">
                        <div class="card-content">
                            <div class="card-body py-1">
                            <div class="badge-circle badge-circle-xlg badge-circle-light-${typeBG} mx-auto mb-50">
                                <img id="item_${item.id}_preview" class="pixelated item-scale" width="26" src="${getItemPreview( item.id, 0 )}"/>
                            </div>
                            <div class="badge badge-pill badge-secondary d-inline-flex align-items-center">
                                <span>${item.type}</span>
                            </div>
                            <h5 class="mb-0">${item.name}</h5>
                            <div class="pt-1">
                                <button class="btn btn-sm btn-outline-secondary" type="button" disabled><img src="public/app-assets/images/icon/plush_coin.gif" height="20px" class="pixelated" /> <strong>${item.sale ? `<span class="strikeout">${item.cost}</span> -> ` : ""}${item.cost === 0 ? "FREE" : ( item.sale ? `<span class="text-secondary">${item.cost / 2}</span>` : item.cost )}</strong></button>
                                ${item.cost === 0 ? "" : `<button class="btn btn-sm btn-outline-secondary" type="button" onclick="giftItem('${item.id}')"><img src="https://www.pixelplush.dev/assets/items/gift_smal_redl.png" height="20px" class="pixelated" /> <strong>${item.sale ? `<span class="strikeout">${item.cost}</span> -> ` : ""}${item.cost === 0 ? "FREE" : ( item.sale ? `<span class="text-secondary">${item.cost / 2}</span>` : item.cost )}</strong></button>`}
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                `);
            }
        }
        else if( !item.hidden || ( ( account.username === "instafluff" || account.username === "maaya" ) && item.beta ) ) {
            $( "#catalog-list" ).append( `
                <div class="col-sm-3 col-6 mb-2">
                    <div id="item_${item.id}" class="card h-100 text-center">
                    <div class="card-content">
                        <div class="card-body py-1">
                        <div class="badge-circle badge-circle-xlg badge-circle-light-${typeBG} mx-auto mb-50">
                            <img id="item_${item.id}_preview" class="pixelated item-scale" width="26" src="${getItemPreview( item.id, 0 )}"/>
                        </div>
                        <div class="badge badge-pill badge-${typeBG} d-inline-flex align-items-center">
                            <span>${item.type}</span>
                        </div>
                        <h5 class="mb-0">${item.name}</h5>
                        <div class="pt-1">
                            <button class="btn btn-sm btn-outline-primary" type="button" onclick="buyItem('${item.id}')"><img src="public/app-assets/images/icon/plush_coin.gif" height="20px" class="pixelated" /> <strong>${item.sale ? `<span class="strikeout">${item.cost}</span> -> ` : ""}${item.cost === 0 ? "FREE" : ( item.sale ? `<span class="text-success">${item.cost / 2}</span>` : item.cost )}</strong></button>
                            ${item.cost === 0 ? "" : `<button class="btn btn-sm btn-outline-primary" type="button" onclick="giftItem('${item.id}')"><img src="https://www.pixelplush.dev/assets/items/gift_smal_redl.png" height="20px" class="pixelated" /> <strong>${item.sale ? `<span class="strikeout">${item.cost}</span> -> ` : ""}${item.cost === 0 ? "FREE" : ( item.sale ? `<span class="text-secondary">${item.cost / 2}</span>` : item.cost )}</strong></button>`}
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
}

function getItemPreview( itemId, frame ) {
    let item = items[ itemId ];
    let dir = "";
    switch( item.type ) {
        case "bundle":
            return `https://www.pixelplush.dev/assets/bundles/${item.path}`;
        case "add-on":
            return `https://www.pixelplush.dev/assets/add-ons/${item.path}`;
            // return `http://localhost:10000/add-ons/${item.path}`;
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
            console.log( "done!", result );
            if( result.error ) {
                throw result.error;
            }
            // window.location.reload();

            account = await fetch( `${plushApiUrl}/accounts`, {
                headers: {
                    Twitch: ComfyTwitch.Token
                }
            } ).then( r => r.json() );
            $( ".user-coins" ).text( account.coins );
            populateItemList();
            toastr.success( `You got ${items[ itemId ].name}!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
            if( itemId.startsWith( "bundle" ) ) {
                Swal.fire({
                    title: "PixelPlush Bundle Set Purchased!",
                    text: `You unlocked: ${items[ itemId ].items.split( "," ).map( x => items[ x ].name).join( ", " )}!`,
                    imageUrl: `${getItemPreview( itemId, 0 )}`,
                    imageWidth: 48,
                    imageHeight: 48,
                    animation: false,
                    customClass: 'animated bounceIn',
                    confirmButtonClass: 'btn btn-primary',
                    buttonsStyling: false,
                });
            }
            if( !itemId.startsWith( "addon" ) && !itemId.startsWith( "bundle" ) ) {
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
        console.log( itemId );
        let result = await fetch( `${plushApiUrl}/accounts/design`, {
            method: "POST",
            headers: {
                Twitch: ComfyTwitch.Token,
            },
            body: JSON.stringify( {
                item: itemId
            })
        } ).then( r => r.json() );
        console.log( "activating!", result );
        if( result.error ) {
            throw result.error;
        }
        // window.location.reload();

        account = await fetch( `${plushApiUrl}/accounts`, {
            headers: {
                Twitch: ComfyTwitch.Token
            }
        } ).then( r => r.json() );
        $( ".user-coins" ).text( account.coins );
        populateItemList();
        // toastr.success( `Set to ${items[ itemId ].name}!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
    catch( err ) {
        // console.log( err );
        toastr.error( err, "Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
}

async function giftItem( itemId ) {
    try {
        let result = await Swal.fire({
            title: `Create a gift code for ${items[ itemId ].name}?`,
            text: `A gift code! This will use ${Math.floor( items[ itemId ].sale ? items[ itemId ].cost / 2 : items[ itemId ].cost )} coins`,
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
                    item: itemId,
                    coupon: true
                })
            } ).then( r => r.json() );
            console.log( "done!", result );
            if( result.error ) {
                throw result.error;
            }
            // window.location.reload();

            account = await fetch( `${plushApiUrl}/accounts`, {
                headers: {
                    Twitch: ComfyTwitch.Token
                }
            } ).then( r => r.json() );
            $( ".user-coins" ).text( account.coins );
            populateItemList();
            toastr.success( `You got a code for ${items[ itemId ].name}!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
            Swal.fire( {
                title: result.code,
                html: `Ready! Here is your gift code for ${items[ itemId ].name}!<br/><br/>You can also gift it via this redeem link: <a href="https://www.pixelplush.dev/redeem.html?code=${result.code}">https://www.pixelplush.dev/redeem.html?code=${result.code}<a/>`,
                footer: `<strong>IMPORTANT:</strong> Save this code! It will disappear after you close this notification window.`,
                backdrop: `
                    rgba(0,0,123,0.4)
                `,
                // type: 'success',
                imageUrl: `${getItemPreview( itemId, 0 )}`,
                imageWidth: 48,
                imageHeight: 48,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonClass: 'btn btn-danger',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Okay, I saved it!',
                buttonsStyling: false,
            } );
        }
    }
    catch( err ) {
        // console.log( err );
        toastr.error( err, "Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
}

function showCoinBuy( coins, amount ) {
    orderAmount = coins;
    let bonusCoins = 0;
    if( coins >= 500 ) {
        bonusCoins = 125; // 25% more coins
    }
    else if( coins >= 100 ) {
        bonusCoins = 20; // 20% more coins
    }
    else if( coins >= 40 ) {
        bonusCoins = 6; // 15% more coins
    }
    else if( coins >= 20 ) {
        bonusCoins = 2; // 10% more coins
    }
    $("#coin-buy-amount").text( coins );
    if( bonusCoins > 0 ) {
        $("#coin-buy-text").text( `${coins} Plush Coins + ${bonusCoins} Bonus Coins for $${amount}! Exciting!` );
    }
    else {
        $("#coin-buy-text").text( `${coins} Plush Coins for $${amount}! Exciting!` );
    }
    $("#coin-buy").modal();
}

let transaction = {};
let orderAmount = 0;

paypal.Buttons({
    style: {
        layout: "horizontal",
        color: "blue",
        shape: "pill",
    },
    createOrder: async function( data, actions ) {
        transaction = await fetch( `${plushApiUrl}/paypal/request`, {
            method: "POST",
            headers: {
                Twitch: ComfyTwitch.Token
            },
            body: JSON.stringify( {
                coins: orderAmount
            })
        } ).then( r => r.json() );
        if( !transaction.success ) {
            console.log( transaction );
            toastr.error( "Sorry, there seems to be an error...", "Error", { positionClass:"toast-top-right", containerId:"toast-top-right" } );
            throw new Error( "Transaction Error" );
        }
        $("#coin-buy").modal("hide");
        return actions.order.create({
            purchase_units: [{
                "reference_id": transaction.transactionId,
                "custom_id": account.key,
                "description": `PixelPlush Coins Purchase`,
                "custom": account.key,
                "amount": {
                    "currency_code": "USD",
                    "value": transaction.usd,
                    "breakdown": {
                        "item_total": {
                            "value": transaction.usd,
                            "currency_code": "USD"
                        }
                    }
                },
                "items": [
                    {
                        "name": `Plush Coins`,
                        // "sku": "plushcoin",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": transaction.price
                        },
                        "quantity": transaction.coins,
                        "category": "DIGITAL_GOODS"
                    }
                ]
            }],
            "application_context": {
                "brand_name": "PixelPlush Games",
                "shipping_preference": "NO_SHIPPING"
            }
        });
    },
    onApprove: function(data, actions) {
        try {
            return actions.order.capture().then(async function(details) {
                toastr.info( `One moment while we get your Plush Coins...`, "Processing...", { positionClass:"toast-top-right", containerId:"toast-top-right" } );
                let item = transaction;
                let itemStatus = await fetch( `${plushApiUrl}/paypal/waiting`, {
                    method: "POST",
                    headers: {
                        Twitch: ComfyTwitch.Token
                    },
                    body: JSON.stringify( {
                        coins: orderAmount,
                        transaction: item.transactionId
                    })
                } ).then( r => r.json() );
                if( itemStatus.status !== "pending" ) {
                    console.log( "Status:", itemStatus.status );
                }
                let transactionTimer = setInterval( async () => {
                    let result = await fetch( `${plushApiUrl}/transactions/status?id=${item.transactionId}` ).then( r => r.json() );
                    if( result && result.status !== "pending" ) {
                        clearInterval( transactionTimer );
                        if( result.status === "complete" ) {
                            // TODO: thank you celebration!
                            let previousEggs = account.owned.filter( x => x.startsWith( "pet_egg_" ) );
                            let previousGiftboxes = account.owned.filter( x => x.startsWith( "pet_gift" ) );
                            account = await fetch( `${plushApiUrl}/accounts`, {
                                headers: {
                                    Twitch: ComfyTwitch.Token
                                }
                            } ).then( r => r.json() );
                            let newGiftboxes = account.owned.filter( x => x.startsWith( "pet_gift" ) && !previousGiftboxes.includes( x ) );
                            let newEggs = account.owned.filter( x => x.startsWith( "pet_egg_" ) && !previousEggs.includes( x ) );

                            $( ".user-coins" ).text( account.coins );
                            toastr.success( `Plush Coins added!`, "Success", { positionClass:"toast-top-right", containerId:"toast-top-right" } );
                            Swal.fire({
                                title: "Thank you for the purchase!",
                                text: `You now have ${account.coins} Plush Coins!`,
                                type: "success",
                                confirmButtonClass: 'btn btn-primary',
                                buttonsStyling: false,
                            }).then( function() {
                                if( newEggs.length > 0 ) {
                                    setTimeout( () => {
                                        Swal.fire({
                                            title: "PixelPlush Easter Egg Bonus!",
                                            text: `You also unlocked Pet ${newEggs.map( x => items[ x ].name).join( ", " )}!`,
                                            imageUrl: `${getItemPreview( newEggs[ 0 ], 0 )}`,
                                            imageWidth: 48,
                                            imageHeight: 48,
                                            animation: false,
                                            customClass: 'animated bounceIn',
                                            confirmButtonClass: 'btn btn-primary',
                                            buttonsStyling: false,
                                        });
                                    }, 500 );
                                }
                                else if( newGiftboxes.length > 0 ) {
                                    setTimeout( () => {
                                        Swal.fire({
                                            title: "PixelPlush Giftbox Bonus!",
                                            text: `You also unlocked Pet ${newGiftboxes.map( x => items[ x ].name).join( ", " )}!`,
                                            imageUrl: `${getItemPreview( newGiftboxes[ 0 ], 0 )}`,
                                            imageWidth: 48,
                                            imageHeight: 48,
                                            animation: false,
                                            customClass: 'animated bounceIn',
                                            confirmButtonClass: 'btn btn-primary',
                                            buttonsStyling: false,
                                        });
                                    }, 500 );
                                }
                            });
                        }
                        else {
                            // Error message window
                            toastr.error( "There was an error: " + result.error, "Error", { positionClass:"toast-top-right", containerId:"toast-top-right" } );
                        }
                    }
                    else {
                        toastr.warning( `Waiting for confirmation...`, "Processing...", { positionClass:"toast-top-right", containerId:"toast-top-right" } );
                    }
                }, 5000 );
            });
        }
        catch( e ) {
            console.log( "Error", e );
            toastr.error( "Sorry, there seems to be an error..." + e, "Error", { positionClass:"toast-top-right", containerId:"toast-top-right" } );
            throw new Error( "Transaction Error" );
        }
    },
    onError: function(data) {
        console.log( "Error", data );
        toastr.error( "Sorry, there seems to be an error..." + data, "Error", { positionClass:"toast-top-right", containerId:"toast-top-right" } );
        throw new Error( "Transaction Error" );
    }
}).render('#paypal-button-container');
