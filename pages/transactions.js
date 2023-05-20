const params = new URLSearchParams( location.search );
const clientId = "8m07ghhogjy0q09moeunnpdu51i60n";
const baseUrl = window.location.origin;
const plushApiUrl = "https://api.pixelplush.dev/v1"; //"http://localhost:3000/v1";
const plushScoreUrl = "https://stats.pixelplush.dev/v1"; //"http://localhost:3000/v1";
let twitch = {};
let account = {};
let catalog = {};
let items = {};
let transactions = [];

$( ".not-logged-in" ).show();
$( ".logged-in" ).hide();
$( ".additional-permissions" ).hide();

ComfyTwitch.SetAuthEndpoint( `${plushApiUrl}/auth/code` );
ComfyTwitch.SetRefreshEndpoint( `${plushApiUrl}/auth/refresh` );

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

            catalog = await fetch( "https://www.pixelplush.dev/assets/catalog.json", {
            }).then( r => r.json() );

            // console.log( catalog );

            catalog.forEach( x => {
                items[ x.id ] = x;
            });

            $( ".logout" ).on( "click", function() {
                ComfyTwitch.Logout();
                window.location.reload();
            });

            let receipts = await fetch( `${plushScoreUrl}/transactions/user`, {
                headers: {
                    Twitch: result.token
                }
            } ).then( r => r.json() );

            // console.log( receipts );

            let transactions = [];

            if( receipts.from ) {
                receipts.from.forEach( x => {
                    transactions.push({
                        date: x.createdAt,
                        note: `Item Redeem`,
                        description: `${items[ x.info.item ].name}`,
                        amount: `${-( x.amount || 0)}`,
                        status: x.status
                    });
                });
            }
            if( receipts.to ) {
                receipts.to.forEach( x => {
                    transactions.push({
                        date: x.createdAt,
                        note: `Coin Purchase`,
                        description: `${x.info.coins} Coins`,
                        amount: `+${x.amount || 0}`,
                        status: x.status
                    });
                });
            }

            // console.log( transactions );

            usersTable = $("#transactions-list-datatable").DataTable({
                responsive: true,
                "data": transactions,
                "columns": [
                    { "data": "date", render: function( data, type ) { return type === "sort" ? data : moment( data ).format( "llll" ); } },
                    { "data": "note" },
                    { "data": "description" },
                    { "data": "amount" },
                    { "data": "status", render: function( data, type ) {
                        return `<span class="badge badge-light-${data === "complete" ? "success" : "warning"}">${data}</span>`;
                    } },
                ],
                "order": [
                    [ 0, "desc" ]
                ],
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
});

$( document ).ready(function() {
});