const params = new URLSearchParams( location.search );
const clientId = "8m07ghhogjy0q09moeunnpdu51i60n";
const baseUrl = window.location.origin;
const plushApiUrl = "https://api.pixelplush.dev/v1"; //"http://localhost:3000/v1";
const plushScoreUrl = "https://stats.pixelplush.dev/v1"; //"http://localhost:3000/v1";
let twitch = {};
let account = {};
let catalog = {};
let items = {};

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

            // console.log( account );

            if( account.error ) {
                throw "Login Error";
            }

            $( ".not-logged-in" ).hide();
            $( ".logged-in" ).show();

            $( ".account-image" ).attr( "src", account.profileImage );
            $( ".user-name" ).text( account.displayName || account.username );
            $( ".user-coins" ).text( account.coins );

            $( ".logout" ).on( "click", function() {
                ComfyTwitch.Logout();
                window.location.reload();
            });
        }
        catch( error ) {
            // TODO: Auth Failed
            console.log( "Auth Validate Failed", error );
        }
    }
    else {
        $( ".not-logged-in" ).show();
        $( ".logged-in" ).hide();
    }

    catalog = await fetch( "https://www.pixelplush.dev/assets/catalog.json", {
    }).then( r => r.json() );

    // Don't filter in Redemption page
    // catalog = catalog.filter( x => !x.hidden );

    // console.log( catalog );

    catalog.forEach( x => {
        items[ x.id ] = x;
    });
});

$( document ).ready(function() {
    $("#coupon-code-form").keyup(function() {
        let foo = $(this).val().split("-").join(""); // remove hyphens
        console.log( foo );
        if( foo.startsWith( "PIXELPLUSH" ) ) {
            $(this).val(foo);
        }
        else {
            if( foo.length > 0 ) {
                foo = foo.match(new RegExp('.{1,4}', 'g')).join("-");
            }
            $(this).val(foo);
        }
    });

    if( params.get( "code" ) ) {
        let foo = params.get( "code" ).split("-").join(""); // remove hyphens
        console.log( foo );
        if( foo.startsWith( "PIXELPLUSH" ) ) {
            $("#coupon-code-form").val(foo);
        }
        else {
            if( foo.length > 0 ) {
                foo = foo.match(new RegExp('.{1,4}', 'g')).join("-");
            }
            $("#coupon-code-form").val(foo);
        }
    }
});

$( "#redeem-btn" ).on( "click", async ( ev ) => {
    let result = await fetch( `${plushApiUrl}/coupon/redeem?code=${$("#coupon-code-form").val()}`, {
        method: "POST",
        headers: {
            Twitch: ComfyTwitch.Token,
        }
    } ).then( r => r.json() );
    console.log( result );
    if( result.error ) {
        toastr.error( "There was an error: " + result.error, "Error", { positionClass:"toast-top-right", containerId:"toast-top-right" } );
    }
    else {
        account = await fetch( `${plushScoreUrl}/accounts`, {
            headers: {
                Twitch: ComfyTwitch.Token
            }
        } ).then( r => r.json() );
        $( ".user-coins" ).text( account.coins );
        toastr.success( `Code Redeemed!`, "Success", { positionClass:"toast-top-right", containerId:"toast-top-right" } );
        Swal.fire({
            title: "Coupon Code Redeemed!",
            text: result.coins ? `You got ${result.coins} Coins!` : `You unlocked ${items[ result.item ].name}!`,
            type: "success",
            confirmButtonClass: 'btn btn-primary',
            buttonsStyling: false,
        });

        if( !result.coins && !result.item.startsWith( "addon" ) && !result.item.startsWith( "bundle" ) ) {
            let confirm = await Swal.fire({
                title: `Use ${items[ result.item ].name}?`,
                text: `Would you like to set ${items[ result.item ].name} as your active ${items[ result.item ].type}?`,
                // type: 'success',
                imageUrl: `${getItemPreview( result.item, 0 )}`,
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
                await activateItem( result.item );
                toastr.success( `${items[ result.item ].name} is now selected!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
            }
        }
    }
});

async function activateItem( itemId ) {
    try {
        console.log( itemId );
        let result = await fetch( `${plushScoreUrl}/accounts/design`, {
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

        account = await fetch( `${plushScoreUrl}/accounts`, {
            headers: {
                Twitch: ComfyTwitch.Token
            }
        } ).then( r => r.json() );
        $( ".user-coins" ).text( account.coins );
        // toastr.success( `Set to ${items[ itemId ].name}!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
    catch( err ) {
        // console.log( err );
        toastr.error( err, "Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
}

function getItemPreview( itemId, frame ) {
    let item = items[ itemId ];
    if( item.theme === "None" ) { return ""; }
    let dir = "";
    switch( item.type ) {
        case "pet":
            dir = `pets/${item.path}`;
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
