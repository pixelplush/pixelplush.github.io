const params = new URLSearchParams( location.search );
const clientId = "8m07ghhogjy0q09moeunnpdu51i60n";
const baseUrl = window.location.origin;
const plushApiUrl = "https://api.pixelplush.dev/v1"; //"http://localhost:3000/v1";
const plushScoreUrl = "https://stats.pixelplush.dev/v1"; //"http://localhost:3000/v1";
let twitch = {};
let account = {};

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

            $( ".logout" ).on( "click", function() {
                ComfyTwitch.Logout();
                window.location.reload();
            });

            if( !channelName ) {
                channelName = result.login;
            }
            $( "#inputChannelName" ).val( channelName );
            generateLink();
            getScores();
        }
        catch( error ) {
            // TODO: Auth Failed
            console.log( "Auth Validate Failed", error );
        }
    }
    else {
        $( ".not-logged-in" ).show();
        $( ".logged-in" ).hide();
        if( channelName ) {
            $( "#inputChannelName" ).val( channelName );
            generateLink();
            getScores();
        }
    }
});

const gameTypes = [ "parachute" ];
const gameThemes = [ "pixelparachuteall", "pixelparachutespring", "pixelparachuteeaster", "pixelparachuteday", "pixelparachutenight", "pixelparachuteretro", "pixelparachutepoolred", "pixelparachutepoolblue", "pixelparachuteautumn", "pixelparachutehalloween", "pixelparachutechristmas", "pixelparachutewinter" ];
const gameThemeNames = {
    "pixelparachuteall": "",
    "pixelparachutespring": "Pixel Parachute (Spring Blossoms)",
    "pixelparachuteeaster": "Pixel Parachute (Easter)",
    "pixelparachuteday": "Pixel Parachute (Day)",
    "pixelparachutenight": "Pixel Parachute (Night)",
    "pixelparachuteretro": "Pixel Parachute (Retro)",
    "pixelparachutepoolred": "Pixel Parachute (Pool Party, Red)",
    "pixelparachutepoolblue": "Pixel Parachute (Pool Party, Blue)",
    "pixelparachuteautumn": "Pixel Parachute (Autumn)",
    "pixelparachutehalloween": "Pixel Parachute (Halloween)",
    "pixelparachutechristmas": "Pixel Parachute (Christmas)",
    "pixelparachutewinter": "Pixel Parachute (Winter)"
}

let scoresTime = params.get( "time" ) || "1m";
const gameType = params.get( "game" ) || "parachute";
let gameTheme = params.get( "theme" ) || "pixelparachuteall";
let channelName = params.get( "channel" );
let scoresTable = null;
let channelRefreshTimer = null;

$( "#inputChannelName" ).on( "input", ( e ) => {
    // console.log( e, "input" );
    channelName = e.target.value;
    generateLink();
    if( channelRefreshTimer ) {
        clearTimeout( channelRefreshTimer );
    }
    channelRefreshTimer = setTimeout( () => {
        getScores();
    }, 2000 );
});
$( "#inputScoresTime" ).on( "change", ( e ) => {
    // console.log( e, "changed" );
    scoresTime = $( "#inputScoresTime" ).val();
    // setThemeDefaults();
    generateLink();
    getScores();
});
$( "#inputGameType" ).on( "change", ( e ) => {
    // console.log( e, "changed" );
    // setThemeDefaults();
    // getScores();
    generateLink();
});
$( "#inputGameTheme" ).on( "change", ( e ) => {
    // console.log( e, "changed" );
    gameTheme = gameThemes[ e.target.selectedIndex ];
    // setThemeDefaults();
    generateLink();
    getScores();
});

$( "#inputScoresTime" ).val( scoresTime );
$( "#inputGameType" ).val( gameType );
$( "#inputGameTheme" ).val( gameTheme );

const highscoreEndpoint = "scores/high";
function  generateLink() {
    let baseLink = `${baseUrl}/scores.html?`;
    let linkParams = [];
    linkParams.push( `channel=${channelName}` );
    linkParams.push( `time=${scoresTime}` );
    linkParams.push( `game=${gameType}` );
    linkParams.push( `theme=${gameTheme}` );
    $( "#outputScoresLink" ).val( baseLink + linkParams.join( "&" ) );
}
async function getScores() {
    let date = new Date();
    switch( scoresTime ) {
    case "12h":
        date.setTime( date.getTime() - 12 * 60 * 60 * 1000 );
        break;
    case "1w":
        date = new Date( date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() );
        // date.setTime( date.getTime() - ( 7 * 24 + date.getHours() ) * 60 * 60 * 1000 );
        break;
    case "1m":
        date = new Date( date.getFullYear(), date.getMonth(), 1 );
        break;
    }
    const timestamp = date.toISOString();
    const daystamp = timestamp.split( "T" )[ 0 ];
    const scoreUrl = gameThemeNames[ gameTheme ] ? `${plushScoreUrl}/${highscoreEndpoint}?channel=${channelName}&game=${gameType}&theme=${gameThemeNames[ gameTheme ]}&date=${daystamp}` : `${plushScoreUrl}/${highscoreEndpoint}?channel=${channelName}&game=${gameType}&date=${daystamp}`;
    const scores = await fetch( scoreUrl, {
        method: "GET"
    } )
    .then( r => r.json() );
    let uniqueIds = Array.from( new Set( scores.map( ( item ) => item.userId ) ) );
    let uniqueScores = uniqueIds.slice( 0, 100 ).map( id => scores.find( s => s.userId === id ) );
    // console.log( uniqueScores );

    if( scoresTable ) {
        scoresTable.clear().rows.add( scores ).draw();
    }
    else {
        scoresTable = $("#scores-list-datatable").DataTable({
            responsive: true,
            "data": scores,
            "columns": [
                { "data": "rank", render: function ( data, type, full, meta ) { return  meta.row + 1; } },
                { "data": "score" },
                { "data": "user" },
                { "data": "created", render: function( data, type ) { return moment( data ).format( "llll" ); } },
            ],
            "order": [
                [ 1, "desc" ]
            ],
        });
    }
}

$( document ).ready(function() {
    var clipboard = new ClipboardJS('.clipboard');
});