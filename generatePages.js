const fs = require( "fs" );
const pages = require( "./pages" );

const template = fs.readFileSync( `template_page.html` ).toString();
// console.log( template );
const menuItem = fs.readFileSync( `template_menu_item.html` ).toString().replace( /\r\n/g, "\n" );
const menuTemplate = fs.readFileSync( `template_left.html` ).toString().replace( /\r\n/g, "\n" );
const menuLiveTemplate = fs.readFileSync( `template_left_live.html` ).toString().replace( /\r\n/g, "\n" );

function generateMenu( page ) {
    let menuItems = "";
    Object.keys( pages ).forEach( p => {
        menuItems += menuItem
            .replace( /PAGE_FILE/g, p )
            .replace( /PAGE_LINK/g, pages[ p ].link )
            .replace( /PAGE_ICON/g, pages[ p ].icon )
            .replace( /PAGE_ACTIVE/g, page === p ? " active" : "" );
    });
    return menuItems;
}

Object.keys( pages ).forEach( p => {
    if( !pages[ p ].name ) { return; }
    // Generate Test Theme
    let menuItems = generateMenu( p ).replace( /^/gm, "        " );
    let pageMenu = pages[ p ].menu === "live" ? menuLiveTemplate : menuTemplate;
    const pageContent = fs.readFileSync( `pages/${p}.html` ).toString().replace( /\r\n/g, "\n" ).replace( /^/gm, "                                " );
    const pageScript = fs.readFileSync( `pages/${p}.js` ).toString().replace( /\r\n/g, "\n" ).replace( /^/gm, "        " );
    const output = template
        .replace( /PAGE_NAME/g, pages[ p ].name )
        .replace( /PAGE_FILE/g, p )
        .replace( /PAGE_MENU/g, pageMenu.replace( /MENU_ITEMS/g, menuItems ).replace( /^/gm, "                                " ) )
        .replace( /PAGE_CONTENT/g, pageContent )
        .replace( /PAGE_SCRIPT/g, pageScript );
    // console.log( output );
    fs.writeFileSync( `${p}.html`, output );
    console.log( `Saved ${p}.html` );
});
