const params = new URLSearchParams( location.search );
const clientId = "8m07ghhogjy0q09moeunnpdu51i60n";
const baseUrl = window.location.origin;
const plushApiUrl = "https://api.pixelplush.dev/v1"; //"http://localhost:3000/v1";
let twitch = {};
let account = {};
let catalog = {};
let items = {};
let hasRestoredSettings = false;

$( ".not-logged-in" ).show();
$( ".logged-in" ).hide();
$( ".additional-permissions" ).hide();
$( ".addon-required" ).hide();

$( "#inputParachuteRefresh" ).TouchSpin({
    min: 60,
    max: 3600,
    step: 30,
});
$( "#inputParachuteGameReady" ).TouchSpin({
    min: 0,
    max: 3600,
    step: 30,
});
$( "#inputParachuteRaidDrop" ).TouchSpin({
    min: 0,
    max: 3600,
    step: 10,
});
$( "#inputParachuteCPDrop" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputParachuteCPDroplets" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputParachuteCPQueue" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputPlinkoCPPlink" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputPlinkoCPQueue" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputPlinkoRefresh" ).TouchSpin({
    min: 60,
    max: 3600,
    step: 30,
});
$( "#inputPlinkoGameReady" ).TouchSpin({
    min: 0,
    max: 3600,
    step: 30,
});
$( "#inputConfettiParty" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputConfettiPartyIntensity" ).TouchSpin({
    min: 50,
    max: 10000,
    step: 10,
});
$( "#inputConfettiBubbles" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputConfettiBubblesIntensity" ).TouchSpin({
    min: 50,
    max: 10000,
    step: 10,
});
$( "#inputConfettiBalloons" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputConfettiBalloonsIntensity" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});
$( "#inputConfettiHearts" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputConfettiHeartsIntensity" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});
$( "#inputHillRollDefaultCountdown" ).TouchSpin({
    min: 0,
    max: 600,
    step: 10,
});
$( "#inputHillRollRefresh" ).TouchSpin({
    min: 60,
    max: 3600,
    step: 30,
});

// Weathers
$( "#inputWeatherRain" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherRainTime" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});
$( "#inputWeatherHeavyRain" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherHeavyRainTime" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});
$( "#inputWeatherLightning" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherRainbow" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherSunshine" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherBlossoms" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherBlossomsTime" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});
$( "#inputWeatherSnow" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherSnowTime" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});
$( "#inputWeatherBlizzard" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherBlizzardTime" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});
$( "#inputWeatherHail" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherHailTime" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});
$( "#inputWeatherLeaf" ).TouchSpin({
    min: 0,
    max: 100000,
    step: 10,
});
$( "#inputWeatherLeafTime" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});

$( "#inputFlakesNth" ).TouchSpin({
    min: 1,
    max: 1000,
    step: 1,
});
$( "#inputFlakesNum" ).TouchSpin({
    min: 1,
    max: 100,
    step: 1,
});
$( "#inputFlakesTimer" ).TouchSpin({
    min: 0,
    max: 1000000,
    step: 100,
});

function restoreSettings() {
    // Try restoring the selected game settings
    const selectedSettings = JSON.parse( localStorage.getItem( "twitchInputSettings" ) || "{}" );
    Object.keys( selectedSettings ).forEach( elem => {
        if( ignoreInputs.includes( elem ) ) { return; }
        // const e = $( "#" + elem );
        // if( e.disabled ) { console.log( "disabled", e ); }
        // console.log( elem, selectedSettings[ elem ] );
        switch( selectedSettings[ elem ].type ) {
            case "checkbox":
                $( "#" + elem ).prop( "checked", selectedSettings[ elem ].checked );
                break;
            default:
                $( "#" + elem ).val( selectedSettings[ elem ].value );
                break;
        }
        // Trigger the change event to set vars
        try {
            $( "#" + elem ).trigger( "change" );
        }
        catch( err ) {
            // console.warn( err );
        }
        // if( elem.startsWith( "inputEnableConfetti" ) ) {
        //     confettiColors[ elem.replace( "inputEnableConfetti", "" ).toLowerCase() ] = selectedSettings[ elem ].checked;
        // }
        // if( elem.startsWith( "inputEnableConfetti" ) ) {
        //     confettiColors[ elem.replace( "inputEnableConfetti", "" ).toLowerCase() ] = selectedSettings[ elem ].checked;
        // }
    });
}

function saveSettings() {
    // Try saving selected game settings
    const elems = $( "[id^='input']" ).toArray().filter( e => !ignoreInputs.includes( e.id ) );
    let savedSettings = {};
    elems.forEach( e => {
        if( !e.disabled ) {
            savedSettings[ e.id ] = {
                type: e.type,
                checked: e.checked,
                value: e.value
            };
        }
    });
    // console.log( savedSettings );
    localStorage.setItem( "twitchInputSettings", JSON.stringify( savedSettings ) );
}

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

            if( account.error ) {
                throw "Login Error";
            }

            $( ".not-logged-in" ).hide();
            $( ".logged-in" ).show();

            $( ".account-image" ).attr( "src", account.profileImage );
            $( ".user-name" ).text( account.displayName || account.username );
            $( ".user-coins" ).text( account.coins );

            $( "#inputChannelName" ).val( result.login );
            $( "#inputChannelName" ).prop( "readonly", true );
            $( "#inputMessageFormat" ).prop( "disabled", false );
            $( "#inputEnableChat" ).prop( "disabled", false );
            $( "#inputEnableParachuteChat" ).prop( "disabled", false );
            $( "#inputEnableParachuteDroplets" ).prop( "disabled", false );
            $( "#inputEnablePlinkoChat" ).prop( "disabled", false );
            $( "#inputEnableHillRollChat" ).prop( "disabled", false );
            $( "#inputEnableHillRollInstructions" ).prop( "disabled", false );
            $( "#inputEnableHillRollTimer" ).prop( "disabled", false );
            $( "#inputEnableGiveawayChat" ).prop( "disabled", false );
            $( "#inputMessageFormatDisabled" ).hide();
            $( "#inputChatOAuth" ).val( `oauth:${result.token}` );
            channelName = result.login;
            chatOAuth = `oauth:${result.token}`;
            // generateLink();

            if( ![ "user:read:email", "chat:read", "chat:edit", "channel:manage:redemptions", "channel:read:redemptions" ].every( v => ComfyTwitch.Scopes.includes( v ) ) ) {
                console.log( "Need More Permissions" );
                $( ".additional-permissions" ).show();
                $( "#inputEnableChat" ).prop( "disabled", true );
                $( "#inputEnableParachuteChat" ).prop( "disabled", true );
                $( "#inputEnablePlinkoChat" ).prop( "disabled", true );
                $( "#inputEnableHillRollChat" ).prop( "disabled", true );
                $( "#inputEnableGiveawayChat" ).prop( "disabled", true );
                $( "#inputMessageFormatDisabled" ).show();
            }

            $( ".logout" ).on( "click", function() {
                ComfyTwitch.Logout();
                window.location.reload();
            });

            setThemeDefaults();
            restoreSettings();
            generateLink();
            hasRestoredSettings = true;
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

    let currentChannel = "";
    let featureStream = async () => {
        let livestreams = await fetch( "https://api.pixelplush.dev/v1/analytics/sessions/live/short" )
        .then( r => r.json() );
        let nextChannel = "pixelplushgames";
        if( livestreams.length > 0 ) {
            // Set Twitch embed channel
            if( livestreams.includes( "maaya" ) && livestreams.includes( "instafluff" ) ) {
                nextChannel = Math.random() < 0.5 ? "maaya" : "instafluff";
                $("#featured-stream").attr( "src", `https://player.twitch.tv/?channel=${nextChannel}&parent=www.pixelplush.dev` );
            }
            else if( livestreams.includes( "maaya" ) ) {
                nextChannel = "maaya";
                $("#featured-stream").attr( "src", "https://player.twitch.tv/?channel=maaya&parent=www.pixelplush.dev" );
            }
            else if( livestreams.includes( "instafluff" ) ) {
                nextChannel = "instafluff";
                $("#featured-stream").attr( "src", "https://player.twitch.tv/?channel=instafluff&parent=www.pixelplush.dev" );
            }
            else {
                nextChannel = livestreams[ Math.floor( livestreams.length * Math.random() ) ];
            }
        }
        else {
            nextChannel = "pixelplushgames";
        }
        if( nextChannel != currentChannel ) {
            currentChannel = nextChannel;
            $("#featured-stream").attr( "src", `https://player.twitch.tv/?channel=${currentChannel}&parent=www.pixelplush.dev` );
        }
    };
    setInterval( featureStream, 60000 * 3 );
    featureStream();

    setThemeDefaults();
    restoreSettings();
    generateLink();

    $( ".additional-permissions" ).on( "click", function() {
        ComfyTwitch.Logout();
        localStorage.setItem( "redirectPage", window.location.href );
        ComfyTwitch.Login( clientId, `${baseUrl}/redirect.html`, [ "user:read:email", "chat:read", "chat:edit", "channel:manage:redemptions", "channel:read:redemptions" ] );
    });
});

$( "#link-showhide" ).on( "click", function() {
    if( document.getElementById( "outputOverlayLink" ).type === "password" ) {
        document.getElementById( "outputOverlayLink" ).type = "text";
    }
    else {
        document.getElementById( "outputOverlayLink" ).type = "password";
    }
});

const gameTypes = [ "giveaway", "chatflakes", "confetti", "weather", "hillroll", "maze", "parachute", "plinko" ];
const themeSettings = {
    "giveaway": {
        game: "giveaway",
        name: "Default Theme",
        page: "https://www.pixelplush.dev/giveaway/index.html",
        preview: "/public/app-assets/images/games/giveaway_basic.gif",
        messageFormat: " ",
        // requires: "addon_giveaway",
    },
    // "giveawayhue": {
    //     game: "giveaway",
    //     name: "Custom Color Giveaway (Premium)",
    //     page: "https://www.pixelplush.dev/giveaway/index.html",
    //     preview: "/public/app-assets/images/games/giveaway_basic.gif",
    //     messageFormat: " ",
    //     // requires: "addon_giveaway_hue",
    // },
    "giveawayblossoms": {
        game: "giveaway",
        name: "Blossoms Giveaway (Premium)",
        page: "https://www.pixelplush.dev/giveaway/blossoms.html",
        preview: "/public/app-assets/images/games/giveaway_blossoms.gif",
        messageFormat: " ",
        requires: "addon_giveaway_blossoms",
    },
    "pixelparachutescakes" : {
        game: "parachute",
        name: "Party Cakes (Premium)",
        page: "https://www.pixelplush.dev/parachute/cake_rainbow.html",
        extras: {
            "cake_rainbow": {
                name: "cake_rainbow.html",
                page: "https://www.pixelplush.dev/parachute/cake_rainbow.html",
                preview: "/public/app-assets/images/games/drop_cake_rainbow_website.gif",
                requires: "addon_parachute_cakerainbow",
            },
            "cake_fruit": {
                name: "cake_fruit.html",
                page: "https://www.pixelplush.dev/parachute/cake_fruit.html",
                preview: "/public/app-assets/images/games/drop_cake_fruit_website.gif",
                requires: "addon_parachute_cakefruit",
            },
            "cake_choco": {
                name: "cake_choco.html",
                page: "https://www.pixelplush.dev/parachute/cake_choco.html",
                preview: "/public/app-assets/images/games/drop_cake_choco_website.gif",
                requires: "addon_parachute_cakechoco",
            },
            "cake_pixelplush": {
                name: "cake_pixelplush.html",
                page: "https://www.pixelplush.dev/parachute/cake_pixelplush.html",
                preview: "/public/app-assets/images/games/drop_cake_pp_website.gif",
                requires: "addon_parachute_cakeplush",
            },
        },
        preview: "/public/app-assets/images/games/drop_cake_rainbow_website.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
        bundle: "bundle_parachute_cake",
    },
    "pixelparachutesplashpool" : {
        game: "parachute",
        name: "Pool Party Splash (Free + Premium)",
        page: "https://www.pixelplush.dev/parachute/pool_splash_frog.html",
        extras: {
            "red": {
                name: "pool_splash_red.html",
                page: "https://www.pixelplush.dev/parachute/pool_splash_red.html",
                preview: "/public/app-assets/images/games/pool_red.gif",
            },
            "blue": {
                name: "pool_splash_blue.html",
                page: "https://www.pixelplush.dev/parachute/pool_splash_blue.html",
                preview: "/public/app-assets/images/games/pool_blue.gif",
            },
            "frog": {
                name: "pool_splash_frog.html",
                page: "https://www.pixelplush.dev/parachute/pool_splash_frog.html",
                preview: "/public/app-assets/images/games/pool_frog.gif",
                requires: "addon_parachute_poolfrog",
            },
            "watermelon": {
                name: "pool_splash_watermelon.html",
                page: "https://www.pixelplush.dev/parachute/pool_splash_watermelon.html",
                preview: "/public/app-assets/images/games/pool_melon.gif",
                requires: "addon_parachute_poolmelon",
            },
            "rainbow": {
                name: "pool_splash_rainbow.html",
                page: "https://www.pixelplush.dev/parachute/pool_splash_rainbow.html",
                preview: "/public/app-assets/images/games/pool_rainbow.gif",
                requires: "addon_parachute_poolrainbow",
            },
            "dots": {
                name: "pool_splash_dots.html",
                page: "https://www.pixelplush.dev/parachute/pool_splash_dots.html",
                preview: "/public/app-assets/images/games/pool_dots.gif",
                requires: "addon_parachute_pooldots",
            },
            "pink": {
                name: "pool_splash_pink.html",
                page: "https://www.pixelplush.dev/parachute/pool_splash_pink.html",
                preview: "/public/app-assets/images/games/pool_pink.gif",
                requires: "addon_parachute_poolsparklypink",
            },
            "purple": {
                name: "pool_splash_purple.html",
                page: "https://www.pixelplush.dev/parachute/pool_splash_purple.html",
                preview: "/public/app-assets/images/games/pool_purple.gif",
                requires: "addon_parachute_poolsparklypurple",
            },
            "yellow": {
                name: "pool_splash_yellow.html",
                page: "https://www.pixelplush.dev/parachute/pool_splash_yellow.html",
                preview: "/public/app-assets/images/games/pool_yellow.gif",
                requires: "addon_parachute_poolyellow",
            },
        },
        preview: "/public/app-assets/images/games/drop_pool_frog.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
        bundle: "bundle_parachute_pool",
    },
    "pixelparachuteeasterpremium" : {
        game: "parachute",
        name: "Easter Extra (Premium)",
        page: "https://www.pixelplush.dev/parachute/easter_candy.html",
        extras: {
            "easter_1": {
                name: "easter_candy.html",
                page: "https://www.pixelplush.dev/parachute/easter_candy.html",
                preview: "/public/app-assets/images/games/drop_easter_1.gif",
            },
            "easter_2": {
                name: "easter_choco.html",
                page: "https://www.pixelplush.dev/parachute/easter_choco.html",
                preview: "/public/app-assets/images/games/drop_easter_2.gif",
            },
            "easter_3": {
                name: "easter_sweets.html",
                page: "https://www.pixelplush.dev/parachute/easter_sweets.html",
                preview: "/public/app-assets/images/games/drop_easter_3.gif",
            },
            "easter_4": {
                name: "easter_marshmallow.html",
                page: "https://www.pixelplush.dev/parachute/easter_marshmallow.html",
                preview: "/public/app-assets/images/games/drop_easter_4.gif",
            },
            "easter_5": {
                name: "easter_cotton.html",
                page: "https://www.pixelplush.dev/parachute/easter_cotton.html",
                preview: "/public/app-assets/images/games/drop_easter_5.gif",
            },
        },
        preview: "/public/app-assets/images/games/drop_easter_1.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
        requires: "addon_parachute_easter",
    },
    "pixelparachutevalentines" : {
        game: "parachute",
        name: "Valentines (Premium)",
        page: "https://www.pixelplush.dev/parachute/valentines_brown_gold.html",
        extras: {
            "brown_gold": {
                name: "valentines_brown_gold.html",
                page: "https://www.pixelplush.dev/parachute/valentines_brown_gold.html",
                preview: "/public/app-assets/images/games/valentines_brown_gold.gif",
            },
            "brown_pink": {
                name: "valentines_brown_pink.html",
                page: "https://www.pixelplush.dev/parachute/valentines_brown_pink.html",
                preview: "/public/app-assets/images/games/valentines_brown_pink.gif",
            },
            "brown_red": {
                name: "valentines_brown_red.html",
                page: "https://www.pixelplush.dev/parachute/valentines_brown_red.html",
                preview: "/public/app-assets/images/games/valentines_brown_red.gif",
            },
            "white_gold": {
                name: "valentines_white_gold.html",
                page: "https://www.pixelplush.dev/parachute/valentines_white_gold.html",
                preview: "/public/app-assets/images/games/valentines_white_gold.gif",
            },
            "white_pink": {
                name: "valentines_white_pink.html",
                page: "https://www.pixelplush.dev/parachute/valentines_white_pink.html",
                preview: "/public/app-assets/images/games/valentines_white_pink.gif",
            },
            "white_red": {
                name: "valentines_white_red.html",
                page: "https://www.pixelplush.dev/parachute/valentines_white_red.html",
                preview: "/public/app-assets/images/games/valentines_white_red.gif",
            },
        },
        preview: "/public/app-assets/images/games/valentines_white_red.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
        requires: "addon_parachute_valentines",
    },
    "chatflakes": {
        game: "chatflakes",
        name: "Chat Flakes (Premium)",
        page: "https://www.pixelplush.dev/flakes/index.html",
        preview: "/public/app-assets/images/games/chatflakes.gif",
        messageFormat: " ",
        requires: "addon_chatflakes",
    },
    "weather": {
        game: "weather",
        name: "Stream Weather (Premium)",
        page: "https://www.pixelplush.dev/weather/index.html",
        preview: "/public/app-assets/images/games/streamweather_square.gif",
        messageFormat: " ",
        requires: "addon_streamweather",
    },
    "springspree": {
        game: "maze",
        name: "Spring Spree (Spring)",
        page: "https://www.pixelplush.dev/maze/spring.html",
        preview: "/public/app-assets/images/games/springspree.gif",
        bosses: 0,
        trapEffect: 1,
        prizes: 7,
        traps: 5,
        messageFormat: "USERNAME finished with POINTS!",
    },
    "santasecretservice": {
        game: "maze",
        name: "Santa's Secret Service (Christmas)",
        page: "https://www.pixelplush.dev/maze/christmas.html",
        preview: "/public/app-assets/images/games/maze_christmas_gif.gif",
        bosses: 1,
        prizes: 7,
        traps: 5,
        messageFormat: "USERNAME finished with POINTS!",
    },
    "frozenfrenzy": {
        game: "maze",
        name: "Frozen Frenzy (Winter)",
        page: "https://www.pixelplush.dev/maze/frozen.html",
        preview: "/public/app-assets/images/games/maze_winter_gif.gif",
        bosses: 1,
        prizes: 7,
        traps: 5,
        messageFormat: "USERNAME finished with POINTS!",
    },
    "autumnadventure": {
        game: "maze",
        name: "Autumn Adventure",
        page: "https://www.pixelplush.dev/maze/autumn.html",
        preview: "/public/app-assets/images/games/maze_autumn_gif.gif",
        bosses: 0,
        trapEffect: 1,
        prizes: 7,
        traps: 5,
        messageFormat: "USERNAME finished with POINTS!",
    },
    "trickortreat": {
        game: "maze",
        name: "Trick or Treat (Halloween)",
        page: "https://www.pixelplush.dev/maze/ghost.html",
        preview: "/public/app-assets/images/games/trickortreat.gif",
        bosses: 1,
        prizes: 7,
        traps: 5,
        messageFormat: "USERNAME finished with POINTS!",
    },
    "cupidheartcollection": {
        game: "maze",
        name: "Cupid Heart Collection (Valentines)",
        page: "https://www.pixelplush.dev/maze/cupid.html",
        preview: "/public/app-assets/images/games/cupidheartcollection.gif",
        bosses: 3,
        effect: 1,
        prizes: 220 - 6,
        traps: 0,
        lockItemCount: true,
        messageFormat: "USERNAME finished with POINTS!",
    },
    "easteregghunt": {
        game: "maze",
        name: "Easter Egg Hunt (Easter)",
        page: "https://www.pixelplush.dev/maze/easter.html",
        preview: "/public/app-assets/images/games/easteregghunt.gif",
        bosses: 0,
        trapEffect: 1,
        prizes: 7,
        traps: 5,
        messageFormat: "USERNAME finished with POINTS!",
    },
    "fairyforest": {
        game: "maze",
        name: "Fairy Forest",
        page: "https://www.pixelplush.dev/maze/fairy.html",
        preview: "/public/app-assets/images/games/fairyforest.gif",
        bosses: 0,
        trapEffect: 1,
        prizes: 7,
        traps: 5,
        messageFormat: "USERNAME finished with POINTS!",
    },
    "wanderingwizards": {
        game: "maze",
        name: "Wandering Wizards",
        page: "https://www.pixelplush.dev/maze/index.html",
        preview: "/public/app-assets/images/games/wanderingwizards.gif",
        bosses: 1,
        prizes: 7,
        traps: 5,
        messageFormat: "USERNAME finished with POINTS!",
    },
    "pixelparachutechristmaseve": {
        game: "parachute",
        name: "Christmas Eve (Premium)",
        page: "https://www.pixelplush.dev/parachute/christmas_eve.html",
        preview: "/public/app-assets/images/games/drop_christmas_eve.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
        requires: "addon_parachute_christmaseve"
    },
    "pixelparachutecauldron" : {
        game: "parachute",
        name: "Cauldron (Premium)",
        page: "https://www.pixelplush.dev/parachute/cauldron_colors.html",
        extras: {
            "rainbow": {
                name: "cauldron_colors.html",
                page: "https://www.pixelplush.dev/parachute/cauldron_colors.html",
                preview: "/public/app-assets/images/games/drop_cauldron_rainbow_website.gif",
            },
            "red": {
                name: "cauldron_red.html",
                page: "https://www.pixelplush.dev/parachute/cauldron_red.html",
                preview: "/public/app-assets/images/games/drop_cauldron_red_website.gif",
            },
            "pink": {
                name: "cauldron_pink.html",
                page: "https://www.pixelplush.dev/parachute/cauldron_pink.html",
                preview: "/public/app-assets/images/games/drop_cauldron_pink_website.gif",
            },
            "orange": {
                name: "cauldron_orange.html",
                page: "https://www.pixelplush.dev/parachute/cauldron_orange.html",
                preview: "/public/app-assets/images/games/drop_cauldron_orange_website.gif",
            },
            "yellow": {
                name: "cauldron_yellow.html",
                page: "https://www.pixelplush.dev/parachute/cauldron_yellow.html",
                preview: "/public/app-assets/images/games/drop_cauldron_yellow_website.gif",
            },
            "green": {
                name: "cauldron_green.html",
                page: "https://www.pixelplush.dev/parachute/cauldron_green.html",
                preview: "/public/app-assets/images/games/drop_cauldron_green_website.gif",
            },
            "blue": {
                name: "cauldron_blue.html",
                page: "https://www.pixelplush.dev/parachute/cauldron_blue.html",
                preview: "/public/app-assets/images/games/drop_cauldron_blue_website.gif",
            },
            "purple": {
                name: "cauldron_purple.html",
                page: "https://www.pixelplush.dev/parachute/cauldron_purple.html",
                preview: "/public/app-assets/images/games/drop_cauldron_purple_website.gif",
            },
        },
        preview: "/public/app-assets/images/games/drop_cauldron_rainbow_website.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
        requires: "addon_parachute_cauldron",
    },
    "pixelparachuterainbow" : {
        game: "parachute",
        name: "Rainbow (Premium)",
        page: "https://www.pixelplush.dev/parachute/pride.html",
        preview: "/public/app-assets/images/games/pixelparachuterainbow.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
        requires: "addon_parachute_rainbow",
    },
    "pixelparachutespring" : {
        game: "parachute",
        name: "Spring Blossoms (Premium)",
        page: "https://www.pixelplush.dev/parachute/spring.html",
        preview: "/public/app-assets/images/games/pixelparachutespring.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
        requires: "addon_parachute_blossoms",
    },
    "pixelparachuteeaster" : {
        game: "parachute",
        name: "Easter",
        page: "https://www.pixelplush.dev/parachute/easter.html",
        preview: "/public/app-assets/images/games/drop_easter_main.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
    },
    "pixelparachutewinter" : {
        game: "parachute",
        name: "Winter",
        page: "https://www.pixelplush.dev/parachute/winter.html",
        preview: "/public/app-assets/images/games/pixelparachutewinter.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
    },
    "pixelparachutechristmas": {
        game: "parachute",
        name: "Christmas",
        page: "https://www.pixelplush.dev/parachute/christmas.html",
        preview: "/public/app-assets/images/games/pixelparachutechristmas.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
    },
    "pixelparachuteautumn": {
        game: "parachute",
        name: "Autumn",
        page: "https://www.pixelplush.dev/parachute/autumn.html",
        preview: "/public/app-assets/images/games/drop_autumn_website.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
    },
    "pixelparachutehalloween": {
        game: "parachute",
        name: "Halloween",
        page: "https://www.pixelplush.dev/parachute/halloween.html",
        preview: "/public/app-assets/images/games/pixelparachutehalloween.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
    },
    "pixelparachuteretro": {
        game: "parachute",
        name: "Retro",
        page: "https://www.pixelplush.dev/parachute/retro.html",
        preview: "/public/app-assets/images/games/pixelparachuteretro.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
    },
    "pixelparachuteday": {
        game: "parachute",
        name: "Day",
        page: "https://www.pixelplush.dev/parachute/",
        preview: "/public/app-assets/images/games/pixelparachuteday.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
    },
    "pixelparachutenight": {
        game: "parachute",
        name: "Night",
        page: "https://www.pixelplush.dev/parachute/night.html",
        preview: "/public/app-assets/images/games/pixelparachutenight.gif",
        overlay: true,
        clouds: false,
        hideTilDrop: true,
        messageFormat: "USERNAME landed for POINTS!",
        command: "",
    },
    "pixelplinkohalloween": {
        game: "plinko",
        name: "Halloween",
        page: "https://www.pixelplush.dev/plinko/halloween.html",
        preview: "/public/app-assets/images/games/pixelplinkohalloween.gif",
        overlay: true,
        clouds: false,
        hideTilStart: true,
        messageFormat: "USERNAME is a winner!",
        requires: "addon_plinko_halloween",
    },
    "pixelplinko": {
        game: "plinko",
        name: "Day",
        page: "https://www.pixelplush.dev/plinko/",
        preview: "/public/app-assets/images/games/plinko_day_website.gif",
        overlay: true,
        clouds: false,
        hideTilStart: true,
        messageFormat: "USERNAME is a winner!",
    },
    "pixelplinkochristmas": {
        game: "plinko",
        name: "Christmas",
        page: "https://www.pixelplush.dev/plinko/christmas.html",
        preview: "/public/app-assets/images/games/plinko_christmas_website.gif",
        overlay: true,
        clouds: false,
        hideTilStart: true,
        messageFormat: "USERNAME is a winner!",
    },
    "pixelhillrollchristmas": {
        game: "hillroll",
        name: "Christmas",
        page: "https://www.pixelplush.dev/hillroll/christmas.html",
        preview: "/public/app-assets/images/games/hill_christmas_gif.gif",
        overlay: false,
        clouds: true,
        hideTilRoll: false,
        hideInstructions: false,
        hideTime: false,
        defaultCountdown: 0,
        messageFormat: "USERNAME finished RANK in TIME!",
        command: "",
    },
    "confetti": {
        game: "confetti",
        name: "Confetti",
        page: "https://www.pixelplush.dev/confetti/",
        preview: "/public/app-assets/images/games/pixelconfetti_square.gif",
        messageFormat: "",
        requires: "addon_pixelconfetti",
    },
};
const gameInstructions = {
    "giveaway": `Host a giveaway for your viewers right within your stream!
<pre>Example Commands:
- Start a 5-min giveaway: !giv start 5m Super Awesome Prize
- Start a 30-sec giveaway: !giv start 30s Quick Everyone Enter!
- Start a No-Time giveaway: !giv start Long Giveaway
- Viewers can enter with: !join
- Manually Pick a Winner: !giv pick
- Change the time limit to 1-min: !giv time 1m
- Winner can claim the prize with: !win
- Hide/Reset the giveaway: !giv reset</pre>`,
    "chatflakes": "Bring some subtle chat interaction into your stream! Turn chat messages into stream particles such as leaves, snowflaks, raindrops, and more!",
    "confetti": "One of our <a href='https://devpost.com/software/pixel-confetti' target='_blank'>Twitch Hackathon Entries</a>! Set the channel points cost of the confetti redemption to get a browser source overlay link. Setting the cost to 0 will disable the confetti. Channel rewards will be automatically added for you in your channel. Use <strong>!resetconfetti</strong> to refresh the rewards or <strong>!deleteconfetti</strong> to delete them. You can update the cost and cooldown of the redemptions on Twitch after they have been created.",
    "weather": "Our <a href='https://devpost.com/software/stream-weather' target='_blank'>Prize-Winning Twitch Overlay</a>! Set the channel points cost of each type of weather redemption to get a browser source overlay link. Setting the cost to 0 will disable that weather type. Channel rewards will be automatically added for you in your channel. Use <strong>!resetweather</strong> to refresh the rewards or <strong>!deleteweather</strong> to delete them. You can update the cost and cooldown of the redemptions on Twitch after they have been created.",
    "hillroll": "Type <strong>!hill</strong> or your custom command into your channel chat to roll your character down the hill! Mods can use <strong>!resethill</strong> to restart the game or <strong>!queuehill</strong> and then <strong>!starthill [time in sec]</strong> to start a race. A default countdown time will always queue up races.",
    "maze": "Type <strong>!play</strong> into your channel chat to spawn your character and then you can type grid coordinates to pick up items (e.g. G6) or <strong>!wander</strong> to let your character randomly walk around the map and <strong>!unwander</strong> to stop. Type <strong>!end</strong> to finish the game and show the leaderboard or <strong>!reset</strong> to restart the maze.",
    "parachute": "Drop your character and try to land on the center of the target! Set channel points cost to automatically create a drop redemption or type !drop or your custom command into your channel chat. Mods can use <strong>!resetdrop</strong> to restart the game or <strong>!queuedrop</strong> and then <strong>!startdrop</strong> to allow everyone to join the game and drop at the same time. Score commands are <strong>!droptop !droprecent !drophigh !droplow.</strong>",
    "plinko": "Type <strong>!plinko</strong> into your channel chat to drop your character to try and land in the center column. Mods can use <strong>!resetplinko</strong> to restart the game or <strong>!queueplinko</strong> and then <strong>!startplinko</strong> to allow everyone to join the game and fall at the same time.",
};
const bossEffects = [ "steal", "base" ];
const trapEffects = [ "points", "tunnel" ];
let gameType = params.get( "type" ) || "parachute";
let gameTheme = params.get( "game" ) || "parachute";
let channelName = "";
let isBossEnabled = true;
let isChatEnabled = false;
let isCommandEnabled = true;
let isDropletsEnabled = true;
let hideInstructions = false;
let hideTimer = false;
let chatOAuth = "";
let messageFormat = "USERNAME finished with POINTS!";
let bossEffect = bossEffects[ 0 ];
let trapEffect = trapEffects[ 0 ];
let bossCount = "1";
let prizeCount = "7";
let trapCount = "5";
let isParachuteChatEnabled = false;
let isParachuteOverlay = true;
let isParachuteCloudsOn = false;
let isParachuteHideTilDrop = false;
let parachuteVolume = "25";
let parachuteRefresh = "90";
let parachuteGameReady = "0";
let parachuteRaidDrop = "0";
let parachuteCommand = "";
let parachuteCPDrop = "0";
let parachuteCPDroplets = "0";
let parachuteCPQueue = "0";
let parachuteNotifVolume = "25";
let isPlinkoChatEnabled = false;
let isPlinkoOverlay = true;
let isPlinkoCloudsOn = false;
let isPlinkoHideTilStart = false;
let plinkoVolume = "25";
let plinkoCommand = "";
let plinkoCPPlink = "0";
let plinkoCPQueue = "0";
let plinkoRefresh = "90";
let plinkoGameReady = "0";
let plinkoNotifVolume = "25";
let isHillRollChatEnabled = false;
let isHillRollOverlay = true;
let isHillRollCloudsOn = true;
let isHillRollHideTilRoll = false;
let hillRollDefaultCountdown = "0";
let hillRollVolume = "25";
let hillRollRefresh = "90";
let hillRollCommand = "";
let weatherRain = "100";
let weatherRainTime = "5";
let weatherHeavyRain = "100";
let weatherHeavyRainTime = "5";
let weatherLightning = "100";
let weatherRainbow = "100";
let weatherSunshine = "100";
let weatherBlossoms = "100";
let weatherBlossomsTime = "5";
let weatherSnow = "100";
let weatherSnowTime = "5";
let weatherBlizzard = "100";
let weatherBlizzardTime = "5";
let weatherHail = "100";
let weatherHailTime = "5";
let weatherLeaf = "100";
let weatherLeafTime = "5";
let weatherVolume = "25";
let confettiParty = "100";
let confettiIntensity = "300";
let confettiBubbles = "100";
let confettiHearts = "100";
let bubblesIntensity = "300";
let confettiBalloons = "100";
let balloonsIntensity = "20";
let heartsIntensity = "20";
let confettiVolume = "25";
let confettiColors = {
    "red": true,
    "pastelred": true,
    "orange": true,
    "pastelorange": true,
    "yellow": true,
    "darkyellow": true,
    "pastelyellow": true,
    "lime": true,
    "pastellime": true,
    "green": true,
    "pastelgreen": true,
    "blue": true,
    "pastelblue": true,
    "skyblue": true,
    "purple": true,
    "pastelpurple": true,
    "pinkpurple": true,
    "pink": true,
    "pastelpink": true,
    "deepred": true,
    "deepblue": true,
    "copper": true,
    "gold": true,
    "rosegold": true,
    "silver": true,
    "brightred": true,
    "brown": true,
    "hotpink": true,
};
let cauldronColors = {
    "rainbow": true,
    "red": false,
    "pink": false,
    "orange": false,
    "yellow": false,
    "green": false,
    "blue": false,
    "purple": false,
};
let valentinesColors = {
    "brown_gold": true,
    "brown_pink": false,
    "brown_red": false,
    "white_gold": false,
    "white_pink": false,
    "white_red": false,
};
let easterColors = {
    "easter_1": true,
    "easter_2": false,
    "easter_3": false,
    "easter_4": false,
    "easter_5": false,
};
let splashpoolColors = {
    "red": true,
    "blue": false,
    "frog": false,
    "watermelon": false,
    "rainbow": false,
    "dots": false,
    "pink": false,
    "purple": false,
    "yellow": false,
};
let cakeColors = {
    "cake_rainbow": true,
    "cake_fruit": false,
    "cake_choco": false,
    "cake_pixelplush": false,
};
let flakesNth = "1";
let flakesNum = "3";
let flakesTimer = "3000";
let flakesLeaves = false;
let flakesSnow = false;
let flakesBlossoms = false;
let flakesRain = true;
let flakesHearts = false;
let giveawayLanguage = "en";
let isGiveawayChatEnabled = false;
let giveawayVolume = "25";
let giveawayCommand = "";
let giveawayJoinCommand = "";
let giveawayUnjoinCommand = "";
let giveawayClaimCommand = "";
let giveawaySkipmeCommand = "";

const ignoreInputs = [ "inputGameType", "inputGameTheme", "inputChannelName", "inputChatOAuth", "inputMessageFormatDisabled" ];

$( "#inputGameType" ).val( gameType );
$( "#inputGameType" ).on( "change", ( e ) => {
    gameType =  $( "#inputGameType" ).val();
    $( "#inputGameTheme" ).empty();
    Object.keys( themeSettings )
        .filter( theme => ( themeSettings[ theme ].game === gameType ) )
        .forEach( ( theme, i ) => {
            $( "#inputGameTheme" ).append( $( "<option />" ).val( theme ).text( themeSettings[ theme ].name ) );
            if( i === 0 ) {
                gameTheme = theme;
            }
        });
    setThemeDefaults();
    restoreSettings();
    generateLink();
    $( "#instructionsText" ).html( gameInstructions[ gameType ] );
});
$( "#inputGameTheme" ).empty();
Object.keys( themeSettings )
    .filter( theme => ( themeSettings[ theme ].game === gameType ) )
    .forEach( ( theme, i ) => {
        $( "#inputGameTheme" ).append( $( "<option />" ).val( theme ).text( themeSettings[ theme ].name ) );
        if( i === 0 ) {
            gameTheme = theme;
        }
    });
$( "#instructionsText" ).html( gameInstructions[ gameType ] );
$( "#inputGameTheme" ).val( gameTheme );
$( "#inputGameTheme" ).on( "change", ( e ) => {
    // console.log( e, "changed" );
    gameTheme = $( "#inputGameTheme" ).val();
    setThemeDefaults();
    restoreSettings();
    generateLink();
});
$( "#inputEnableBoss" ).on( "change", ( e ) => {
    // console.log( e, "changed" );
    isBossEnabled = e.target.checked;
    generateLink();
});
$( "#inputBossEffect" ).on( "change", ( e ) => {
    // console.log( e, "changed" );
    bossEffect = bossEffects[ e.target.selectedIndex ];
    generateLink();
});
$( "#inputTrapEffect" ).on( "change", ( e ) => {
    // console.log( e, "changed" );
    trapEffect = trapEffects[ e.target.selectedIndex ];
    generateLink();
});
$( "#inputEnableChat" ).on( "change", ( e ) => {
    isChatEnabled = e.target.checked;
    generateLink();
})
$( "#inputChannelName" ).on( "input", ( e ) => {
    // console.log( e, "input" );
    channelName = e.target.value;
    generateLink();
});
$( "#inputChatOAuth" ).on( "input", ( e ) => {
    // console.log( e, "input" );
    chatOAuth = e.target.value;
    generateLink();
});
$( "#inputMessageFormat" ).on( "input", ( e ) => {
    messageFormat = e.target.value;
    generateLink();
});
$( "#inputBossCount" ).on( "change", ( e ) => {
    bossCount = e.target.value;
    generateLink();
});
$( "#inputBossCount" ).on( "input", ( e ) => {
    bossCount = e.target.value;
    generateLink();
});
$( "#inputPrizeCount" ).on( "change", ( e ) => {
    prizeCount = e.target.value;
    generateLink();
});
$( "#inputPrizeCount" ).on( "input", ( e ) => {
    prizeCount = e.target.value;
    generateLink();
});
$( "#inputTrapCount" ).on( "change", ( e ) => {
    trapCount = e.target.value;
    generateLink();
});
$( "#inputTrapCount" ).on( "input", ( e ) => {
    trapCount = e.target.value;
    generateLink();
});
$( "#inputEnableParachuteOverlay" ).on( "change", ( e ) => {
    isParachuteOverlay = !e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteClouds" ).on( "change", ( e ) => {
    isParachuteCloudsOn = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteHideTilDrop" ).on( "change", ( e ) => {
    isParachuteHideTilDrop = e.target.checked;
    generateLink();
});
$( "#inputParachuteVolume" ).on( "change", ( e ) => {
    parachuteVolume = e.target.value;
    generateLink();
});
$( "#inputParachuteVolume" ).on( "input", ( e ) => {
    parachuteVolume = e.target.value;
    generateLink();
});
$( "#inputParachuteRefresh" ).on( "change", ( e ) => {
    parachuteRefresh = e.target.value;
    generateLink();
});
$( "#inputParachuteRefresh" ).on( "input", ( e ) => {
    parachuteRefresh = e.target.value;
    generateLink();
});
$( "#inputParachuteGameReady" ).on( "change", ( e ) => {
    parachuteGameReady = e.target.value;
    generateLink();
});
$( "#inputParachuteGameReady" ).on( "input", ( e ) => {
    parachuteGameReady = e.target.value;
    generateLink();
});
$( "#inputParachuteRaidDrop" ).on( "change", ( e ) => {
    parachuteRaidDrop = e.target.value;
    generateLink();
});
$( "#inputParachuteRaidDrop" ).on( "input", ( e ) => {
    parachuteRaidDrop = e.target.value;
    generateLink();
});
$( "#inputParachuteCommand" ).on( "change", ( e ) => {
    parachuteCommand = e.target.value;
    generateLink();
});
$( "#inputParachuteCommand" ).on( "input", ( e ) => {
    parachuteCommand = e.target.value;
    generateLink();
});
$( "#inputEnableParachuteCommand" ).on( "change", ( e ) => {
    isCommandEnabled = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteChat" ).on( "change", ( e ) => {
    isParachuteChatEnabled = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteDroplets" ).on( "change", ( e ) => {
    isDropletsEnabled = e.target.checked;
    generateLink();
});
$( "#inputParachuteCPDrop" ).on( "change", ( e ) => {
    parachuteCPDrop = e.target.value;
    generateLink();
});
$( "#inputParachuteCPDrop" ).on( "input", ( e ) => {
    parachuteCPDrop = e.target.value;
    generateLink();
});
$( "#inputParachuteCPDroplets" ).on( "change", ( e ) => {
    parachuteCPDroplets = e.target.value;
    generateLink();
});
$( "#inputParachuteCPDroplets" ).on( "input", ( e ) => {
    parachuteCPDroplets = e.target.value;
    generateLink();
});
$( "#inputParachuteNotifVolume" ).on( "change", ( e ) => {
    parachuteNotifVolume = e.target.value;
    generateLink();
});
$( "#inputParachuteNotifVolume" ).on( "input", ( e ) => {
    parachuteNotifVolume = e.target.value;
    generateLink();
});
$( "#inputParachuteCPQueue" ).on( "change", ( e ) => {
    parachuteCPQueue = e.target.value;
    generateLink();
});
$( "#inputParachuteCPQueue" ).on( "input", ( e ) => {
    parachuteCPQueue = e.target.value;
    generateLink();
});
$( "#inputEnablePlinkoOverlay" ).on( "change", ( e ) => {
    isPlinkoOverlay = !e.target.checked;
    generateLink();
});
$( "#inputEnablePlinkoClouds" ).on( "change", ( e ) => {
    isPlinkoCloudsOn = e.target.checked;
    generateLink();
});
$( "#inputEnablePlinkoHideTilStart" ).on( "change", ( e ) => {
    isPlinkoHideTilStart = e.target.checked;
    generateLink();
});
$( "#inputPlinkoVolume" ).on( "change", ( e ) => {
    plinkoVolume = e.target.value;
    generateLink();
});
$( "#inputPlinkoVolume" ).on( "input", ( e ) => {
    plinkoVolume = e.target.value;
    generateLink();
});
$( "#inputEnablePlinkoChat" ).on( "change", ( e ) => {
    isPlinkoChatEnabled = e.target.checked;
    generateLink();
});
$( "#inputPlinkoCPPlink" ).on( "change", ( e ) => {
    plinkoCPPlink = e.target.value;
    generateLink();
});
$( "#inputPlinkoCPPlink" ).on( "input", ( e ) => {
    plinkoCPPlink = e.target.value;
    generateLink();
});
$( "#inputPlinkoCommand" ).on( "change", ( e ) => {
    plinkoCommand = e.target.value;
    generateLink();
});
$( "#inputPlinkoCommand" ).on( "input", ( e ) => {
    plinkoCommand = e.target.value;
    generateLink();
});
$( "#inputPlinkoCPQueue" ).on( "change", ( e ) => {
    plinkoCPQueue = e.target.value;
    generateLink();
});
$( "#inputPlinkoCPQueue" ).on( "input", ( e ) => {
    plinkoCPQueue = e.target.value;
    generateLink();
});
$( "#inputPlinkoRefresh" ).on( "change", ( e ) => {
    plinkoRefresh = e.target.value;
    generateLink();
});
$( "#inputPlinkoRefresh" ).on( "input", ( e ) => {
    plinkoRefresh = e.target.value;
    generateLink();
});
$( "#inputPlinkoGameReady" ).on( "change", ( e ) => {
    plinkoGameReady = e.target.value;
    generateLink();
});
$( "#inputPlinkoGameReady" ).on( "input", ( e ) => {
    plinkoGameReady = e.target.value;
    generateLink();
});
$( "#inputPlinkoNotifVolume" ).on( "change", ( e ) => {
    plinkoNotifVolume = e.target.value;
    generateLink();
});
$( "#inputPlinkoNotifVolume" ).on( "input", ( e ) => {
    plinkoNotifVolume = e.target.value;
    generateLink();
});
$( "#inputEnablePlinkoCommand" ).on( "change", ( e ) => {
    isCommandEnabled = e.target.checked;
    generateLink();
});
$( "#inputEnableHillRollOverlay" ).on( "change", ( e ) => {
    isHillRollOverlay = !e.target.checked;
    generateLink();
});
$( "#inputEnableHillRollClouds" ).on( "change", ( e ) => {
    isHillRollCloudsOn = e.target.checked;
    generateLink();
});
$( "#inputEnableHillRollHideTilRoll" ).on( "change", ( e ) => {
    isHillRollHideTilRoll = e.target.checked;
    generateLink();
});
$( "#inputEnableHillRollInstructions" ).on( "change", ( e ) => {
    hideInstructions = e.target.checked;
    generateLink();
});
$( "#inputEnableHillRollTimer" ).on( "change", ( e ) => {
    hideTimer = e.target.checked;
    generateLink();
});
$( "#inputHillRollDefaultCountdown" ).on( "change", ( e ) => {
    hillRollDefaultCountdown = e.target.value;
    generateLink();
});
$( "#inputHillRollDefaultCountdown" ).on( "input", ( e ) => {
    hillRollDefaultCountdown = e.target.value;
    generateLink();
});
$( "#inputHillRollVolume" ).on( "change", ( e ) => {
    hillRollVolume = e.target.value;
    generateLink();
});
$( "#inputHillRollVolume" ).on( "input", ( e ) => {
    hillRollVolume = e.target.value;
    generateLink();
});
$( "#inputHillRollRefresh" ).on( "change", ( e ) => {
    hillRollRefresh = e.target.value;
    generateLink();
});
$( "#inputHillRollRefresh" ).on( "input", ( e ) => {
    hillRollRefresh = e.target.value;
    generateLink();
});
$( "#inputHillRollCommand" ).on( "change", ( e ) => {
    hillRollCommand = e.target.value;
    generateLink();
});
$( "#inputHillRollCommand" ).on( "input", ( e ) => {
    hillRollCommand = e.target.value;
    generateLink();
});
$( "#inputEnableHillRollChat" ).on( "change", ( e ) => {
    isHillRollChatEnabled = e.target.checked;
    generateLink();
});
$( "#inputGiveawayLanguage" ).on( "change", ( e ) => {
    giveawayLanguage = e.target.value;
    generateLink();
});
$( "#inputGiveawayVolume" ).on( "change", ( e ) => {
    giveawayVolume = e.target.value;
    generateLink();
});
$( "#inputGiveawayVolume" ).on( "input", ( e ) => {
    giveawayVolume = e.target.value;
    generateLink();
});
$( "#inputEnableGiveawayChat" ).on( "change", ( e ) => {
    isGiveawayChatEnabled = e.target.checked;
    generateLink();
});
$( "#inputGiveawayCommand" ).on( "change", ( e ) => {
    giveawayCommand = e.target.value;
    generateLink();
});
$( "#inputGiveawayCommand" ).on( "input", ( e ) => {
    giveawayCommand = e.target.value;
    generateLink();
});
$( "#inputGiveawayJoinCommand" ).on( "change", ( e ) => {
    giveawayJoinCommand = e.target.value;
    generateLink();
});
$( "#inputGiveawayJoinCommand" ).on( "input", ( e ) => {
    giveawayJoinCommand = e.target.value;
    generateLink();
});
$( "#inputGiveawayUnjoinCommand" ).on( "change", ( e ) => {
    giveawayUnjoinCommand = e.target.value;
    generateLink();
});
$( "#inputGiveawayUnjoinCommand" ).on( "input", ( e ) => {
    giveawayUnjoinCommand = e.target.value;
    generateLink();
});
$( "#inputGiveawayClaimCommand" ).on( "change", ( e ) => {
    giveawayClaimCommand = e.target.value;
    generateLink();
});
$( "#inputGiveawayClaimCommand" ).on( "input", ( e ) => {
    giveawayClaimCommand = e.target.value;
    generateLink();
});
$( "#inputGiveawaySkipmeCommand" ).on( "change", ( e ) => {
    giveawaySkipmeCommand = e.target.value;
    generateLink();
});
$( "#inputGiveawaySkipmeCommand" ).on( "input", ( e ) => {
    giveawaySkipmeCommand = e.target.value;
    generateLink();
});
$( "#inputWeatherRain" ).on( "change", ( e ) => {
    weatherRain = e.target.value;
    generateLink();
});
$( "#inputWeatherRain" ).on( "input", ( e ) => {
    weatherRain = e.target.value;
    generateLink();
});
$( "#inputWeatherRainTime" ).on( "change", ( e ) => {
    weatherRainTime = e.target.value;
    generateLink();
});
$( "#inputWeatherRainTime" ).on( "input", ( e ) => {
    weatherRainTime = e.target.value;
    generateLink();
});
$( "#inputWeatherHeavyRain" ).on( "change", ( e ) => {
    weatherHeavyRain = e.target.value;
    generateLink();
});
$( "#inputWeatherHeavyRain" ).on( "input", ( e ) => {
    weatherHeavyRain = e.target.value;
    generateLink();
});
$( "#inputWeatherHeavyRainTime" ).on( "change", ( e ) => {
    weatherHeavyRainTime = e.target.value;
    generateLink();
});
$( "#inputWeatherHeavyRainTime" ).on( "input", ( e ) => {
    weatherHeavyRainTime = e.target.value;
    generateLink();
});
$( "#inputWeatherLightning" ).on( "change", ( e ) => {
    weatherLightning = e.target.value;
    generateLink();
});
$( "#inputWeatherLightning" ).on( "input", ( e ) => {
    weatherLightning = e.target.value;
    generateLink();
});
$( "#inputWeatherRainbow" ).on( "change", ( e ) => {
    weatherRainbow = e.target.value;
    generateLink();
});
$( "#inputWeatherRainbow" ).on( "input", ( e ) => {
    weatherRainbow = e.target.value;
    generateLink();
});
$( "#inputWeatherSunshine" ).on( "change", ( e ) => {
    weatherSunshine = e.target.value;
    generateLink();
});
$( "#inputWeatherSunshine" ).on( "input", ( e ) => {
    weatherSunshine = e.target.value;
    generateLink();
});
$( "#inputWeatherBlossoms" ).on( "change", ( e ) => {
    weatherBlossoms = e.target.value;
    generateLink();
});
$( "#inputWeatherBlossoms" ).on( "input", ( e ) => {
    weatherBlossoms = e.target.value;
    generateLink();
});
$( "#inputWeatherBlossomsTime" ).on( "change", ( e ) => {
    weatherBlossomsTime = e.target.value;
    generateLink();
});
$( "#inputWeatherBlossomsTime" ).on( "input", ( e ) => {
    weatherBlossomsTime = e.target.value;
    generateLink();
});
$( "#inputWeatherSnow" ).on( "change", ( e ) => {
    weatherSnow = e.target.value;
    generateLink();
});
$( "#inputWeatherSnow" ).on( "input", ( e ) => {
    weatherSnow = e.target.value;
    generateLink();
});
$( "#inputWeatherSnowTime" ).on( "change", ( e ) => {
    weatherSnowTime = e.target.value;
    generateLink();
});
$( "#inputWeatherSnowTime" ).on( "input", ( e ) => {
    weatherSnowTime = e.target.value;
    generateLink();
});
$( "#inputWeatherBlizzard" ).on( "change", ( e ) => {
    weatherBlizzard = e.target.value;
    generateLink();
});
$( "#inputWeatherBlizzard" ).on( "input", ( e ) => {
    weatherBlizzard = e.target.value;
    generateLink();
});
$( "#inputWeatherBlizzardTime" ).on( "change", ( e ) => {
    weatherBlizzardTime = e.target.value;
    generateLink();
});
$( "#inputWeatherBlizzardTime" ).on( "input", ( e ) => {
    weatherBlizzardTime = e.target.value;
    generateLink();
});
$( "#inputWeatherHail" ).on( "change", ( e ) => {
    weatherHail = e.target.value;
    generateLink();
});
$( "#inputWeatherHail" ).on( "input", ( e ) => {
    weatherHail = e.target.value;
    generateLink();
});
$( "#inputWeatherHailTime" ).on( "change", ( e ) => {
    weatherHailTime = e.target.value;
    generateLink();
});
$( "#inputWeatherHailTime" ).on( "input", ( e ) => {
    weatherHailTime = e.target.value;
    generateLink();
});
$( "#inputWeatherLeaf" ).on( "change", ( e ) => {
    weatherLeaf = e.target.value;
    generateLink();
});
$( "#inputWeatherLeaf" ).on( "input", ( e ) => {
    weatherLeaf = e.target.value;
    generateLink();
});
$( "#inputWeatherLeafTime" ).on( "change", ( e ) => {
    weatherLeafTime = e.target.value;
    generateLink();
});
$( "#inputWeatherLeafTime" ).on( "input", ( e ) => {
    weatherLeafTime = e.target.value;
    generateLink();
});
$( "#inputWeatherVolume" ).on( "change", ( e ) => {
    weatherVolume = e.target.value;
    generateLink();
});
$( "#inputWeatherVolume" ).on( "input", ( e ) => {
    weatherVolume = e.target.value;
    generateLink();
});
$( "#inputConfettiParty" ).on( "change", ( e ) => {
    confettiParty = e.target.value;
    generateLink();
});
$( "#inputConfettiParty" ).on( "input", ( e ) => {
    confettiParty = e.target.value;
    generateLink();
});
$( "#inputConfettiPartyIntensity" ).on( "change", ( e ) => {
    confettiIntensity = e.target.value;
    generateLink();
});
$( "#inputConfettiPartyIntensity" ).on( "input", ( e ) => {
    confettiIntensity = e.target.value;
    generateLink();
});
$( "#inputConfettiBubbles" ).on( "change", ( e ) => {
    confettiBubbles = e.target.value;
    generateLink();
});
$( "#inputConfettiBubbles" ).on( "input", ( e ) => {
    confettiBubbles = e.target.value;
    generateLink();
});
$( "#inputConfettiBubblesIntensity" ).on( "change", ( e ) => {
    bubblesIntensity = e.target.value;
    generateLink();
});
$( "#inputConfettiBubblesIntensity" ).on( "input", ( e ) => {
    bubblesIntensity = e.target.value;
    generateLink();
});
$( "#inputConfettiBalloons" ).on( "change", ( e ) => {
    confettiBalloons = e.target.value;
    generateLink();
});
$( "#inputConfettiBalloons" ).on( "input", ( e ) => {
    confettiBalloons = e.target.value;
    generateLink();
});
$( "#inputConfettiBalloonsIntensity" ).on( "change", ( e ) => {
    balloonsIntensity = e.target.value;
    generateLink();
});
$( "#inputConfettiBalloonsIntensity" ).on( "input", ( e ) => {
    balloonsIntensity = e.target.value;
    generateLink();
});
$( "#inputConfettiHearts" ).on( "change", ( e ) => {
    confettiHearts = e.target.value;
    generateLink();
});
$( "#inputConfettiHearts" ).on( "input", ( e ) => {
    confettiHearts = e.target.value;
    generateLink();
});
$( "#inputConfettiHeartsIntensity" ).on( "change", ( e ) => {
    heartsIntensity = e.target.value;
    generateLink();
});
$( "#inputConfettiHeartsIntensity" ).on( "input", ( e ) => {
    heartsIntensity = e.target.value;
    generateLink();
});
$( "#inputConfettiVolume" ).on( "change", ( e ) => {
    confettiVolume = e.target.value;
    generateLink();
});
$( "#inputConfettiVolume" ).on( "input", ( e ) => {
    confettiVolume = e.target.value;
    generateLink();
});
$( "#inputFlakesNth" ).on( "change", ( e ) => {
    flakesNth = e.target.value;
    generateLink();
});
$( "#inputFlakesNth" ).on( "input", ( e ) => {
    flakesNth = e.target.value;
    generateLink();
});
$( "#inputFlakesNum" ).on( "change", ( e ) => {
    flakesNum = e.target.value;
    generateLink();
});
$( "#inputFlakesNum" ).on( "input", ( e ) => {
    flakesNum = e.target.value;
    generateLink();
});
$( "#inputFlakesTimer" ).on( "change", ( e ) => {
    flakesTimer = e.target.value;
    generateLink();
});
$( "#inputFlakesTimer" ).on( "input", ( e ) => {
    flakesTimer = e.target.value;
    generateLink();
});
$( "#inputEnableFlakesLeaves" ).on( "change", ( e ) => {
    flakesLeaves = e.target.checked;
    generateLink();
});
$( "#inputEnableFlakesSnow" ).on( "change", ( e ) => {
    flakesSnow = e.target.checked;
    generateLink();
});
$( "#inputEnableFlakesBlossoms" ).on( "change", ( e ) => {
    flakesBlossoms = e.target.checked;
    generateLink();
});
$( "#inputEnableFlakesRain" ).on( "change", ( e ) => {
    flakesRain = e.target.checked;
    generateLink();
});
$( "#inputEnableFlakesHearts" ).on( "change", ( e ) => {
    flakesHearts = e.target.checked;
    generateLink();
});

$( "#inputEnableParachuteColor-cake_rainbow" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "cake_rainbow" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cakeColors ).filter( x => cakeColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cakeColors[ "cake_rainbow" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-cake_fruit" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "cake_fruit" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cakeColors ).filter( x => cakeColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cakeColors[ "cake_fruit" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-cake_choco" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "cake_choco" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cakeColors ).filter( x => cakeColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cakeColors[ "cake_choco" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-cake_pixelplush" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "cake_pixelplush" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cakeColors ).filter( x => cakeColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cakeColors[ "cake_pixelplush" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-poolfrog" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "frog" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    splashpoolColors[ "frog" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-poolwatermelon" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "watermelon" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    splashpoolColors[ "watermelon" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-poolrainbow" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "rainbow" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    splashpoolColors[ "rainbow" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-pooldots" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "dots" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    splashpoolColors[ "dots" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-poolpink" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "pink" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    splashpoolColors[ "pink" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-poolpurple" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "purple" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    splashpoolColors[ "purple" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-poolyellow" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "yellow" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    splashpoolColors[ "yellow" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-poolred" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "red" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    splashpoolColors[ "red" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-poolblue" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "blue" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    splashpoolColors[ "blue" ] = e.target.checked;
    setThemeDefaults(); // Do this to reset bundle item requires
    generateLink();
});
$( "#inputEnableParachuteColor-easter-1" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "easter_1" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( easterColors ).filter( x => easterColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    easterColors[ "easter_1" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-easter-2" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "easter_2" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( easterColors ).filter( x => easterColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    easterColors[ "easter_2" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-easter-3" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "easter_3" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( easterColors ).filter( x => easterColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    easterColors[ "easter_3" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-easter-4" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "easter_4" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( easterColors ).filter( x => easterColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    easterColors[ "easter_4" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-easter-5" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "easter_5" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( easterColors ).filter( x => easterColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    easterColors[ "easter_5" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-brown-gold" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "brown_gold" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( valentinesColors ).filter( x => valentinesColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    valentinesColors[ "brown_gold" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-brown-pink" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "brown_pink" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( valentinesColors ).filter( x => valentinesColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    valentinesColors[ "brown_pink" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-brown-red" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "brown_red" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( valentinesColors ).filter( x => valentinesColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    valentinesColors[ "brown_red" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-white-gold" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "white_gold" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( valentinesColors ).filter( x => valentinesColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    valentinesColors[ "white_gold" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-white-pink" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "white_pink" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( valentinesColors ).filter( x => valentinesColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    valentinesColors[ "white_pink" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-white-red" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        const preview = themeSettings[ gameTheme ].extras[ "white_red" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( valentinesColors ).filter( x => valentinesColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    valentinesColors[ "white_red" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-rainbow" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        // cauldronColors[ "rainbow" ] = false;
        // $( "#inputEnableParachuteColor-rainbow" ).prop( "checked", false );
        const preview = themeSettings[ gameTheme ].extras[ "rainbow" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cauldronColors[ "rainbow" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-red" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        // cauldronColors[ "rainbow" ] = false;
        // $( "#inputEnableParachuteColor-rainbow" ).prop( "checked", false );
        const preview = themeSettings[ gameTheme ].extras[ "red" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cauldronColors[ "red" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-pink" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        // cauldronColors[ "rainbow" ] = false;
        // $( "#inputEnableParachuteColor-rainbow" ).prop( "checked", false );
        const preview = themeSettings[ gameTheme ].extras[ "pink" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cauldronColors[ "pink" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-orange" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        // cauldronColors[ "rainbow" ] = false;
        // $( "#inputEnableParachuteColor-rainbow" ).prop( "checked", false );
        const preview = themeSettings[ gameTheme ].extras[ "orange" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cauldronColors[ "orange" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-yellow" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        // cauldronColors[ "rainbow" ] = false;
        // $( "#inputEnableParachuteColor-rainbow" ).prop( "checked", false );
        const preview = themeSettings[ gameTheme ].extras[ "yellow" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cauldronColors[ "yellow" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-green" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        // cauldronColors[ "rainbow" ] = false;
        // $( "#inputEnableParachuteColor-rainbow" ).prop( "checked", false );
        const preview = themeSettings[ gameTheme ].extras[ "green" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cauldronColors[ "green" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-blue" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        // cauldronColors[ "rainbow" ] = false;
        // $( "#inputEnableParachuteColor-rainbow" ).prop( "checked", false );
        const preview = themeSettings[ gameTheme ].extras[ "blue" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cauldronColors[ "blue" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableParachuteColor-purple" ).on( "change", ( e ) => {
    if( e.target.checked ) {
        // cauldronColors[ "rainbow" ] = false;
        // $( "#inputEnableParachuteColor-rainbow" ).prop( "checked", false );
        const preview = themeSettings[ gameTheme ].extras[ "purple" ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    else {
        // Select random preview out of the selected
        const colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
        const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
        $( "#game-preview" ).attr( "src", preview );
    }
    cauldronColors[ "purple" ] = e.target.checked;
    generateLink();
});

$( "#inputEnableConfettiRed" ).on( "change", ( e ) => {
    confettiColors[ "red" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPastelRed" ).on( "change", ( e ) => {
    confettiColors[ "pastelred" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiOrange" ).on( "change", ( e ) => {
    confettiColors[ "orange" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPastelOrange" ).on( "change", ( e ) => {
    confettiColors[ "pastelorange" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiYellow" ).on( "change", ( e ) => {
    confettiColors[ "yellow" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiDarkYellow" ).on( "change", ( e ) => {
    confettiColors[ "darkyellow" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPastelYellow" ).on( "change", ( e ) => {
    confettiColors[ "pastelyellow" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiLime" ).on( "change", ( e ) => {
    confettiColors[ "lime" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPastelLime" ).on( "change", ( e ) => {
    confettiColors[ "pastellime" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiGreen" ).on( "change", ( e ) => {
    confettiColors[ "green" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPastelGreen" ).on( "change", ( e ) => {
    confettiColors[ "pastelgreen" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiBlue" ).on( "change", ( e ) => {
    confettiColors[ "blue" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPastelBlue" ).on( "change", ( e ) => {
    confettiColors[ "pastelblue" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiSkyBlue" ).on( "change", ( e ) => {
    confettiColors[ "skyblue" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPurple" ).on( "change", ( e ) => {
    confettiColors[ "purple" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPastelPurple" ).on( "change", ( e ) => {
    confettiColors[ "pastelpurple" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPinkPurple" ).on( "change", ( e ) => {
    confettiColors[ "pinkpurple" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPink" ).on( "change", ( e ) => {
    confettiColors[ "pink" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiPastelPink" ).on( "change", ( e ) => {
    confettiColors[ "pastelpink" ] = e.target.checked;
    generateLink();
});

$( "#inputEnableConfettiDeepRed" ).on( "change", ( e ) => {
    confettiColors[ "deepred" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiDeepBlue" ).on( "change", ( e ) => {
    confettiColors[ "deepblue" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiCopper" ).on( "change", ( e ) => {
    confettiColors[ "copper" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiGold" ).on( "change", ( e ) => {
    confettiColors[ "gold" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiRoseGold" ).on( "change", ( e ) => {
    confettiColors[ "rosegold" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiSilver" ).on( "change", ( e ) => {
    confettiColors[ "silver" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiBrightRed" ).on( "change", ( e ) => {
    confettiColors[ "brightred" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiBrown" ).on( "change", ( e ) => {
    confettiColors[ "brown" ] = e.target.checked;
    generateLink();
});
$( "#inputEnableConfettiHotPink" ).on( "change", ( e ) => {
    confettiColors[ "hotpink" ] = e.target.checked;
    generateLink();
});
( async () => {
    catalog = await fetch( "https://www.pixelplush.dev/assets/catalog.json", {
        // catalog = await fetch( "http://localhost:10000/catalog.json", {
    }).then( r => r.json() );

    catalog.forEach( x => {
        items[ x.id ] = x;
    });

    setThemeDefaults();
    restoreSettings();
    generateLink();
})();

$( document ).ready(function() {
    var clipboard = new ClipboardJS('.clipboard');
    clipboard.on('success', function(e) {
        $( "#copy-btn" ).text( "Copied!" );
        $( "#copy-btn" ).removeClass( "btn-secondary" );
        $( "#copy-btn" ).addClass( "btn-success" );
        setTimeout( () => {
            $( "#copy-btn" ).text( "Click to Copy" );
            $( "#copy-btn" ).removeClass( "btn-success" );
            $( "#copy-btn" ).addClass( "btn-secondary" );
        }, 2000 );
    });
    clipboard.on('error', function(e) {
        $( "#copy-btn" ).text( "Error!" );
        $( "#copy-btn" ).removeClass( "btn-secondary" );
        $( "#copy-btn" ).addClass( "btn-danger" );
        setTimeout( () => {
            $( "#copy-btn" ).text( "Click to Copy" );
            $( "#copy-btn" ).removeClass( "btn-danger" );
            $( "#copy-btn" ).addClass( "btn-secondary" );
        }, 2000 );
    });
});

function setThemeDefaults() {
    gameTypes.forEach( g => $( `.${g}-game` ).addClass( "d-none" ) );
    $( `.${ themeSettings[ gameTheme ].game }-game` ).removeClass( "d-none" );
    gameTypes.forEach( g => $( `.${g}-game-extras` ).addClass( "d-none" ) );
    if( themeSettings[ gameTheme ].extras ) {
        if( gameTheme === "pixelparachutecauldron" ) {
            $( `.parachute-cauldron` ).removeClass( "d-none" );
        }
        else if( gameTheme === "pixelparachutevalentines" ) {
            $( `.parachute-valentines` ).removeClass( "d-none" );
        }
        else if( gameTheme === "pixelparachuteeasterpremium" ) {
            $( `.parachute-easter` ).removeClass( "d-none" );
        }
        else if( gameTheme === "pixelparachutesplashpool" ) {
            $( `.parachute-splashpool` ).removeClass( "d-none" );
        }
        else if( gameTheme === "pixelparachutescakes" ) {
            $( `.parachute-cakes` ).removeClass( "d-none" );
        }
        else {
            $( `.${ themeSettings[ gameTheme ].game }-game-extras` ).removeClass( "d-none" );
        }
    }
    if( themeSettings[ gameTheme ].bundle ) {
        let item = items[ themeSettings[ gameTheme ].bundle ];
        if( item ) {
            $( "#addon-button" ).empty();
            const bundleKeys = Object.keys( themeSettings[ gameTheme ].extras );
            const isMissingItems = !account.owned || bundleKeys.some( x => themeSettings[ gameTheme ].extras[ x ].requires && !account.owned.includes( themeSettings[ gameTheme ].extras[ x ].requires ) );
            if( !isMissingItems ) {
                $( "#addon-button" ).append( `
                    <h5 class="text-success"><strong>You Have The Full Set:</strong></h5>
                    <h3>${item.name}</h3>
                `);
                $( ".link-available" ).show();
                $( ".link-not-available" ).hide();
                let themeColors = null;
                switch( gameTheme ) {
                    case "pixelparachutesplashpool":
                        themeColors = splashpoolColors;
                    break;
                    case "pixelparachutescakes":
                        themeColors = cakeColors;
                    break;
                }
                Object.keys( themeColors ).forEach( x => {
                    $( `#coinParachuteColor-${x}` ).hide();
                });
            }
            else {
                // Show full bundle only if any of the required items are not available
                // Show all unowned items within bundle that's checked
                // Show link as available and hide if we detect any unowned but checked items
                $( ".link-available" ).show();
                $( ".link-not-available" ).hide();
                let themeColors = null;
                switch( gameTheme ) {
                    case "pixelparachutesplashpool":
                        themeColors = splashpoolColors;
                    break;
                    case "pixelparachutescakes":
                        themeColors = cakeColors;
                    break;
                }
                const selectedColors = Object.keys( themeColors ).filter( x => themeColors[ x ] );
                let isAddOnSelected = false;
                selectedColors.forEach( x => {
                    if( !themeSettings[ gameTheme ].extras[ x ].requires ) {
                        return;
                    }
                    if( !account.owned || !account.owned.includes( themeSettings[ gameTheme ].extras[ x ].requires ) ) {
                        let bItem = items[ themeSettings[ gameTheme ].extras[ x ].requires ];
                        $( "#addon-button" ).append( `
                            <h5 class="text-danger"><strong>One of Your Themes Requires The Add-On:</strong></h5>
                            <h3>${bItem.name}</h3>
                            <button class="btn btn-sm btn-outline-primary" type="button" onclick="buyItem('${bItem.id}')"><img src="public/app-assets/images/icon/plush_coin.gif" height="20px" class="pixelated" /> <strong>${bItem.sale ? `<span class="strikeout">${bItem.cost}</span> -> ` : ""}${bItem.cost === 0 ? "FREE" : ( bItem.sale ? `<span class="text-success">${bItem.cost / 2}</span>` : bItem.cost )}</strong></button>
                        `);
                        $( ".link-not-available" ).show();
                        $( ".link-available" ).hide();
                        isAddOnSelected = true;
                    }
                });
                // Hide the coin for owned items
                Object.keys( themeColors ).forEach( x => {
                    if( !themeSettings[ gameTheme ].extras[ x ].requires ) {
                        return;
                    }
                    if( !account.owned || !account.owned.includes( themeSettings[ gameTheme ].extras[ x ].requires ) ) {
                    }
                    else {
                        $( `#coinParachuteColor-${x}` ).hide();
                    }
                });
                if( isAddOnSelected ) {
                    $( "#addon-button" ).append( `
                        <h5 class="text-info"><strong>Get The Full Theme Bundle:</strong></h5>
                        <h3>${item.name}</h3>
                        <button class="btn btn-sm btn-outline-primary" type="button" onclick="buyItem('${item.id}')"><img src="public/app-assets/images/icon/plush_coin.gif" height="20px" class="pixelated" /> <strong>${item.sale ? `<span class="strikeout">${item.cost}</span> -> ` : ""}${item.cost === 0 ? "FREE" : ( item.sale ? `<span class="text-success">${item.cost / 2}</span>` : item.cost )}</strong></button>
                    `);
                }
                else {
                    $( "#addon-button" ).append( `
                        <h5 class="text-info"><strong>(Optional) Get The Full Theme Bundle:</strong></h5>
                        <h3>${item.name}</h3>
                        <button class="btn btn-sm btn-outline-primary" type="button" onclick="buyItem('${item.id}')"><img src="public/app-assets/images/icon/plush_coin.gif" height="20px" class="pixelated" /> <strong>${item.sale ? `<span class="strikeout">${item.cost}</span> -> ` : ""}${item.cost === 0 ? "FREE" : ( item.sale ? `<span class="text-success">${item.cost / 2}</span>` : item.cost )}</strong></button>
                    `);
                }
            }
            $( ".addon-required" ).show();
        }
    }
    else if( !themeSettings[ gameTheme ].requires ) {
        $( ".addon-required" ).hide();
        $( ".link-not-available" ).hide();
        $( ".link-available" ).show();
    }
    else {
        let item = items[ themeSettings[ gameTheme ].requires ];
        if( item ) {
            $( "#addon-button" ).empty();
            if( account.owned && account.owned.includes( themeSettings[ gameTheme ].requires ) ) {
                $( "#addon-button" ).append( `
                    <h5 class="text-success"><strong>You Have The Required Add-On:</strong></h5>
                    <h3>${item.name}</h3>
                `);
                $( ".link-available" ).show();
                $( ".link-not-available" ).hide();
            }
            else {
                $( "#addon-button" ).append( `
                    <h5 class="text-danger"><strong>This Theme Requires The Add-On:</strong></h5>
                    <h3>${item.name}</h3>
                    <button class="btn btn-sm btn-outline-primary" type="button" onclick="buyItem('${item.id}')"><img src="public/app-assets/images/icon/plush_coin.gif" height="20px" class="pixelated" /> <strong>${item.sale ? `<span class="strikeout">${item.cost}</span> -> ` : ""}${item.cost === 0 ? "FREE" : ( item.sale ? `<span class="text-success">${item.cost / 2}</span>` : item.cost )}</strong></button>
                `);
                $( ".link-not-available" ).show();
                $( ".link-available" ).hide();
            }
            $( ".addon-required" ).show();
        }
    }
    $( "#game-preview" ).attr( "src", themeSettings[ gameTheme ].preview );
    if( themeSettings[ gameTheme ].extras ) {
        if( gameTheme === "pixelparachutecauldron" ) {
            // Select random preview out of the selected
            let colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
            if( colors.length === 0 ) {
                colors = Object.keys( cauldronColors );
            }
            const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
            $( "#game-preview" ).attr( "src", preview );
        }
        else if( gameTheme === "pixelparachutevalentines" ) {
            // Select random preview out of the selected
            let colors = Object.keys( valentinesColors ).filter( x => valentinesColors[ x ] );
            if( colors.length === 0 ) {
                colors = Object.keys( valentinesColors );
            }
            const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
            $( "#game-preview" ).attr( "src", preview );
        }
        else if( gameTheme === "pixelparachuteeasterpremium" ) {
            // Select random preview out of the selected
            let colors = Object.keys( easterColors ).filter( x => easterColors[ x ] );
            if( colors.length === 0 ) {
                colors = Object.keys( easterColors );
            }
            const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
            $( "#game-preview" ).attr( "src", preview );
        }
        else if( gameTheme === "pixelparachutesplashpool" ) {
            // Select random preview out of the selected
            let colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
            if( colors.length === 0 ) {
                colors = Object.keys( splashpoolColors );
            }
            const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
            $( "#game-preview" ).attr( "src", preview );
        }
        else if( gameTheme === "pixelparachutescakes" ) {
            // Select random preview out of the selected
            let colors = Object.keys( cakeColors ).filter( x => cakeColors[ x ] );
            if( colors.length === 0 ) {
                colors = Object.keys( cakeColors );
            }
            const preview = themeSettings[ gameTheme ].extras[ colors[ Math.floor( Math.random() * colors.length ) ] ].preview;
            $( "#game-preview" ).attr( "src", preview );
        }
        else {
        }
    }
    isBossEnabled = themeSettings[ gameTheme ].bosses > 0;
    $( "#inputEnableBoss" ).prop( "checked", themeSettings[ gameTheme ].bosses > 0 ? true : false );
    bossEffect = bossEffects[ themeSettings[ gameTheme ].effect || 0 ];
    bossCount = themeSettings[ gameTheme ].bosses;
    prizeCount = themeSettings[ gameTheme ].prizes;
    trapCount = themeSettings[ gameTheme ].traps;
    $( "#inputMessageFormat" ).val( themeSettings[ gameTheme ].messageFormat );
    messageFormat = themeSettings[ gameTheme ].messageFormat;
    $( "#inputBossEffect" ).val( themeSettings[ gameTheme ].effect || 0 );
    $( "#inputTrapEffect" ).val( themeSettings[ gameTheme ].trapEffect || 0 );
    $( "#inputBossCount" ).val( bossCount );
    $( "#inputPrizeCount" ).val( prizeCount );
    $( "#inputTrapCount" ).val( trapCount );
    $( "#inputPrizeCount" ).prop( "disabled", themeSettings[ gameTheme ].lockItemCount ? true : false );
    $( "#inputTrapCount" ).prop( "disabled", themeSettings[ gameTheme ].lockItemCount ? true : false );
    isParachuteOverlay = themeSettings[ gameTheme ].overlay || false;
    isParachuteCloudsOn = themeSettings[ gameTheme ].clouds || false;
    isParachuteHideTilDrop = themeSettings[ gameTheme ].hideTilDrop || false;
    $( "#inputEnableParachuteOverlay" ).prop( "checked", !isParachuteOverlay );
    $( "#inputEnableParachuteClouds" ).prop( "checked", isParachuteCloudsOn );
    $( "#inputEnableParachuteHideTilDrop" ).prop( "checked", isParachuteOverlay );
    $( "#inputEnableParachuteChat" ).prop( "checked", isParachuteChatEnabled );
    $( "#inputEnableParachuteCommand" ).prop( "checked", isCommandEnabled );
    $( "#inputEnableParachuteDroplets" ).prop( "checked", isDropletsEnabled );
    isPlinkoOverlay = themeSettings[ gameTheme ].overlay || false;
    isPlinkoCloudsOn = themeSettings[ gameTheme ].clouds || false;
    isPlinkoHideTilStart = themeSettings[ gameTheme ].hideTilStart || false;
    $( "#inputEnablePlinkoOverlay" ).prop( "checked", !isPlinkoOverlay );
    $( "#inputEnablePlinkoClouds" ).prop( "checked", isPlinkoCloudsOn );
    $( "#inputEnablePlinkoHideTilStart" ).prop( "checked", isPlinkoOverlay );
    $( "#inputEnablePlinkoChat" ).prop( "checked", isPlinkoChatEnabled );
    $( "#inputEnablePlinkoCommand" ).prop( "checked", isCommandEnabled );
    isHillRollOverlay = themeSettings[ gameTheme ].overlay || false;
    isHillRollCloudsOn = themeSettings[ gameTheme ].clouds || false;
    isHillRollHideTilRoll = themeSettings[ gameTheme ].hideTilRoll || false;
    $( "#inputEnableHillRollOverlay" ).prop( "checked", !isHillRollOverlay );
    $( "#inputEnableHillRollClouds" ).prop( "checked", isHillRollCloudsOn );
    $( "#inputEnableHillRollHideTilRoll" ).prop( "checked", isHillRollOverlay );
    $( "#inputEnableHillRollChat" ).prop( "checked", isHillRollChatEnabled );
    $( "#inputEnableHillRollInstructions" ).prop( "checked", hideInstructions );
    $( "#inputEnableHillRollTimer" ).prop( "checked", hideTimer );
    $( "#inputEnableGiveawayChat" ).prop( "checked", isGiveawayChatEnabled );
}

function generateLink() {
    let baseLink = `${themeSettings[ gameTheme ].page}?`;
    let linkParams = [];
    linkParams.push( `channel=${channelName}` );
    if( themeSettings[ gameTheme ].extras ) {
        // Set baseLink to the first one checked
        if( gameTheme === "pixelparachutecauldron" ) {
            const colors = Object.keys( cauldronColors ).filter( x => cauldronColors[ x ] );
            baseLink = `${themeSettings[ gameTheme ].extras[ colors[ 0 ] ].page}?`;
            if( colors.length > 1 ) {
                linkParams.push( `variations=${colors.map( x => themeSettings[ gameTheme ].extras[ x ].name )}` );
            }
        }
        else if( gameTheme === "pixelparachutevalentines" ) {
            const colors = Object.keys( valentinesColors ).filter( x => valentinesColors[ x ] );
            baseLink = `${themeSettings[ gameTheme ].extras[ colors[ 0 ] ].page}?`;
            if( colors.length > 1 ) {
                linkParams.push( `variations=${colors.map( x => themeSettings[ gameTheme ].extras[ x ].name )}` );
            }
        }
        else if( gameTheme === "pixelparachuteeasterpremium" ) {
            const colors = Object.keys( easterColors ).filter( x => easterColors[ x ] );
            baseLink = `${themeSettings[ gameTheme ].extras[ colors[ 0 ] ].page}?`;
            if( colors.length > 1 ) {
                linkParams.push( `variations=${colors.map( x => themeSettings[ gameTheme ].extras[ x ].name )}` );
            }
        }
        else if( gameTheme === "pixelparachutesplashpool" ) {
            const colors = Object.keys( splashpoolColors ).filter( x => splashpoolColors[ x ] );
            baseLink = `${themeSettings[ gameTheme ].extras[ colors[ 0 ] ].page}?`;
            if( colors.length > 1 ) {
                linkParams.push( `variations=${colors.map( x => themeSettings[ gameTheme ].extras[ x ].name )}` );
            }
        }
        else if( gameTheme === "pixelparachutescakes" ) {
            const colors = Object.keys( cakeColors ).filter( x => cakeColors[ x ] );
            baseLink = `${themeSettings[ gameTheme ].extras[ colors[ 0 ] ].page}?`;
            if( colors.length > 1 ) {
                linkParams.push( `variations=${colors.map( x => themeSettings[ gameTheme ].extras[ x ].name )}` );
            }
        }
        else {
        }
    }
    switch( themeSettings[ gameTheme ].game ) {
    case "giveaway":
        if( giveawayLanguage ) {
            linkParams.push( `lang=${giveawayLanguage}` );
        }
        if( giveawayVolume ) {
            linkParams.push( `volume=${giveawayVolume}` );
        }
        if( giveawayCommand ) {
            linkParams.push( `command=${giveawayCommand.replace("!", "")}` );
        }
        if( giveawayJoinCommand ) {
            linkParams.push( `join=${giveawayJoinCommand.replace("!", "")}` );
        }
        if( giveawayUnjoinCommand ) {
            linkParams.push( `unjoin=${giveawayUnjoinCommand.replace("!", "")}` );
        }
        if( giveawayClaimCommand ) {
            linkParams.push( `win=${giveawayClaimCommand.replace("!", "")}` );
        }
        if( giveawaySkipmeCommand ) {
            linkParams.push( `skip=${giveawaySkipmeCommand.replace("!", "")}` );
        }
        if( isGiveawayChatEnabled ) {
            linkParams.push( `chat=true` );
        }
        linkParams.push( `oauth=${chatOAuth}` );
        break;
    case "chatflakes":
        if( flakesNth !== "0" ) {
            linkParams.push( `nth=${flakesNth}` );
        }
        if( flakesNum !== "0" ) {
            linkParams.push( `num=${flakesNum}` );
        }
        if( flakesTimer !== "0" ) {
            linkParams.push( `timer=${flakesTimer}` );
        }
        if( flakesLeaves ) {
            linkParams.push( `leaves=true` );
        }
        if( flakesSnow ) {
            linkParams.push( `snow=true` );
        }
        if( flakesBlossoms ) {
            linkParams.push( `blossoms=true` );
        }
        if( flakesRain ) {
            linkParams.push( `rain=true` );
        }
        if( flakesHearts ) {
            linkParams.push( `hearts=true` );
        }
        linkParams.push( `oauth=${chatOAuth}` );
        break;
    case "weather":
        if( weatherRain !== "0" ) {
            linkParams.push( `rain=${weatherRain}&rainTime=${weatherRainTime}` );
        }
        if( weatherHeavyRain !== "0" ) {
            linkParams.push( `heavyrain=${weatherHeavyRain}&heavyrainTime=${weatherHeavyRainTime}` );
        }
        if( weatherLightning !== "0" ) {
            linkParams.push( `lightning=${weatherLightning}` );
        }
        if( weatherRainbow !== "0" ) {
            linkParams.push( `rainbow=${weatherRainbow}` );
        }
        if( weatherSunshine !== "0" ) {
            linkParams.push( `sunshine=${weatherSunshine}` );
        }
        if( weatherBlossoms !== "0" ) {
            linkParams.push( `blossoms=${weatherBlossoms}&blossomsTime=${weatherBlossomsTime}` );
        }
        if( weatherSnow !== "0" ) {
            linkParams.push( `snow=${weatherSnow}&snowTime=${weatherSnowTime}` );
        }
        if( weatherBlizzard !== "0" ) {
            linkParams.push( `blizzard=${weatherBlizzard}&blizzardTime=${weatherBlizzardTime}` );
        }
        if( weatherHail !== "0" ) {
            linkParams.push( `hail=${weatherHail}&hailTime=${weatherHailTime}` );
        }
        if( weatherLeaf !== "0" ) {
            linkParams.push( `leaf=${weatherLeaf}&leafTime=${weatherLeafTime}` );
        }
        if( weatherVolume ) {
            linkParams.push( `volume=${weatherVolume}` );
        }
        linkParams.push( `oauth=${chatOAuth}` );
        break;
    case "maze":
        if( !isBossEnabled ) {
            linkParams.push( "noBoss=true" );
        }
        if( isChatEnabled && chatOAuth ) {
            linkParams.push( `oauth=${chatOAuth}` );
            linkParams.push( `messageFormat=${messageFormat}` );
        }
        linkParams.push( `bosses=${bossCount}` );
        linkParams.push( `bossEffect=${bossEffect}` );
        linkParams.push( `prizes=${prizeCount}` );
        linkParams.push( `traps=${trapCount}` );
        break;
    case "parachute":
        if( isParachuteOverlay ) {
            linkParams.push( "overlay=true" );
        }
        if( isParachuteCloudsOn ) {
            linkParams.push( "clouds=true" );
        }
        else {
            linkParams.push( "clouds=false" );
        }
        if( isParachuteHideTilDrop ) {
            linkParams.push( "hideTilDrop=true" );
        }
        if( parachuteVolume ) {
            linkParams.push( `volume=${parachuteVolume}` );
        }
        if( parachuteCommand ) {
            linkParams.push( `command=${parachuteCommand.replace("!", "")}` );
        }
        if( parachuteRefresh ) {
            linkParams.push( `cooldown=${parachuteRefresh}000` );
        }
        if( parachuteGameReady && parachuteGameReady !== "0" ) {
            linkParams.push( `readyTime=${parachuteGameReady}000` );
        }
        if( parachuteRaidDrop && parachuteRaidDrop !== "0" ) {
            linkParams.push( `raidMode=${parachuteRaidDrop}000` );
        }
        if( isParachuteChatEnabled && chatOAuth ) {
            linkParams.push( `messageFormat=${messageFormat}` );
        }
        if( parachuteCPDrop !== "0" ) {
            linkParams.push( `cpDrop=true&cpDropCost=${parachuteCPDrop}` );
        }
        if( parachuteCPDroplets !== "0" ) {
            linkParams.push( `cpDroplets=true&cpDropletsCost=${parachuteCPDroplets}` );
        }
        if( parachuteCPQueue !== "0" ) {
            linkParams.push( `cpQueue=true&cpQueueCost=${parachuteCPQueue}` );
        }
        if( isCommandEnabled ) {
            linkParams.push( `commandOn=true` );
        }
        if( isDropletsEnabled ) {
            linkParams.push( `droplets=true` );
        }
        if( parachuteNotifVolume ) {
            linkParams.push( `notifVolume=${parachuteNotifVolume}` );
        }
        linkParams.push( `oauth=${chatOAuth}` );
        break;
    case "plinko":
        if( isPlinkoOverlay ) {
            linkParams.push( "overlay=true" );
        }
        if( isPlinkoCloudsOn ) {
            linkParams.push( "clouds=true" );
        }
        else {
            linkParams.push( "clouds=false" );
        }
        if( isPlinkoHideTilStart ) {
            linkParams.push( "hideTilStart=true" );
        }
        if( plinkoVolume ) {
            linkParams.push( `volume=${plinkoVolume}` );
        }
        if( plinkoCommand ) {
            linkParams.push( `command=${plinkoCommand.replace("!", "")}` );
        }
        if( plinkoCPQueue !== "0" ) {
            linkParams.push( `cpQueue=true&cpQueueCost=${plinkoCPQueue}` );
        }
        if( plinkoRefresh ) {
            linkParams.push( `cooldown=${plinkoRefresh}000` );
        }
        if( plinkoGameReady && plinkoGameReady !== "0" ) {
            linkParams.push( `readyTime=${plinkoGameReady}000` );
        }
        if( plinkoCPPlink !== "0" ) {
            linkParams.push( `cpPlink=true&cpPlinkCost=${plinkoCPPlink}` );
        }
        if( isCommandEnabled ) {
            linkParams.push( `commandOn=true` );
        }
        if( plinkoNotifVolume ) {
            linkParams.push( `notifVolume=${plinkoNotifVolume}` );
        }
        // if( plinkoRefresh ) {
        //     linkParams.push( `cooldown=${plinkoRefresh}000` );
        // }
        if( isPlinkoChatEnabled && chatOAuth ) {
            linkParams.push( `messageFormat=${messageFormat}` );
        }
        linkParams.push( `oauth=${chatOAuth}` );
        break;
    case "hillroll":
        if( isHillRollOverlay ) {
            linkParams.push( "overlay=true" );
        }
        if( isHillRollCloudsOn ) {
            linkParams.push( "clouds=true" );
        }
        else {
            linkParams.push( "clouds=false" );
        }
        if( isHillRollHideTilRoll ) {
            linkParams.push( "hideTilRoll=true" );
        }
        if( hillRollDefaultCountdown ) {
            linkParams.push( `defaultCountdown=${hillRollDefaultCountdown}` );
        }
        if( hillRollVolume ) {
            linkParams.push( `volume=${hillRollVolume}` );
        }
        if( hillRollCommand ) {
            linkParams.push( `command=${hillRollCommand.replace("!", "")}` );
        }
        if( hillRollRefresh ) {
            linkParams.push( `cooldown=${hillRollRefresh}000` );
        }
        if( isHillRollChatEnabled && chatOAuth ) {
            linkParams.push( `oauth=${chatOAuth}` );
            linkParams.push( `messageFormat=${messageFormat}` );
        }
        if( hideInstructions ) {
            linkParams.push( `hideInstructions=true` );
        }
        if( hideTimer ) {
            linkParams.push( `hideTime=true` );
        }
        break;
    case "confetti":
        if( confettiParty !== "0" ) {
            linkParams.push( `cpConfetti=true&cpConfettiCost=${confettiParty}&cpConfettiIntensity=${confettiIntensity}` );
        }
        if( confettiBubbles !== "0" ) {
            linkParams.push( `cpBubbles=true&cpBubblesCost=${confettiBubbles}&cpBubblesIntensity=${bubblesIntensity}` );
        }
        if( confettiBalloons !== "0" ) {
            linkParams.push( `cpBalloons=true&cpBalloonsCost=${confettiBalloons}&cpBalloonsIntensity=${balloonsIntensity}` );
        }
        if( confettiHearts !== "0" ) {
            linkParams.push( `cpHearts=true&cpHeartsCost=${confettiHearts}&cpHeartsIntensity=${heartsIntensity}` );
        }
        if( confettiVolume ) {
            linkParams.push( `volume=${confettiVolume}` );
        }
        linkParams.push( `colors=${Object.keys( confettiColors ).filter( x => confettiColors[ x ] ).join( "," )}` );
        linkParams.push( `oauth=${chatOAuth}` );
        break;
    }
    // console.log( linkParams );
    $( "#outputOverlayLink" ).val( baseLink + linkParams.join( "&" ) );
    $( "#copy-btn" ).attr( "data-clipboard-text", baseLink + linkParams.join( "&" ) );

    if( hasRestoredSettings ) {
        saveSettings();
    }
}

function getItemPreview( itemId, frame ) {
    let item = items[ itemId ];
    let dir = "";
    switch( item.type ) {
        case "add-on":
            return `https://www.pixelplush.dev/assets/add-ons/${item.path}`;
            // return `http://localhost:10000/add-ons/${item.path}`;
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
        console.log( result );
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
            // populateItemList();
            toastr.success( `You got ${items[ itemId ].name}!`, "Success", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
        }
    }
    catch( err ) {
        // console.log( err );
        toastr.error( err, "Error", { positionClass:"toast-bottom-right", containerId:"toast-bottom-right" } );
    }
}
