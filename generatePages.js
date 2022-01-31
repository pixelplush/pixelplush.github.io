const fs = require( "fs" );
const pages = require( "./pages" );

const template = fs.readFileSync( `template_page.html` ).toString();
// console.log( template );
const menu = fs.readFileSync( `template_left.html` ).toString().replace( /\r\n/g, "\n" ).replace( /^/gm, "                                " );
const menuLive = fs.readFileSync( `template_left_live.html` ).toString().replace( /\r\n/g, "\n" ).replace( /^/gm, "                                " );

Object.keys( pages ).forEach( p => {
    // Generate Test Theme
    const pageContent = fs.readFileSync( `pages/${p}.html` ).toString().replace( /\r\n/g, "\n" ).replace( /^/gm, "                                " );
    const pageScript = fs.readFileSync( `pages/${p}.js` ).toString().replace( /\r\n/g, "\n" ).replace( /^/gm, "        " );
    const output = template
        .replace( /PAGE_NAME/g, pages[ p ].name )
        .replace( /PAGE_MENU/g, pages[ p ].menu === "live" ? menuLive : menu )
        .replace( /PAGE_CONTENT/g, pageContent )
        .replace( /PAGE_SCRIPT/g, pageScript );
    // console.log( output );
    fs.writeFileSync( `${p}.html`, output );
    console.log( `Saved ${p}.html` );
});
