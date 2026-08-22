const fs = require('fs');
const path = require('path');

const repositoryRoot = path.resolve(__dirname, '..');
const exportRoots = ['v2']
  .map((directory) => path.join(repositoryRoot, directory))
  .filter((directory) => fs.existsSync(directory));

const requiredScopes = [
  'user:read:email',
  'chat:read',
  'chat:edit',
  'channel:manage:redemptions',
  'channel:read:redemptions',
];

const permissionsCopy = [
  {
    grantPermissions: 'Grant Twitch Permissions',
    permissionsRequired: 'Additional Twitch permissions are required for chat and Channel Point features.',
  },
  {
    grantPermissions: 'Twitch-Berechtigungen erteilen',
    permissionsRequired: 'Fuer Chat- und Kanalpunktefunktionen sind zusaetzliche Twitch-Berechtigungen erforderlich.',
  },
  {
    grantPermissions: 'Udelit opravneni Twitch',
    permissionsRequired: 'Pro funkce chatu a vernostnich bodu jsou vyzadovana dalsi opravneni Twitch.',
  },
  {
    grantPermissions: 'Twitch Izinleri Ver',
    permissionsRequired: 'Sohbet ve Kanal Puani ozellikleri icin ek Twitch izinleri gereklidir.',
  },
  {
    grantPermissions: 'Conceder permisos de Twitch',
    permissionsRequired: 'Se necesitan permisos adicionales de Twitch para las funciones de chat y Puntos de canal.',
  },
];

const themeMarketIcons = {
  giveawaycolors: 'icon_giveaway_bundle.gif',
  giveawayblue: 'icon_giveaway_blue.png',
  giveawaybw: 'icon_giveaway_bw.png',
  giveawaygreen: 'icon_giveaway_green.png',
  giveawayorange: 'icon_giveaway_orange.png',
  giveawaypink: 'icon_giveaway_pink.png',
  giveawaypurple: 'icon_giveaway_purple.png',
  giveawayred: 'icon_giveaway_red.png',
  giveawayyellow: 'icon_giveaway_yellow.png',
  addon_giveaway_blue: 'icon_giveaway_blue.png',
  addon_giveaway_blossoms: 'icon_giveaway_blossoms.png',
  addon_giveaway_autumn: 'icon_giveaway_autumn.png',
  addon_streamweather: 'icon_weather.png',
  addon_pixelconfetti: 'confetti_icon.png',
  addon_plinko_halloween: 'plinko_halloween3.png',
  addon_parachute_blossoms: 'parachutedrop_spring.png',
  addon_parachute_rainbow: 'rainbow.png',
  addon_parachute_cauldron: 'icon_cauldron.gif',
  addon_parachute_christmaseve: 'parachutes_christmas_eve.png',
  addon_parachute_valentines_brown_gold: 'bunny_brown_gold.png',
  addon_parachute_valentines_brown_pink: 'bunny_brown_pink.png',
  addon_parachute_valentines_brown_red: 'bunny_brown_red.png',
  addon_parachute_valentines_white_gold: 'bunny_white_gold.png',
  addon_parachute_valentines_white_pink: 'bunny_white_pink.png',
  addon_parachute_valentines_white_red: 'bunny_white_red.png',
  addon_parachute_eastercandy: 'easter_icon_1.png',
  addon_parachute_easterchoco: 'easter_icon_2.png',
  addon_parachute_eastersweets: 'easter_icon_3.png',
  addon_parachute_eastermarshmallow: 'easter_icon_4.png',
  addon_parachute_eastercotton: 'easter_icon_5.png',
  addon_parachute_easterdots: 'easter_icon_6.png',
  addon_parachute_poolfrog: 'pool_icon_market_frog.png',
  addon_parachute_poolmelon: 'pool_icon_market_melon.png',
  addon_parachute_poolrainbow: 'pool_icon_market_rainbow.png',
  addon_parachute_pooldots: 'pool_icon_market_rainbowdots.png',
  addon_parachute_poolsparklypink: 'pool_icon_market_pink.png',
  addon_parachute_poolsparklypurple: 'pool_icon_market_purple.png',
  addon_parachute_poolyellow: 'pool_icon_market_yellow.png',
  addon_parachute_cakerainbow: 'icon_cake_rainbow.png',
  addon_parachute_cakefruit: 'icon_cake_fruit.png',
  addon_parachute_cakechoco: 'icon_cake_choco2.png',
  addon_parachute_cakeplush: 'icon_cake_pixelplush.png',
  addon_chatflakes: 'icon_chatflakes.png',
};

const previousMarketPreviewHelpers = 'function _startPreviewAnimation(e){let t=e.currentTarget,s=t.src.match(/^(.*_front)(\\d+)(\\.png(?:\\?.*)?)$/);if(!s||t.dataset.previewTimer||"1"===t.dataset.previewMax)return;t.dataset.previewOriginal=t.src;let a=2,r=()=>{if(!t.dataset.previewOriginal)return;let e=Number(t.dataset.previewMax||0);e>1&&a>e&&(a=1);let o="".concat(s[1]).concat(a).concat(s[3]);if(1===a){t.src=o,a=2,t.dataset.previewTimer=String(window.setTimeout(r,180));return}let n=new window.Image;n.onload=()=>{t.dataset.previewOriginal&&(t.src=o,a+=1,t.dataset.previewTimer=String(window.setTimeout(r,180)))},n.onerror=()=>{if(!t.dataset.previewOriginal)return;let e=a-1;t.dataset.previewMax=String(e),a=1,e>1?t.dataset.previewTimer=String(window.setTimeout(r,180)):_stopPreviewAnimation({currentTarget:t})},n.src=o};t.dataset.previewTimer=String(window.setTimeout(r,180))}function _stopPreviewAnimation(e){let t=e.currentTarget;t.dataset.previewTimer&&window.clearTimeout(Number(t.dataset.previewTimer)),t.dataset.previewOriginal&&(t.src=t.dataset.previewOriginal),delete t.dataset.previewTimer,delete t.dataset.previewOriginal}';
const marketPreviewHelpers = 'function _startPreviewAnimation(e){let t=e.currentTarget;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let s=t.src.match(/^(.*_front)(\\d+)(\\.png(?:\\?.*)?)$/);if(!s||t.dataset.previewTimer||"1"===t.dataset.previewMax)return;let a=String(Number(t.dataset.previewRun||0)+1);t.dataset.previewRun=a,t.dataset.previewOriginal=t.src;let r=2,o=()=>t.dataset.previewRun===a&&!!t.dataset.previewOriginal,n=()=>{if(!o())return;let e=Number(t.dataset.previewMax||0);e>1&&r>e&&(r=1);let i="".concat(s[1]).concat(r).concat(s[3]);if(1===r){t.src=i,r=2,t.dataset.previewTimer=String(window.setTimeout(n,180));return}let l=new window.Image;l.onload=()=>{o()&&(t.src=i,r+=1,t.dataset.previewTimer=String(window.setTimeout(n,180)))},l.onerror=()=>{if(!o())return;let e=r-1;t.dataset.previewMax=String(e),r=1,e>1?t.dataset.previewTimer=String(window.setTimeout(n,180)):_stopPreviewAnimation({currentTarget:t})},l.src=i};t.dataset.previewTimer=String(window.setTimeout(n,180))}function _stopPreviewAnimation(e){let t=e.currentTarget;t.dataset.previewRun=String(Number(t.dataset.previewRun||0)+1),t.dataset.previewTimer&&window.clearTimeout(Number(t.dataset.previewTimer)),t.dataset.previewOriginal&&(t.src=t.dataset.previewOriginal),delete t.dataset.previewTimer,delete t.dataset.previewOriginal}';
const clarityLoader = '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","wdlmotp71n");';
const clarityHeadNode = JSON.stringify([
  '$',
  'head',
  null,
  { children: ['$', '$L2', null, { id: 'clarity', strategy: 'afterInteractive', children: clarityLoader }] },
]);
const emptyHeadNode = JSON.stringify(['$', 'head', null, {}]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function replaceExact(content, oldValue, newValue, label, expected = 1) {
  const occurrences = content.split(oldValue).length - 1;
  if (occurrences !== expected) {
    throw new Error(`${label}: expected ${expected} occurrence(s), found ${occurrences}`);
  }
  return content.replaceAll(oldValue, newValue);
}

function replaceOptional(content, oldValue, newValue) {
  return content.includes(oldValue) ? content.replaceAll(oldValue, newValue) : content;
}

function patchAuthBundle(content) {
  const scopeLiteral = JSON.stringify(requiredScopes);
  content = replaceExact(
    content,
    'c="https://api.pixelplush.dev/v1",u=(0,a.createContext)({isLoading:!0,isLoggedIn:!1,token:null,account:null,login:()=>{},logout:()=>{},refreshAccount:async()=>{}})',
    `c="https://api.pixelplush.dev/v1",q=${scopeLiteral},u=(0,a.createContext)({isLoading:!0,isLoggedIn:!1,hasRequiredScopes:!1,token:null,account:null,login:()=>{},logout:()=>{},refreshAccount:async()=>{}})`,
    'auth context'
  );
  content = replaceExact(
    content,
    'window.ComfyTwitch.Login(o,"".concat(e,"/redirect/"),[],"code")',
    'window.ComfyTwitch.Logout(),window.ComfyTwitch.Login(o,"".concat(e,"/redirect/"),q,"code")',
    'auth login scopes',
    2
  );
  return replaceExact(
    content,
    'value:{isLoading:n,isLoggedIn:d,token:h,account:y,login:_,logout:b,refreshAccount:C}',
    'value:{isLoading:n,isLoggedIn:d,hasRequiredScopes:!!(g&&window.ComfyTwitch&&q.every(e=>window.ComfyTwitch.Scopes.includes(e))),token:h,account:y,login:_,logout:b,refreshAccount:C}',
    'auth provider value'
  );
}

function patchNullScopeHandling(content) {
  content = replaceOptional(
    content,
    'o.Scopes=n.scopes',
    'o.Scopes=Array.isArray(n.scopes)?n.scopes:[]'
  );
  content = replaceOptional(
    content,
    'hasRequiredScopes:!!(g&&window.ComfyTwitch&&q.every(e=>window.ComfyTwitch.Scopes.includes(e)))',
    'hasRequiredScopes:!!(g&&window.ComfyTwitch&&Array.isArray(window.ComfyTwitch.Scopes)&&q.every(e=>window.ComfyTwitch.Scopes.includes(e)))'
  );
  return replaceOptional(
    content,
    'Array.isArray(window.ComfyTwitch.Scopes)&&Array.isArray(window.ComfyTwitch.Scopes)',
    'Array.isArray(window.ComfyTwitch.Scopes)'
  );
}

function patchGamesBundle(content) {
  content = replaceExact(
    content,
    '{isLoggedIn:m,account:c,token:g}=(0,d.A)()',
    '{isLoggedIn:m,hasRequiredScopes:W,account:c,token:g,login:R}=(0,d.A)()',
    'games auth state'
  );
  content = replaceExact(
    content,
    ',e.seasonal&&c[e.seasonal]&&(0,s.jsx)("span",{className:"ml-1 text-[10px] ".concat(c[e.seasonal].color," rounded px-1"),children:c[e.seasonal].emoji})',
    '',
    'seasonal theme emoji'
  );
  content = replaceExact(
    content,
    ']})]}),r.themes.length>1&&',
    ']})]}),m&&!W&&(0,s.jsxs)("div",{className:"rounded-lg border border-amber-300 bg-amber-50 p-3",children:[(0,s.jsx)("p",{className:"mb-2 text-xs text-amber-800",children:h("games.permissionsRequired")}),(0,s.jsx)("button",{type:"button",onClick:R,className:"rounded-lg bg-[#9146ff] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#772ce8]",children:h("games.grantPermissions")})]}),r.themes.length>1&&',
    'permissions prompt'
  );
  content = replaceExact(
    content,
    'type:"button",onClick:()=>k(!_),className:',
    'type:"button","aria-expanded":_,"aria-controls":"game-settings-panel",onClick:()=>k(!_),className:',
    'settings disclosure semantics'
  );
  return replaceExact(
    content,
    '_&&(0,s.jsx)("div",{className:"mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"',
    '_&&(0,s.jsx)("div",{id:"game-settings-panel",className:"mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"',
    'settings panel semantics'
  );
}

function patchGamesAccessibility(content) {
  content = replaceExact(
    content,
    'type:"button",onClick:()=>k(!_),className:',
    'type:"button","aria-expanded":_,"aria-controls":"game-settings-panel",onClick:()=>k(!_),className:',
    'settings disclosure semantics'
  );
  return replaceExact(
    content,
    '_&&(0,s.jsx)("div",{className:"mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"',
    '_&&(0,s.jsx)("div",{id:"game-settings-panel",className:"mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"',
    'settings panel semantics'
  );
}

function patchThemeSelectorAccessibility(content) {
  content = replaceExact(
    content,
    '"label",{className:"mb-1 block text-xs font-medium text-[var(--color-pp-text-muted)]",children:h("games.themeLabel")}',
    '"label",{htmlFor:"theme-select",className:"mb-1 block text-xs font-medium text-[var(--color-pp-text-muted)]",children:h("games.themeLabel")}',
    'theme selector label'
  );
  content = replaceExact(
    content,
    '"select",{value:i,onChange:e=>n(e.target.value),className:',
    '"select",{id:"theme-select",value:i,onChange:e=>n(e.target.value),className:',
    'theme selector id'
  );
  return content;
}

function patchLayoutAccessibility(content) {
  return replaceExact(
    content,
    '"button",{onClick:()=>h(!a),className:"flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[var(--color-pp-card-hover)] transition-colors text-sm text-[var(--color-pp-text)]"',
    '"button",{type:"button","aria-label":"Language: ".concat(null==N?"English":N.name),"aria-expanded":a,onClick:()=>h(!a),className:"flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[var(--color-pp-card-hover)] transition-colors text-sm text-[var(--color-pp-text)]"',
    'language menu name'
  );
}

function patchScoresAccessibility(content) {
  content = replaceExact(
    content,
    '"label",{className:"mb-1 block text-sm font-medium text-[var(--color-pp-text-muted)]",children:e("scores.timeRange")}',
    '"label",{htmlFor:"score-time-range",className:"mb-1 block text-sm font-medium text-[var(--color-pp-text-muted)]",children:e("scores.timeRange")}',
    'score time-range label'
  );
  content = replaceExact(
    content,
    '"select",{value:i,onChange:e=>d(e.target.value),className:',
    '"select",{id:"score-time-range",value:i,onChange:e=>d(e.target.value),className:',
    'score time-range select'
  );
  content = replaceExact(
    content,
    '"label",{className:"mb-1 block text-sm font-medium text-[var(--color-pp-text-muted)]",children:e("scores.theme")}',
    '"label",{htmlFor:"score-theme",className:"mb-1 block text-sm font-medium text-[var(--color-pp-text-muted)]",children:e("scores.theme")}',
    'score theme label'
  );
  return replaceExact(
    content,
    '"select",{value:p,onChange:e=>h(e.target.value),className:',
    '"select",{id:"score-theme",value:p,onChange:e=>h(e.target.value),className:',
    'score theme select'
  );
}

function patchThemeMarketIcons(content) {
  const marketIconsLiteral = JSON.stringify(themeMarketIcons);
  content = replaceExact(
    content,
    '};function u(e,a){return e.replace("(Free)",a("gameData.freeTag")).replace("(Premium)",a("gameData.premiumTag"))}let g=',
    `};let _themeMarketIcons=${marketIconsLiteral};function _themeIcon(e){let a=_themeMarketIcons[e.key]||_themeMarketIcons[e.requires];return a?"https://cdn.pixelplush.dev/assets/add-ons/".concat(a):e.preview}function u(e,a){return e.replace("(Free)",a("gameData.freeTag")).replace("(Premium)",a("gameData.premiumTag"))}let g=`,
    'theme market icon map'
  );
  return replaceExact(content, '(0,m.Q)(e.preview)', '(0,m.Q)(_themeIcon(e))', 'theme pill icon');
}

function patchMarketBundle(content) {
  content = replaceExact(
    content,
    '}}function b(){',
    `}}${marketPreviewHelpers}function b(){`,
    'market preview helpers'
  );
  content = replaceExact(
    content,
    'className:"pixelated ".concat(o?"object-contain":""),unoptimized:!0})',
    'className:"pixelated ".concat(o?"object-contain":""),unoptimized:!0,onMouseEnter:_startPreviewAnimation,onMouseLeave:_stopPreviewAnimation})',
    'market preview handlers'
  );
  content = replaceOptional(content, 'o?"h-32":"h-20"', '"h-20"');
  content = replaceOptional(content, 'width:o?120:48,height:o?80:48', 'width:o?72:48,height:o?64:48');
  content = replaceOptional(
    content,
    ',!r&&(0,a.jsx)(a.Fragment,{children:',
    ',(0,a.jsx)(a.Fragment,{children:'
  );
  return content;
}

function upgradeMarketPreviewAnimation(content) {
  return replaceExact(
    content,
    previousMarketPreviewHelpers,
    marketPreviewHelpers,
    'market preview animation upgrade'
  );
}

function patchTransactionStatusAuth(content) {
  content = replaceExact(
    content,
    'fetch("".concat(p,"/transactions/status?id=").concat(a)).then',
    'fetch("".concat(p,"/transactions/status?id=").concat(a),{headers:{Twitch:b}}).then',
    'Stripe transaction status auth'
  );
  return replaceExact(
    content,
    'fetch("".concat(p,"/transactions/status?id=").concat(s.transactionId)).then',
    'fetch("".concat(p,"/transactions/status?id=").concat(s.transactionId),{headers:{Twitch:b}}).then',
    'PayPal transaction status auth'
  );
}

function patchHomeBundle(content) {
  content = replaceExact(
    content,
    '[r,m]=(0,n.useState)(0);(0,n.useEffect)(()=>{if(a.images.length<=1)return;let e=setInterval(()=>{m(e=>(e+1)%a.images.length)},3e3);return()=>clearInterval(e)},[a.images.length]);',
    '[r,m]=(0,n.useState)(0),[p,g]=(0,n.useState)(!1),[v,_]=(0,n.useState)(!1);(0,n.useEffect)(()=>{if(p||v||a.images.length<=1||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let e=setInterval(()=>{m(e=>(e+1)%a.images.length)},3e3);return()=>clearInterval(e)},[a.images.length,p,v]);',
    'carousel pause state'
  );
  content = replaceExact(
    content,
    'className:"pp-card overflow-hidden flex flex-col",children:',
    'className:"pp-card overflow-hidden flex flex-col",onMouseEnter:()=>g(!0),onMouseLeave:()=>g(!1),onFocus:()=>_(!0),onBlur:e=>{e.currentTarget.contains(e.relatedTarget)||_(!1)},children:',
    'carousel interaction pause'
  );
  content = replaceExact(
    content,
    '"button",{onClick:()=>m(a),className:"h-2 w-2 rounded-full transition-colors ".concat(a===r?"bg-white":"bg-white/40")}',
    '"button",{type:"button","aria-label":"Show slide ".concat(a+1),"aria-current":a===r?"true":void 0,onClick:()=>m(a),className:"h-2 w-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ".concat(a===r?"bg-white":"bg-white/40")}',
    'carousel dot semantics'
  );
  content = replaceOptional(content, 'className:"p-5 text-center text-white"', 'className:"p-5 text-center text-[var(--color-pp-headings)]"');
  content = replaceOptional(content, 'className:"text-xl font-bold mb-3 !text-white"', 'className:"text-xl font-bold mb-3 text-[var(--color-pp-headings)]"');
  return replaceOptional(content, 'className:"text-sm mb-4 text-white/90"', 'className:"text-sm mb-4 text-[var(--color-pp-text)]"');
}

function upgradeCarouselPauseState(content) {
  content = replaceExact(
    content,
    '[r,m]=(0,n.useState)(0),[p,g]=(0,n.useState)(!1);(0,n.useEffect)(()=>{if(p||a.images.length<=1||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let e=setInterval(()=>{m(e=>(e+1)%a.images.length)},3e3);return()=>clearInterval(e)},[a.images.length,p]);',
    '[r,m]=(0,n.useState)(0),[p,g]=(0,n.useState)(!1),[v,_]=(0,n.useState)(!1);(0,n.useEffect)(()=>{if(p||v||a.images.length<=1||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let e=setInterval(()=>{m(e=>(e+1)%a.images.length)},3e3);return()=>clearInterval(e)},[a.images.length,p,v]);',
    'carousel independent pause state'
  );
  return replaceExact(
    content,
    'onMouseEnter:()=>g(!0),onMouseLeave:()=>g(!1),onFocus:()=>g(!0),onBlur:e=>{e.currentTarget.contains(e.relatedTarget)||g(!1)}',
    'onMouseEnter:()=>g(!0),onMouseLeave:()=>g(!1),onFocus:()=>_(!0),onBlur:e=>{e.currentTarget.contains(e.relatedTarget)||_(!1)}',
    'carousel independent pause handlers'
  );
}

function patchLayoutBundle(content) {
  content = replaceExact(
    content,
    'src:(0,c.Q)("/app-assets/images/icon/maaya.gif"),alt:"",width:24,height:24',
    'src:(0,c.Q)("/app-assets/images/icon/maaya.gif"),alt:"",width:30,height:30',
    'Maaya portrait'
  );
  return replaceExact(
    content,
    'src:(0,c.Q)("/app-assets/images/icon/instafluff.gif"),alt:"",width:26,height:26',
    'src:(0,c.Q)("/app-assets/images/icon/instafluff.gif"),alt:"",width:30,height:30',
    'Instafluff portrait'
  );
}

function patchLinks(content) {
  content = replaceOptional(content, 'Twitter / X', 'Bluesky');
  content = replaceOptional(content, 'https://twitter.com/pixelplushgames', 'https://bsky.app/profile/pixelplushgames.bsky.social');
  content = replaceOptional(
    content,
    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.996C2.566.944 1.561 1.266.902 1.565.139 1.9 0 3.008 0 3.656c0 .65.36 5.424.6 6.205.784 2.624 3.566 3.51 6.116 3.066-4.35.756-5.485 3.26-3.083 5.764 4.58 4.763 6.458-1.02 6.97-2.292.512 1.272 2.39 7.055 6.97 2.292 2.402-2.504 1.267-5.008-3.083-5.764 2.55.444 5.332-.442 6.116-3.066.24-.78.6-5.555.6-6.205 0-.648-.139-1.757-.902-2.09-.659-.3-1.664-.622-4.3 1.24C16.046 4.748 13.087 8.686 12 10.8Z'
  );
  return replaceOptional(content, 'bg-slate-500/20 text-slate-300 hover:bg-slate-500/30', 'bg-[#1185fe]/15 text-[#1185fe] hover:bg-[#1185fe]/25');
}

function patchLocaleBundle(content) {
  let localeIndex = 0;
  const patched = content.replace(/JSON\.parse\('((?:\\.|[^'])*)'\)/g, (match, encoded) => {
    const decoded = Function(`"use strict"; return '${encoded}'`)();
    const locale = JSON.parse(decoded);
    if (!locale.games) return match;
    const copy = permissionsCopy[localeIndex++];
    if (!copy) throw new Error('Unexpected extra locale bundle');
    locale.games.grantPermissions = copy.grantPermissions;
    locale.games.permissionsRequired = copy.permissionsRequired;
    const serialized = JSON.stringify(locale)
      .replaceAll('\\', '\\\\')
      .replaceAll("'", "\\'")
      .replaceAll('\u2028', '\\u2028')
      .replaceAll('\u2029', '\\u2029');
    return `JSON.parse('${serialized}')`;
  });
  if (localeIndex !== permissionsCopy.length) {
    throw new Error(`Expected ${permissionsCopy.length} locale objects, found ${localeIndex}`);
  }
  return patched;
}

function patchStaticMarkup(content) {
  content = replaceOptional(content, 'width="24" height="24" class="pixelated" src="/v2/app-assets/images/icon/maaya.gif"', 'width="30" height="30" class="pixelated" src="/v2/app-assets/images/icon/maaya.gif"');
  content = replaceOptional(content, 'width="26" height="26" class="pixelated" src="/v2/app-assets/images/icon/instafluff.gif"', 'width="30" height="30" class="pixelated" src="/v2/app-assets/images/icon/instafluff.gif"');
  content = replaceOptional(content, 'p-5 text-center text-white', 'p-5 text-center text-[var(--color-pp-headings)]');
  content = replaceOptional(content, 'text-xl font-bold mb-3 !text-white', 'text-xl font-bold mb-3 text-[var(--color-pp-headings)]');
  content = replaceOptional(content, 'text-sm mb-4 text-white/90', 'text-sm mb-4 text-[var(--color-pp-text)]');
  content = replaceOptional(content, 'mb-2 flex items-center justify-center h-32', 'mb-2 flex items-center justify-center h-20');
  content = replaceOptional(content, 'width="120" height="80"', 'width="72" height="64"');
  content = replaceOptional(
    content,
    '<button class="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[var(--color-pp-card-hover)] transition-colors text-sm text-[var(--color-pp-text)]">',
    '<button type="button" aria-label="Language: English" aria-expanded="false" class="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[var(--color-pp-card-hover)] transition-colors text-sm text-[var(--color-pp-text)]">'
  );
  let carouselDotIndex = 0;
  content = content.replace(
    /<button class="h-2 w-2 rounded-full transition-colors (bg-white(?:\/40)?)"><\/button>/g,
    (_match, color) => {
      const slide = (carouselDotIndex++ % 3) + 1;
      const current = slide === 1 ? ' aria-current="true"' : '';
      return `<button type="button" aria-label="Show slide ${slide}"${current} class="h-2 w-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${color}"></button>`;
    }
  );
  for (const [color, emoji] of [
    ['bg-red-100 text-red-700', '\u{1F384}'],
    ['bg-orange-100 text-orange-700', '\u{1F383}'],
    ['bg-pink-100 text-pink-700', '\u{1F423}'],
    ['bg-rose-100 text-rose-700', '\u2764\uFE0F'],
    ['bg-pink-100 text-pink-700', '\u{1F338}'],
    ['bg-amber-100 text-amber-700', '\u{1F342}'],
  ]) {
    content = replaceOptional(content, `<span class="ml-1 text-[10px] ${color} rounded px-1">${emoji}</span>`, '');
  }
  return patchLinks(content);
}

function removeClarity(content) {
  content = replaceOptional(content, clarityHeadNode, emptyHeadNode);
  const escapedClarityHeadNode = JSON.stringify(clarityHeadNode).slice(1, -1);
  const escapedEmptyHeadNode = JSON.stringify(emptyHeadNode).slice(1, -1);
  return replaceOptional(content, escapedClarityHeadNode, escapedEmptyHeadNode);
}

function patchStylesheet(content) {
  const replacements = [
    ['--color-pp-text-muted:#734b45', '--color-pp-text-muted:#5c3835'],
    ['--color-pp-nav-text:#d8714f', '--color-pp-nav-text:#4f2727'],
    ['--color-pp-accent:#5a8dee', '--color-pp-accent:#2e4f86'],
    ['--color-pp-link:#b5651d', '--color-pp-link:#7a3708'],
    ['--color-pp-info:#6eb8a8', '--color-pp-info:#28574f'],
    ['--color-pp-success:#74a33f', '--color-pp-success:#375a1b'],
    ['background-color:#5da99a', 'background-color:#20483f'],
    ['background-color:#638e35', 'background-color:#2d4b16'],
    ['background-color:#4a7de0', 'background-color:#24416f'],
  ];
  for (const [oldValue, newValue] of replacements) content = replaceOptional(content, oldValue, newValue);
  if (!content.includes('a.hover\\:underline{text-decoration-line:underline')) {
    content += 'a.hover\\:underline{text-decoration-line:underline;text-underline-offset:2px}';
  }
  if (!content.includes('@media (max-width:639px){footer.sticky{position:static')) {
    content += '@media (max-width:639px){footer.sticky{position:static;bottom:auto}}';
  }
  return content;
}

function patchCategoryColors(content) {
  for (const color of ['amber', 'blue', 'cyan', 'green', 'orange', 'pink', 'purple', 'red', 'teal']) {
    content = replaceOptional(
      content,
      `bg-${color}-600/15 text-${color}-800`,
      `bg-${color}-600/15 text-[var(--color-pp-headings)]`
    );
  }
  return content;
}

function patchAccessibleTextClasses(content) {
  content = replaceOptional(content, 'text-slate-500', 'text-[var(--color-pp-text-muted)]');
  content = replaceOptional(content, 'text-pink-400', 'text-[var(--color-pp-headings)]');
  content = replaceOptional(content, 'text-green-400', 'text-[var(--color-pp-success)]');
  content = replaceOptional(
    content,
    'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-headings)]'
  );
  content = replaceOptional(
    content,
    'bg-[var(--color-pp-accent)]/20 text-[var(--color-pp-accent)]',
    'bg-[var(--color-pp-accent)]/20 text-[var(--color-pp-headings)]'
  );
  return replaceOptional(
    content,
    'bg-[var(--color-pp-warning)] text-white',
    'bg-[var(--color-pp-warning)] text-[var(--color-pp-headings)]'
  );
}

for (const exportRoot of exportRoots) {
  const files = walk(exportRoot).filter((file) => /\.(?:css|html|js|txt)$/.test(file));
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    if (content.includes('window.ComfyTwitch.Login(o,"".concat(e,"/redirect/"),[],"code")')) content = patchAuthBundle(content);
    if (content.includes('o.Scopes=n.scopes') || content.includes('hasRequiredScopes:!!(g&&window.ComfyTwitch&&q.every') || content.includes('Array.isArray(window.ComfyTwitch.Scopes)&&Array.isArray(window.ComfyTwitch.Scopes)')) content = patchNullScopeHandling(content);
    if (content.includes('{isLoggedIn:m,account:c,token:g}=(0,d.A)()')) content = patchGamesBundle(content);
    if (content.includes('children:h("games.settingsLabel")') && !content.includes('"aria-controls":"game-settings-panel"')) content = patchGamesAccessibility(content);
    if (content.includes('children:h("games.settingsLabel")') && !content.includes('id:"theme-select"')) content = patchThemeSelectorAccessibility(content);
    if (content.includes('pixelplush-game-settings') && !content.includes('_themeMarketIcons')) content = patchThemeMarketIcons(content);
    if (content.includes('market.hideOwnedItems') && !content.includes('function _startPreviewAnimation')) content = patchMarketBundle(content);
    if (content.includes(previousMarketPreviewHelpers)) content = upgradeMarketPreviewAnimation(content);
    if (content.includes('fetch("".concat(p,"/transactions/status?id=").concat(a)).then')) content = patchTransactionStatusAuth(content);
    if (content.includes('home.getCharacters') && content.includes('[r,m]=(0,n.useState)(0);')) content = patchHomeBundle(content);
    if (content.includes('src:(0,c.Q)("/app-assets/images/icon/maaya.gif"),alt:"",width:24,height:24')) content = patchLayoutBundle(content);
    if (content.includes('onClick:()=>h(!a),className:"flex items-center gap-1.5 px-2 py-1.5 rounded') && !content.includes('"aria-label":"Language: ".concat')) content = patchLayoutAccessibility(content);
    if (content.includes('children:e("scores.timeRange")') && !content.includes('id:"score-time-range"')) content = patchScoresAccessibility(content);
    if (content.includes('JSON.parse') && content.includes('"loginToAutoFill":')) content = patchLocaleBundle(content);
    if (content.includes('[r,m]=(0,n.useState)(0),[p,g]=(0,n.useState)(!1);')) content = upgradeCarouselPauseState(content);
    if (/\.(?:html|txt)$/.test(file)) content = patchStaticMarkup(content);
    if (content.includes('wdlmotp71n')) content = removeClarity(content);
    if (file.endsWith('.css') && content.includes('--color-pp-bg:#f2c079')) content = patchStylesheet(content);
    if (/\.(?:html|js|txt)$/.test(file) && content.includes('-600/15 text-')) content = patchCategoryColors(content);
    if (/\.(?:html|js|txt)$/.test(file)) content = patchAccessibleTextClasses(content);
    if (content.includes('Twitter / X') || content.includes('https://twitter.com/pixelplushgames')) content = patchLinks(content);
    if (content !== original) fs.writeFileSync(file, content);
  }
}

for (const exportRoot of exportRoots) {
  const remainingClarity = walk(exportRoot).filter((file) => {
    if (!/\.(?:html|js|txt)$/.test(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('clarity.ms') || content.includes('wdlmotp71n');
  });
  if (remainingClarity.length) {
    throw new Error(`Broken Microsoft Clarity loader remains in: ${remainingClarity.map((file) => path.relative(repositoryRoot, file)).join(', ')}`);
  }
}

console.log(`Applied v2 launch polish to: ${exportRoots.map((root) => path.relative(repositoryRoot, root)).join(', ')}`);