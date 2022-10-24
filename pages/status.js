const params = new URLSearchParams( location.search );
const clientId = "8m07ghhogjy0q09moeunnpdu51i60n";
const baseUrl = window.location.origin;
const plushApiUrl = "https://api.pixelplush.dev/v1"; //"http://localhost:3000/v1";
let twitch = {};
let account = {};

$( ".not-logged-in" ).show();
$( ".logged-in" ).hide();

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
});

(async () => {
    const result = await fetch( "https://api.pixelplush.dev/v1/status" ).then( r => r.json() );
    console.log( result );
    document.getElementById( "status_api" ).innerText = result.status;
    document.getElementById( "status_db" ).innerText = result.db;
})();