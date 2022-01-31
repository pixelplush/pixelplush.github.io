const params = new URLSearchParams( location.search );
const clientId = "8m07ghhogjy0q09moeunnpdu51i60n";
const baseUrl = window.location.origin;
const plushApiUrl = "https://api.pixelplush.dev/v1"; //"http://localhost:3000/v1";
let twitch = {};
let account = {};

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
});