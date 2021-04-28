const plushApiUrl = "https://api.pixelplush.dev/v1"; //"http://localhost:3000/v1";
let gameTitle = "PixelPlush Alerts";
let gameTheme = {};
let gameOptions = {};
let catalog = {};
let assetPath = "";
let pingInterval = null;
const NumFrames = 10;

const socket = new ReconnectingWebSocket( "wss://api.pixelplush.dev" );

socket.addEventListener( "open", function ( event ) {
    // socket.send('Hello Server!');
    if( pingInterval ) {
        clearInterval( pingInterval );
    }
    pingInterval = setInterval( () => {
        socket.send( JSON.stringify({
            type: "ping"
        }));
    }, 60000 * 5 ); // Ping every 5 mins
});

// Listen for messages
socket.addEventListener( "message", function ( event ) {
    let data = JSON.parse( event.data );
    // console.log( data );
    switch( data.data.type ) {
    case "item":
        showItemAlert( data.data.item, data.data.account.displayName );
        break;
    case "coins":
        showCoinAlert( data.data.amount, data.data.account.displayName );
        break;
    case "pong":
        break;
    default:
        console.log( data );
        break;
    }
});

function setupGame( title, theme, options ) {
  gameTitle = title;
  gameTheme = theme;
  gameOptions = options;

  assetPath = gameTheme.path || "";
}
window.setupGame = setupGame;

window.WebFontConfig = {
    custom: {
        families: [ "Pixellari" ]
    },
    active() {
        CreateGame();
    },
};

/* eslint-disable */
// include the web-font loader script
(function() {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'
    }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = 'true';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}());
/* eslint-enabled */

function Init() {
    // Add Initialization Here
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    Unicorn.Load( "alert_market_light", `${assetPath}/assets/alerts/alert_market_light.png` );
    Unicorn.Load( "alert_market_dark", `${assetPath}/assets/alerts/alert_market_dark.png` );
    Unicorn.Load( "alert_light", `${assetPath}/assets/alerts/alert_light.png` );
    Unicorn.Load( "alert_dark", `${assetPath}/assets/alerts/alert_dark.png` );
    for( let i = 0; i < 9; i++ ) {
        Unicorn.Load( `alert_coin_light${i}`, `${assetPath}/assets/alerts/alert_coin_light/alert_coin_light${i+1}.png` );
        Unicorn.Load( `alert_coin_dark${i}`, `${assetPath}/assets/alerts/alert_coin_dark/alert_coin_dark${i+1}.png` );
    }

    // showCoinAlert( 100, "Instafluff" );
    //
    // showItemAlert( {
    //     "id": "pet_rainbee",
    //     "group": "Rainbee",
    //     "name": "Rainbee",
    //     "description": "",
    //     "theme": "PixelPlush",
    //     "type": "pet",
    //     "path": "rainbee",
    //     "cost": 10000,
    //     "subscription": "MaayaInsane",
    //     "minIdle": 200,
    //     "maxIdle": 800,
    //     "hidden": true
    // }, "Maayainsane" );
    //
    // showItemAlert( {
    //     "id": "rabbit",
    //     "group": "Rabbit",
    //     "name": "Rabbit Outfit",
    //     "description": "",
    //     "theme": "Easter",
    //     "type": "character",
    //     "path": "rabbit",
    //     "cost": 20,
    //     "sale": true
    // }, "Maayainsane" );
    //
    // showItemAlert( {
    //     "id": "addon_streamweather",
    //     "group": "Stream Weather",
    //     "name": "Stream Weather",
    //     "description": "",
    //     "theme": "PixelPlush",
    //     "type": "add-on",
    //     "path": "streamweather.png",
    //     "cost": 20,
    //     "sale": true
    // }, "Maayainsane" );

    // const testObject = {
    //     "type": "message",
    //     "data": {
    //         "type": "item",
    //         "amount": 0,
    //         "account": {
    //             "_id": "6083148a36103f4a0972cdef",
    //             "key": "twitch_117433611",
    //             "coins": 0,
    //             "createdAt": "2021-04-23T18:40:10.331Z",
    //             "description": "",
    //             "displayName": "Enot_caHek",
    //             "offlineImage": "https://static-cdn.jtvnw.net/jtv_user_pictures/3c014db2-f7b5-4fcd-8d6b-9f477e03a73e-channel_offline_image-1920x1080.jpeg",
    //             "owned": [
    //                 "boy",
    //                 "girl"
    //             ],
    //             "platformId": "117433611",
    //             "profileImage": "https://static-cdn.jtvnw.net/jtv_user_pictures/adb0ec42-9b86-4257-9f37-04e3a736c5cf-profile_image-300x300.png",
    //             "specialCoins": 0,
    //             "type": "twitch",
    //             "updatedAt": "2021-04-26T21:10:40.439Z",
    //             "username": "enot_cahek",
    //             "style": {
    //                 "character": "boy"
    //             },
    //             "styles": {
    //                 "character": [
    //                     "boy"
    //                 ]
    //             }
    //         },
    //         "item": {
    //             "id": "instafluff",
    //             "group": "Instafluff",
    //             "name": "Instafluff",
    //             "description": "",
    //             "theme": "Streamer",
    //             "type": "character",
    //             "path": "insta",
    //             "cost": 0
    //         }
    //     }
    // };
    //
    // const testCoupon = {
    //     "type": "message",
    //     "data": {
    //         "type": "coupon",
    //         "amount": 0,
    //         "account": {
    //             "_id": "6083148a36103f4a0972cdef",
    //             "key": "twitch_117433611",
    //             "coins": 0,
    //             "createdAt": "2021-04-23T18:40:10.331Z",
    //             "description": "",
    //             "displayName": "Enot_caHek",
    //             "offlineImage": "https://static-cdn.jtvnw.net/jtv_user_pictures/3c014db2-f7b5-4fcd-8d6b-9f477e03a73e-channel_offline_image-1920x1080.jpeg",
    //             "owned": [
    //                 "boy",
    //                 "girl",
    //                 "instafluff"
    //             ],
    //             "platformId": "117433611",
    //             "profileImage": "https://static-cdn.jtvnw.net/jtv_user_pictures/adb0ec42-9b86-4257-9f37-04e3a736c5cf-profile_image-300x300.png",
    //             "specialCoins": 0,
    //             "type": "twitch",
    //             "updatedAt": "2021-04-26T21:15:20.984Z",
    //             "username": "enot_cahek",
    //             "style": {
    //                 "character": "boy"
    //             },
    //             "styles": {
    //                 "character": [
    //                     "boy"
    //                 ]
    //             }
    //         },
    //         "item": {
    //             "id": "instafluff",
    //             "group": "Instafluff",
    //             "name": "Instafluff",
    //             "description": "",
    //             "theme": "Streamer",
    //             "type": "character",
    //             "path": "insta",
    //             "cost": 0
    //         }
    //     }
    // };
    //
    // const testCoins = {
    //     "type": "message",
    //     "data": {
    //         "type": "coins",
    //         "amount": 10,
    //         "account": {
    //             "_id": "602fe46936103f4a09bf94f4",
    //             "key": "twitch_40387150",
    //             "coins": 10,
    //             "createdAt": "2021-02-19T16:16:41.153Z",
    //             "description": "ʜɪ, ɪ'ᴍ ᴅʀɪxʏᴀ ᴀɴᴅ ɪ'ᴍ ᴀ ꜰᴜʟʟ ᴛɪᴍᴇ ꜱᴛʀᴇᴀᴍᴇʀ , ɪ ᴘʟᴀʏ ᴊᴜꜱᴛ ᴅᴀɴᴄᴇ ᴀɴᴅ ᴀɴᴏᴛʜᴇʀ ᴋɪɴᴅ ᴏғ ғᴜɴɴʏ sᴛʀᴇᴀᴍs, ᴘᴀɪɴᴛɪɴɢ, ᴄᴏᴏᴋɪɴɢ sᴛʀᴇᴀᴍ . ʏᴏᴜ ᴄᴀɴ ᴄᴏɴᴛʀᴏʟ ᴍʏ ꜱᴛʀᴇᴀᴍ ᴡɪᴛʜ ᴄʜᴀɴɴᴇʟ ᴘᴏɪɴᴛꜱ, ᴛʜɪꜱ ɪꜱ ᴀ ᴜɴɪQᴜᴇ ꜱᴛʀᴇᴀᴍ ᴡɪᴛʜ ꜱᴇᴠᴇʀᴀʟ ᴅɪꜰꜰᴇʀᴇɴᴛ ʀᴇᴡᴀʀᴅꜱ ᴛᴏ ʜᴀᴠɪɴɢ ꜰᴜɴ ♡",
    //             "displayName": "Drixya",
    //             "offlineImage": "https://static-cdn.jtvnw.net/jtv_user_pictures/d959252f-7de9-410d-adef-291b8b840c73-channel_offline_image-1920x1080.jpeg",
    //             "owned": [
    //                 "boy",
    //                 "girl"
    //             ],
    //             "platformId": "40387150",
    //             "profileImage": "https://static-cdn.jtvnw.net/jtv_user_pictures/03d08250-2ad2-466b-9893-225e5a40103b-profile_image-300x300.png",
    //             "specialCoins": 0,
    //             "type": "twitch",
    //             "updatedAt": "2021-04-26T21:29:04.913Z",
    //             "username": "drixya",
    //             "style": {},
    //             "styles": {}
    //         },
    //         "cost": "2.00"
    //     }
    // };
    //
    // const testItem = {
    //     "type": "message",
    //     "data": {
    //         "type": "item",
    //         "amount": 10,
    //         "account": {
    //             "_id": "602fe46936103f4a09bf94f4",
    //             "key": "twitch_40387150",
    //             "coins": 10,
    //             "createdAt": "2021-02-19T16:16:41.153Z",
    //             "description": "ʜɪ, ɪ'ᴍ ᴅʀɪxʏᴀ ᴀɴᴅ ɪ'ᴍ ᴀ ꜰᴜʟʟ ᴛɪᴍᴇ ꜱᴛʀᴇᴀᴍᴇʀ , ɪ ᴘʟᴀʏ ᴊᴜꜱᴛ ᴅᴀɴᴄᴇ ᴀɴᴅ ᴀɴᴏᴛʜᴇʀ ᴋɪɴᴅ ᴏғ ғᴜɴɴʏ sᴛʀᴇᴀᴍs, ᴘᴀɪɴᴛɪɴɢ, ᴄᴏᴏᴋɪɴɢ sᴛʀᴇᴀᴍ . ʏᴏᴜ ᴄᴀɴ ᴄᴏɴᴛʀᴏʟ ᴍʏ ꜱᴛʀᴇᴀᴍ ᴡɪᴛʜ ᴄʜᴀɴɴᴇʟ ᴘᴏɪɴᴛꜱ, ᴛʜɪꜱ ɪꜱ ᴀ ᴜɴɪQᴜᴇ ꜱᴛʀᴇᴀᴍ ᴡɪᴛʜ ꜱᴇᴠᴇʀᴀʟ ᴅɪꜰꜰᴇʀᴇɴᴛ ʀᴇᴡᴀʀᴅꜱ ᴛᴏ ʜᴀᴠɪɴɢ ꜰᴜɴ ♡",
    //             "displayName": "Drixya",
    //             "offlineImage": "https://static-cdn.jtvnw.net/jtv_user_pictures/d959252f-7de9-410d-adef-291b8b840c73-channel_offline_image-1920x1080.jpeg",
    //             "owned": [
    //                 "boy",
    //                 "girl"
    //             ],
    //             "platformId": "40387150",
    //             "profileImage": "https://static-cdn.jtvnw.net/jtv_user_pictures/03d08250-2ad2-466b-9893-225e5a40103b-profile_image-300x300.png",
    //             "specialCoins": 0,
    //             "type": "twitch",
    //             "updatedAt": "2021-04-26T21:29:04.913Z",
    //             "username": "drixya",
    //             "style": {},
    //             "styles": {}
    //         },
    //         "item": {
    //             "id": "addon_parachute_blossoms",
    //             "group": "Parachute Drop",
    //             "name": "Spring Blossoms Theme (Parachute Drop)",
    //             "description": "",
    //             "theme": "PixelPlush",
    //             "type": "add-on",
    //             "path": "parachutedrop_spring.png",
    //             "cost": 10
    //         }
    //     }
    // };

    // const testLongName = {
    //     "id": "addon_parachute_blossoms",
    //     "group": "Parachute Drop",
    //     "name": "Spring Blossoms Theme (Parachute Drop)",
    //     "description": "",
    //     "theme": "PixelPlush",
    //     "type": "add-on",
    //     "path": "parachutedrop_spring.png",
    //     "cost": 10
    // };
    //
    // showItemAlert( testLongName, "Maayainsane" );

    // showItemAlert( testObject.data.item, testObject.data.account.displayName );
}

let alertQueue = []; // TODO: Add alert queue
let itemCache = [];
let alertCounter = 0;
const framerate = 0.5 * 16 / 60;
const alertTime = 5.0;
function showItemAlert( item, name ) {
    alertCounter++;
    // catalog[ body.item ].type === "add-on" ? dir : `https://www.pixelplush.dev/assets/${dir}/${catalog[ body.item ].path}_front/${catalog[ body.item ].path}_front1.png`
    const x = 100, y = -400;
    const alertId = alertCounter;
    let alertBG = Unicorn.AddBacklay( "alert_" + alertId, "alert_market_dark", x, y, {
        scale: { x: 3, y: 3 }
    } );

    if( !itemCache[ item.id ] ) {
        itemCache[ item.id ] = item.path;
        if( item.type === "add-on" ) {
            Unicorn.Load( `${item.id}`, `${assetPath}/assets/${item.type}s/${item.path}` );
        }
        else {
            // Load frames
            for( let i = 0; i < NumFrames; i++ ) {
                let name = item.path;
                let folder = item.id.replace( "pet_", "" );
                Unicorn.Load( `${item.id}_${i}`, `${assetPath}/assets/${item.type}s/${folder}/${item.path}_front/${item.path}_front${i+1}.png` );
            }
        }
    }

    let alertItem = Unicorn.AddObject( "alertitem_" + alertId, {
        type: "circle",
        scale: { x: 3, y: 3 },
        animations: {
            "front": {
                framerate: framerate,
                frames: item.type === "add-on" ? [ item.id ] : [ ...Array( NumFrames ).keys() ].map( i => `${item.id}_${i}` ),
                loop: true
            },
        },
        x: x + 90, y: y + 90, z: 0,
        // width: 36, height: 88
        radius: 36,
        isStatic: true
    } );
    let alertName = Unicorn.AddText( "alertname_" + alertId, name, x + 200, y + 40, {
        fontFamily: 'Pixellari',
        fontSize: 42,
        // fontWeight: 'bold',
        fill: "#f95f5d",
        lineJoin: "round",
        // stroke: "#ff6666",
        // strokeThickness: 6,
    } );
    let alertText = Unicorn.AddText( "alerttext_" + alertId, "just got", x + 210 + alertName.width, y + 40, {
        fontFamily: 'Pixellari',
        fontSize: 42,
        // fontWeight: 'bold',
        fill: "#663931",
        lineJoin: "round",
    } );
    let alertItemName = Unicorn.AddText( "alertitemname_" + alertId, item.name.toUpperCase(), x + 200, y + 100, {
        fontFamily: 'Pixellari',
        fontSize: 42,
        // fontWeight: 'bold',
        fill: "#3a4b62",
        lineJoin: "round",
    } );

    // Center the text
    const alertWidth = 759 - 200;
    let textWidth = alertName.width + alertText.width + 10;
    alertName.position.x = x + 170 + ( alertWidth - textWidth ) / 2;
    alertText.position.x = alertName.position.x + 10 + alertName.width;
    if( alertItemName.width < alertWidth ) {
        alertItemName.position.x = x + 170 + ( alertWidth - alertItemName.width ) / 2;
    }
    else {
        // Adjust to fit the width
        let scale = alertWidth / alertItemName.width;
        alertItemName.scale.x = scale;
        alertItemName.scale.y = scale;
        alertItemName.position.x = x + 170;
    }

    alertQueue.push( {
        elements: [ alertBG, alertItem, alertName, alertText, alertItemName ],
        yOffsets: [ 0, 90, 40, 40, 100 ],
        time: alertTime,
        cleanup: () => {
            Unicorn.RemoveBacklay( "alert_" + alertId );
            Unicorn.RemoveObject( "alertitem_" + alertId );
            Unicorn.RemoveText( "alertname_" + alertId );
            Unicorn.RemoveText( "alerttext_" + alertId );
            Unicorn.RemoveText( "alertitemname_" + alertId );
        }
    });
}

function showCoinAlert( coins, name ) {
    alertCounter++;
    // catalog[ body.item ].type === "add-on" ? dir : `https://www.pixelplush.dev/assets/${dir}/${catalog[ body.item ].path}_front/${catalog[ body.item ].path}_front1.png`
    const x = 100, y = -400;
    const alertId = alertCounter;
    let alertBG = Unicorn.AddObject( "alert_" + alertId, {
        type: "circle",
        scale: { x: 3, y: 3 },
        animations: {
            "front": {
                framerate: framerate,
                frames: [ ...Array( 9 ).keys() ].map( i => `alert_coin_dark${i}` ),
                loop: true
            },
        },
        x: x + 379.5, y: y + 88.5, z: 100,
        // width: 36, height: 88
        radius: 36,
        isStatic: true
    } );

    let alertName = Unicorn.AddText( "alertname_" + alertId, name, x + 200, y + 40, {
        fontFamily: 'Pixellari',
        fontSize: 42,
        // fontWeight: 'bold',
        fill: "#f95f5d",
        lineJoin: "round",
        // stroke: "#ff6666",
        // strokeThickness: 6,
    } );
    let alertText = Unicorn.AddText( "alerttext_" + alertId, "just got", x + 210 + alertName.width, y + 40, {
        fontFamily: 'Pixellari',
        fontSize: 42,
        // fontWeight: 'bold',
        fill: "#663931",
        lineJoin: "round",
    } );
    let alertItemName = Unicorn.AddText( "alertitemname_" + alertId, `${coins} PLUSHCOINS`, x + 200, y + 100, {
        fontFamily: 'Pixellari',
        fontSize: 42,
        // fontWeight: 'bold',
        fill: "#3a4b62",
        lineJoin: "round",
    } );

    // Center the text
    const alertWidth = 759;
    let textWidth = alertName.width + alertText.width + 10;
    alertName.position.x = x + ( alertWidth - textWidth ) / 2;
    alertText.position.x = alertName.position.x + 10 + alertName.width;
    alertItemName.position.x = x + ( alertWidth - alertItemName.width ) / 2;

    alertQueue.push( {
        elements: [ alertBG, alertName, alertText, alertItemName ],
        yOffsets: [ 88.5, 40, 40, 100 ],
        time: alertTime,
        cleanup: () => {
            Unicorn.RemoveObject( "alert_" + alertId );
            Unicorn.RemoveText( "alertname_" + alertId );
            Unicorn.RemoveText( "alerttext_" + alertId );
            Unicorn.RemoveText( "alertitemname_" + alertId );
        }
    });
}

function Update( timestamp, timeDiffInMs ) {
    const timeDiff = timeDiffInMs / 1000;

    if( alertQueue.length > 0 ) {
        // Animate the top one
        alertQueue[ 0 ].time -= timeDiff;
        if( alertQueue[ 0 ].time <= 0 ) {
            let item = alertQueue.shift();
            item.cleanup();
        }
        else {
            const offset = Math.min( 500, 1200 * Math.sin( Math.PI * alertQueue[ 0 ].time / alertTime ) );
            alertQueue[ 0 ].elements.forEach( ( e, i ) => {
                e.position.y = -400 + alertQueue[ 0 ].yOffsets[ i ] + offset;
            });
        }
    }
}

async function OnChatCommand( user, command, message, flags, extra ) {
    if( ( flags.broadcaster || flags.mod ) &&
    	( command === "resetplushalert" ) ) {
    	location.reload();
    }
	if( ( flags.broadcaster || flags.mod ) &&
        ( command === "testitemalert" ) ) {
        // Show Alert
        // showCoinAlert( 100, "Instafluff" );
        //
        // showItemAlert( {
        //     "id": "pet_rainbee",
        //     "group": "Rainbee",
        //     "name": "Rainbee",
        //     "description": "",
        //     "theme": "PixelPlush",
        //     "type": "pet",
        //     "path": "rainbee",
        //     "cost": 10000,
        //     "subscription": "MaayaInsane",
        //     "minIdle": 200,
        //     "maxIdle": 800,
        //     "hidden": true
        // }, "Maayainsane" );
        //
        showItemAlert( {
            "id": "rabbit",
            "group": "Rabbit",
            "name": "Rabbit Outfit",
            "description": "",
            "theme": "Easter",
            "type": "character",
            "path": "rabbit",
            "cost": 20,
            "sale": true
        }, user );
        //
        // showItemAlert( {
        //     "id": "addon_streamweather",
        //     "group": "Stream Weather",
        //     "name": "Stream Weather",
        //     "description": "",
        //     "theme": "PixelPlush",
        //     "type": "add-on",
        //     "path": "streamweather.png",
        //     "cost": 20,
        //     "sale": true
        // }, "Maayainsane" );
    }
	if( ( flags.broadcaster || flags.mod ) &&
        ( command === "testcoinalert" ) ) {
        // Show Alert
        showCoinAlert( 100, user );
    }
}

let messageCounter = 0;

function OnChatMessage( user, message, flags, self, extra ) {
}

function getRandomInt( num ) {
    return Math.floor( num * Math.random() );
}

async function validateTwitchToken( token ) {
    return await fetch( "https://id.twitch.tv/oauth2/validate", {
        headers: {
            Authorization: `OAuth ${token}`
        }
    } )
    .then( r => r.json() )
    .catch( error => {
        // Auth Failed
        return {
            error: error
        };
    });
}

let clientId = "";

async function CreateGame() {
	try {
        catalog = await fetch( "https://www.pixelplush.dev/assets/catalog.json", {
        // catalog = await fetch( "http://localhost:10000/catalog.json", {
        }).then( r => r.json() );

        Unicorn.Create( "unicorn-display", {
            width: 1920,
            height: 1080,
            // background: "#777777",// "transparent",
            background: "transparent",
            init: Init,
            update: Update,
            channel: gameOptions.channel,
            username: gameOptions.oauth ? gameOptions.channel : undefined,
            password: gameOptions.oauth ? gameOptions.oauth.replace( "oauth:", "" ) : undefined,
            onCommand: OnChatCommand,
            onChat: OnChatMessage,
            gravity: { x: 0, y: 0 }
        });
        ComfyJS.onConnected = async ( address, port, isFirstConnect ) => {
            if( isFirstConnect ) {
                if( gameOptions.oauth ) {
                    // Validate and check expiration
                    let result = await validateTwitchToken( gameOptions.oauth.replace( "oauth:", "" ) );
                    clientId = result.client_id;
                    if( ![ "user:read:email", "chat:read", "chat:edit", "channel:manage:redemptions", "channel:read:redemptions" ].every( v => result.scopes.includes( v ) ) ) {
                        console.log( "Need more permissions" );
                    }
                    if( result.expires_in < 60 * 30 ) {
                        // Will expire in 30 days. Need to generate a new link!
                        console.log( "Token expires soon. Need to generate new link" );
                    }
                }
            }
        };
    }
    catch( err ) {
        console.log( err );
    }
}

window.setupGame = setupGame;
