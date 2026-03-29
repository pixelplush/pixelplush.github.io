'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { assetPath } from '@/lib/assetPath';
import { useAuth } from '@/lib/auth';

interface GameTheme {
  key: string;
  name: string;
  page: string;
  premium?: boolean;
  preview: string;
  requires?: string;
  bundle?: string;
}

interface GameSetting {
  id: string;
  label: string;
  type: 'toggle' | 'number' | 'text' | 'select';
  param: string;
  default: boolean | number | string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  suffix?: string;
  requiresAuth?: boolean;
  showFor?: string[];
}

interface GameDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  images: string[];
  color: string;
  badge: string;
  badgeColor: string;
  themes: GameTheme[];
  settings?: GameSetting[];
}

const games: GameDef[] = [
  {
    id: 'giveaway',
    name: 'Giveaway Tool',
    tagline: 'Fun way to do giveaways on Twitch',
    description: 'Run giveaways in an easy and fun way for your viewers! Viewers type a command in chat to enter, and a random winner is picked with a fun animation.',
    images: ['/app-assets/images/games/giveaway_basic.gif', '/app-assets/images/games/giveaway_blossoms.gif', '/app-assets/images/games/giveaway_autumn.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'giveaway', name: 'PixelPlush (Free)', page: '/giveaway/index.html', preview: '/app-assets/images/games/giveaway_basic.gif' },
      { key: 'giveawaycolors', name: 'Colorful (Premium)', page: '/giveaway/blue.html', premium: true, preview: '/app-assets/images/games/pp_pink.gif', requires: 'addon_giveaway_blue', bundle: 'bundle_giveaway_colors' },
      { key: 'giveawayblue', name: 'Blue', page: '/giveaway/blue.html', premium: true, preview: '/app-assets/images/games/pp_blue.gif', requires: 'addon_giveaway_blue', bundle: 'bundle_giveaway_colors' },
      { key: 'giveawaybw', name: 'Black & White', page: '/giveaway/bw.html', premium: true, preview: '/app-assets/images/games/pp_bw.gif', requires: 'addon_giveaway_blue', bundle: 'bundle_giveaway_colors' },
      { key: 'giveawaygreen', name: 'Green', page: '/giveaway/green.html', premium: true, preview: '/app-assets/images/games/giveaway_pp_green.gif', requires: 'addon_giveaway_blue', bundle: 'bundle_giveaway_colors' },
      { key: 'giveawayorange', name: 'Orange', page: '/giveaway/orange.html', premium: true, preview: '/app-assets/images/games/giveaway_pp_orange.gif', requires: 'addon_giveaway_blue', bundle: 'bundle_giveaway_colors' },
      { key: 'giveawaypink', name: 'Pink', page: '/giveaway/pink.html', premium: true, preview: '/app-assets/images/games/pp_pink.gif', requires: 'addon_giveaway_blue', bundle: 'bundle_giveaway_colors' },
      { key: 'giveawaypurple', name: 'Purple', page: '/giveaway/purple.html', premium: true, preview: '/app-assets/images/games/giveaway_pp_purple.gif', requires: 'addon_giveaway_blue', bundle: 'bundle_giveaway_colors' },
      { key: 'giveawayred', name: 'Red', page: '/giveaway/red.html', premium: true, preview: '/app-assets/images/games/giveaway_pp_red.gif', requires: 'addon_giveaway_blue', bundle: 'bundle_giveaway_colors' },
      { key: 'giveawayyellow', name: 'Yellow', page: '/giveaway/yellow.html', premium: true, preview: '/app-assets/images/games/giveaway_pp_yellow.gif', requires: 'addon_giveaway_blue', bundle: 'bundle_giveaway_colors' },
      { key: 'giveawayblossoms', name: 'Blossoms (Premium)', page: '/giveaway/blossoms.html', premium: true, preview: '/app-assets/images/games/giveaway_blossoms.gif', requires: 'addon_giveaway_blossoms' },
      { key: 'giveawayautumn', name: 'Autumn (Premium)', page: '/giveaway/autumn.html', premium: true, preview: '/app-assets/images/games/giveaway_autumn.gif', requires: 'addon_giveaway_autumn' },
    ],
    settings: [
      { id: 'lang', label: 'Language', type: 'select', param: 'lang', default: 'en', options: [
        { value: 'en', label: 'English' }, { value: 'fr', label: 'French' }, { value: 'de', label: 'German' }, { value: 'es', label: 'Spanish' }, { value: 'cs', label: 'Czech' },
      ]},
      { id: 'volume', label: 'Volume', type: 'number', param: 'volume', default: 25, min: 0, max: 100, suffix: '%' },
      { id: 'command', label: 'Start Command', type: 'text', param: 'command', default: 'giv' },
      { id: 'join', label: 'Join Command', type: 'text', param: 'join', default: 'join' },
      { id: 'unjoin', label: 'Unjoin Command', type: 'text', param: 'unjoin', default: 'unjoin' },
      { id: 'win', label: 'Claim Command', type: 'text', param: 'win', default: 'win' },
      { id: 'skip', label: 'Skip Command', type: 'text', param: 'skip', default: 'skip' },
      { id: 'chat', label: 'Send Results in Chat', type: 'toggle', param: 'chat', default: false, requiresAuth: true },
    ],
  },
  {
    id: 'weather',
    name: 'Stream Weather',
    tagline: 'Weather overlay using Channel Points',
    description: 'A weather-changing stream overlay that viewers can control using Channel Points. Rain, snow, thunderstorms — your viewers decide!',
    images: ['/app-assets/images/games/streamweather_square.gif'],
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'Channel Points',
    badgeColor: 'bg-[var(--color-pp-accent)]/20 text-[var(--color-pp-accent)]',
    themes: [
      { key: 'weather', name: 'Stream Weather', page: '/weather/index.html', premium: true, preview: '/app-assets/images/games/streamweather_square.gif', requires: 'addon_streamweather' },
    ],
    settings: [
      { id: 'volume', label: 'Volume', type: 'number', param: 'volume', default: 25, min: 0, max: 100, suffix: '%' },
      { id: 'rain', label: 'Rain CP Cost', type: 'number', param: 'rain', default: 100, min: 0, max: 100000 },
      { id: 'rainTime', label: 'Rain Duration', type: 'number', param: 'rainTime', default: 5, min: 1, max: 1000, suffix: 's' },
      { id: 'heavyrain', label: 'Heavy Rain CP Cost', type: 'number', param: 'heavyrain', default: 100, min: 0, max: 100000 },
      { id: 'heavyrainTime', label: 'Heavy Rain Duration', type: 'number', param: 'heavyrainTime', default: 5, min: 1, max: 1000, suffix: 's' },
      { id: 'snow', label: 'Snow CP Cost', type: 'number', param: 'snow', default: 100, min: 0, max: 100000 },
      { id: 'snowTime', label: 'Snow Duration', type: 'number', param: 'snowTime', default: 5, min: 1, max: 1000, suffix: 's' },
      { id: 'blizzard', label: 'Blizzard CP Cost', type: 'number', param: 'blizzard', default: 100, min: 0, max: 100000 },
      { id: 'blizzardTime', label: 'Blizzard Duration', type: 'number', param: 'blizzardTime', default: 5, min: 1, max: 1000, suffix: 's' },
      { id: 'hail', label: 'Hail CP Cost', type: 'number', param: 'hail', default: 100, min: 0, max: 100000 },
      { id: 'hailTime', label: 'Hail Duration', type: 'number', param: 'hailTime', default: 5, min: 1, max: 1000, suffix: 's' },
      { id: 'blossoms', label: 'Blossoms CP Cost', type: 'number', param: 'blossoms', default: 100, min: 0, max: 100000 },
      { id: 'blossomsTime', label: 'Blossoms Duration', type: 'number', param: 'blossomsTime', default: 5, min: 1, max: 1000, suffix: 's' },
    ],
  },
  {
    id: 'confetti',
    name: 'Pixel Confetti',
    tagline: 'Stream confetti overlay using Channel Points',
    description: 'Viewers send confetti across your stream using Channel Points! A fun visual celebration for subs, raids, or any hype moment.',
    images: ['/app-assets/images/games/pixelconfetti_square.gif'],
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'Channel Points',
    badgeColor: 'bg-[var(--color-pp-accent)]/20 text-[var(--color-pp-accent)]',
    themes: [
      { key: 'confetti', name: 'Pixel Confetti', page: '/confetti/index.html', premium: true, preview: '/app-assets/images/games/pixelconfetti_square.gif', requires: 'addon_pixelconfetti' },
    ],
    settings: [
      { id: 'volume', label: 'Volume', type: 'number', param: 'volume', default: 25, min: 0, max: 100, suffix: '%' },
      { id: 'cpConfettiCost', label: 'Confetti CP Cost', type: 'number', param: 'cpConfettiCost', default: 100, min: 0, max: 100000 },
      { id: 'cpConfettiIntensity', label: 'Confetti Intensity', type: 'number', param: 'cpConfettiIntensity', default: 300, min: 50, max: 10000 },
      { id: 'cpBubblesCost', label: 'Bubbles CP Cost', type: 'number', param: 'cpBubblesCost', default: 100, min: 0, max: 100000 },
      { id: 'cpBubblesIntensity', label: 'Bubbles Intensity', type: 'number', param: 'cpBubblesIntensity', default: 300, min: 50, max: 10000 },
      { id: 'cpBalloonsCost', label: 'Balloons CP Cost', type: 'number', param: 'cpBalloonsCost', default: 100, min: 0, max: 100000 },
      { id: 'cpBalloonsIntensity', label: 'Balloons Intensity', type: 'number', param: 'cpBalloonsIntensity', default: 20, min: 1, max: 1000 },
      { id: 'cpHeartsCost', label: 'Hearts CP Cost', type: 'number', param: 'cpHeartsCost', default: 100, min: 0, max: 100000 },
      { id: 'cpHeartsIntensity', label: 'Hearts Intensity', type: 'number', param: 'cpHeartsIntensity', default: 20, min: 1, max: 1000 },
    ],
  },
  {
    id: 'plinko',
    name: 'Plinko Bounce',
    tagline: 'Plinko stream overlay game for Twitch',
    description: 'Drop a ball and watch it bounce through pegs to score points! Viewers compete for the highest score on the leaderboard.',
    images: ['/app-assets/images/games/plinko_christmas_website.gif', '/app-assets/images/games/pixelplinkohalloween.gif', '/app-assets/images/games/plinko_day_website.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'pixelplinko', name: 'Day (Free)', page: '/plinko/index.html', preview: '/app-assets/images/games/plinko_day_website.gif' },
      { key: 'pixelplinkochristmas', name: 'Christmas (Free)', page: '/plinko/christmas.html', preview: '/app-assets/images/games/plinko_christmas_website.gif' },
      { key: 'pixelplinkohalloween', name: 'Halloween (Premium)', page: '/plinko/halloween.html', premium: true, preview: '/app-assets/images/games/pixelplinkohalloween.gif', requires: 'addon_plinko_halloween' },
    ],
    settings: [
      { id: 'overlay', label: 'Background', type: 'toggle', param: 'overlay', default: true },
      { id: 'clouds', label: 'Clouds', type: 'toggle', param: 'clouds', default: false },
      { id: 'hideTilStart', label: 'Hide Until Start', type: 'toggle', param: 'hideTilStart', default: true },
      { id: 'pegOpacity', label: 'Peg Opacity', type: 'number', param: 'pegOpacity', default: 15, min: 0, max: 100, suffix: '%' },
      { id: 'volume', label: 'Volume', type: 'number', param: 'volume', default: 25, min: 0, max: 100, suffix: '%' },
      { id: 'notifVolume', label: 'Notification Volume', type: 'number', param: 'notifVolume', default: 25, min: 0, max: 100, suffix: '%' },
      { id: 'commandOn', label: 'Enable Chat Command', type: 'toggle', param: 'commandOn', default: true },
      { id: 'command', label: 'Command', type: 'text', param: 'command', default: 'plinko' },
      { id: 'cooldown', label: 'Refresh Timer', type: 'number', param: 'cooldown', default: 90, min: 60, max: 3600, suffix: 's' },
      { id: 'chat', label: 'Announce in Chat', type: 'toggle', param: 'chat', default: false, requiresAuth: true },
    ],
  },
  {
    id: 'parachute',
    name: 'Parachute Drop',
    tagline: 'Parachute stream overlay game for Twitch',
    description: 'Jump out of a plane, open your parachute, and try to land on the target! Viewers compete by typing commands in chat.',
    images: ['/app-assets/images/games/drop_cauldron_rainbow_website.gif', '/app-assets/images/games/drop_christmas.gif', '/app-assets/images/games/drop_cake_rainbow_website.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'pixelparachutes', name: 'Day (Free)', page: '/parachute/index.html', preview: '/app-assets/images/games/pixelparachuteday.gif' },
      { key: 'pixelparachutesday', name: 'Day Alt', page: '/parachute/day.html', preview: '/app-assets/images/games/pixelparachuteday.gif' },
      { key: 'pixelparachutesnight', name: 'Night', page: '/parachute/night.html', preview: '/app-assets/images/games/pixelparachutenight.gif' },
      { key: 'pixelparachutesretro', name: 'Retro', page: '/parachute/retro.html', preview: '/app-assets/images/games/pixelparachuteretro.gif' },
      { key: 'pixelparachuteautumn', name: 'Autumn (Free)', page: '/parachute/autumn.html', preview: '/app-assets/images/games/drop_autumn_website.gif' },
      { key: 'pixelparachutehalloween', name: 'Halloween (Free)', page: '/parachute/halloween.html', preview: '/app-assets/images/games/pixelparachutehalloween.gif' },
      { key: 'pixelparachutechristmas', name: 'Christmas (Free)', page: '/parachute/christmas.html', preview: '/app-assets/images/games/pixelparachutechristmas.gif' },
      { key: 'pixelparachutewinter', name: 'Winter (Free)', page: '/parachute/winter.html', preview: '/app-assets/images/games/pixelparachutewinter.gif' },
      { key: 'pixelparachutespring', name: 'Spring Blossoms (Premium)', page: '/parachute/spring.html', premium: true, preview: '/app-assets/images/games/pixelparachutespring.gif', requires: 'addon_parachute_blossoms' },
      { key: 'pixelparachuterainbow', name: 'Rainbow (Premium)', page: '/parachute/pride.html', premium: true, preview: '/app-assets/images/games/pixelparachuterainbow.gif', requires: 'addon_parachute_rainbow' },
      { key: 'pixelparachutecauldron', name: 'Cauldron (Premium)', page: '/parachute/cauldron_colors.html', premium: true, preview: '/app-assets/images/games/drop_cauldron_rainbow_website.gif', requires: 'addon_parachute_cauldron' },
      { key: 'pixelparachutechristmaseve', name: 'Christmas Eve (Premium)', page: '/parachute/christmas_eve.html', premium: true, preview: '/app-assets/images/games/drop_christmas_eve.gif', requires: 'addon_parachute_christmaseve' },
      { key: 'pixelparachutevalentines', name: 'Valentines (Premium)', page: '/parachute/valentines_brown_gold.html', premium: true, preview: '/app-assets/images/games/valentines_brown_gold.gif', requires: 'addon_parachute_valentines_brown_gold', bundle: 'bundle_parachute_valentines' },
      { key: 'pixelparachuteeaster', name: 'Easter (Free)', page: '/parachute/easter_free.html', preview: '/app-assets/images/games/drop_easter_main.gif' },
      { key: 'pixelparachutesplashpool', name: 'Pool Party Red (Free)', page: '/parachute/pool_splash_red.html', preview: '/app-assets/images/games/pool_red.gif' },
      { key: 'pixelparachutesplashpoolblue', name: 'Pool Party Blue (Free)', page: '/parachute/pool_splash_blue.html', preview: '/app-assets/images/games/pool_blue.gif' },
      { key: 'pixelparachutescakes', name: 'Party Cakes (Premium)', page: '/parachute/cake_rainbow.html', premium: true, preview: '/app-assets/images/games/drop_cake_rainbow_website.gif', requires: 'addon_parachute_cakerainbow', bundle: 'bundle_parachute_cake' },
    ],
    settings: [
      { id: 'overlay', label: 'Background', type: 'toggle', param: 'overlay', default: true },
      { id: 'clouds', label: 'Clouds', type: 'toggle', param: 'clouds', default: false },
      { id: 'hideTilDrop', label: 'Hide Until Drop', type: 'toggle', param: 'hideTilDrop', default: true },
      { id: 'volume', label: 'Volume', type: 'number', param: 'volume', default: 25, min: 0, max: 100, suffix: '%' },
      { id: 'notifVolume', label: 'Notification Volume', type: 'number', param: 'notifVolume', default: 25, min: 0, max: 100, suffix: '%' },
      { id: 'commandOn', label: 'Enable Chat Command', type: 'toggle', param: 'commandOn', default: true },
      { id: 'command', label: 'Drop Command', type: 'text', param: 'command', default: 'drop' },
      { id: 'cooldown', label: 'Refresh Timer', type: 'number', param: 'cooldown', default: 30, min: 1, max: 3600, suffix: 's' },
      { id: 'droplets', label: 'Bit Cheers', type: 'toggle', param: 'droplets', default: true },
      { id: 'chat', label: 'Score in Chat', type: 'toggle', param: 'chat', default: false, requiresAuth: true },
    ],
  },
  {
    id: 'chatflakes',
    name: 'Chat Flakes',
    tagline: 'Chat messages turned into stream particles',
    description: 'Viewers add subtle particle effects across your screen just by typing in chat. A beautiful passive overlay!',
    images: ['/app-assets/images/games/chatflakes.gif'],
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'chatflakes', name: 'Chat Flakes', page: '/flakes/index.html', premium: true, preview: '/app-assets/images/games/chatflakes.gif', requires: 'addon_chatflakes' },
    ],
    settings: [
      { id: 'nth', label: 'Message Interval', type: 'number', param: 'nth', default: 1, min: 1, max: 1000 },
      { id: 'num', label: 'Particles per Message', type: 'number', param: 'num', default: 3, min: 1, max: 100 },
      { id: 'timer', label: 'Timer Particles', type: 'number', param: 'timer', default: 3000, min: 0, max: 1000000, suffix: 'ms' },
      { id: 'rain', label: 'Rain Particles', type: 'toggle', param: 'rain', default: true },
      { id: 'leaves', label: 'Leaf Particles', type: 'toggle', param: 'leaves', default: false },
      { id: 'snow', label: 'Snow Particles', type: 'toggle', param: 'snow', default: false },
      { id: 'blossoms', label: 'Blossom Particles', type: 'toggle', param: 'blossoms', default: false },
      { id: 'hearts', label: 'Heart Particles', type: 'toggle', param: 'hearts', default: false },
    ],
  },
  {
    id: 'hillroll',
    name: 'Hill Rolling Race',
    tagline: 'Racing stream overlay game for Twitch',
    description: 'Roll down a hill and race against other viewers! Dodge obstacles and try to reach the finish line first.',
    images: ['/app-assets/images/games/hill_christmas_gif.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'pixelhillrollchristmas', name: 'Christmas (Free)', page: '/hillroll/christmas.html', preview: '/app-assets/images/games/hill_christmas_gif.gif' },
    ],
    settings: [
      { id: 'overlay', label: 'Background', type: 'toggle', param: 'overlay', default: true },
      { id: 'clouds', label: 'Clouds', type: 'toggle', param: 'clouds', default: true },
      { id: 'volume', label: 'Volume', type: 'number', param: 'volume', default: 25, min: 0, max: 100, suffix: '%' },
      { id: 'command', label: 'Command', type: 'text', param: 'command', default: 'hill' },
      { id: 'cooldown', label: 'Refresh Timer', type: 'number', param: 'cooldown', default: 90, min: 60, max: 3600, suffix: 's' },
      { id: 'defaultCountdown', label: 'Default Countdown', type: 'number', param: 'defaultCountdown', default: 0, min: 0, max: 600, suffix: 's' },
      { id: 'hideInstructions', label: 'Hide Instructions', type: 'toggle', param: 'hideInstructions', default: false },
      { id: 'hideTime', label: 'Hide Timer', type: 'toggle', param: 'hideTime', default: false },
      { id: 'chat', label: 'Results in Chat', type: 'toggle', param: 'chat', default: false, requiresAuth: true },
    ],
  },
  {
    id: 'maze',
    name: 'Pixel Maze',
    tagline: 'Stream maze game for Twitch',
    description: 'Navigate through a maze using chat commands! Great for BRB screens — keeps your viewers entertained during breaks.',
    images: ['/app-assets/images/games/maze_christmas_gif.gif', '/app-assets/images/games/maze_winter_gif.gif', '/app-assets/images/games/wanderingwizards.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'wanderingwizards', name: 'Wandering Wizards (Free)', page: '/maze/index.html', preview: '/app-assets/images/games/wanderingwizards.gif' },
      { key: 'autumnadventure', name: 'Autumn Adventure (Free)', page: '/maze/autumn.html', preview: '/app-assets/images/games/maze_autumn_gif.gif' },
      { key: 'trickortreat', name: 'Trick or Treat (Free)', page: '/maze/ghost.html', preview: '/app-assets/images/games/trickortreat.gif' },
      { key: 'santasecretservice', name: "Santa's Secret Service (Free)", page: '/maze/christmas.html', preview: '/app-assets/images/games/maze_christmas_gif.gif' },
      { key: 'frozenfrenzy', name: 'Frozen Frenzy (Free)', page: '/maze/frozen.html', preview: '/app-assets/images/games/maze_winter_gif.gif' },
      { key: 'cupidheartcollection', name: 'Cupid Heart Collection (Free)', page: '/maze/cupid.html', preview: '/app-assets/images/games/cupidheartcollection.gif' },
      { key: 'easteregghunt', name: 'Easter Egg Hunt (Free)', page: '/maze/easter.html', preview: '/app-assets/images/games/easteregghunt.gif' },
      { key: 'springspree', name: 'Spring Spree (Free)', page: '/maze/spring.html', preview: '/app-assets/images/games/springspree.gif' },
      { key: 'fairyforest', name: 'Fairy Forest (Free)', page: '/maze/fairy.html', preview: '/app-assets/images/games/fairyforest.gif' },
    ],
    settings: [
      { id: 'bosses', label: 'Boss Count', type: 'number', param: 'bosses', default: 1, min: 0, max: 100 },
      { id: 'bossEffect', label: 'Boss Effect', type: 'select', param: 'bossEffect', default: 'steal', options: [
        { value: 'steal', label: 'Steal Points' }, { value: 'base', label: 'Return to Spawn' },
      ]},
      { id: 'prizes', label: 'Prize Count', type: 'number', param: 'prizes', default: 7, min: 1, max: 214 },
      { id: 'traps', label: 'Trap Count', type: 'number', param: 'traps', default: 5, min: 0, max: 214 },
      { id: 'trapEffect', label: 'Trap Effect', type: 'select', param: 'trapEffect', default: '0', options: [
        { value: '0', label: 'Points Penalty' }, { value: '1', label: 'Trap Tunnels' },
      ]},
      { id: 'chat', label: 'Results in Chat', type: 'toggle', param: 'chat', default: false, requiresAuth: true },
    ],
  },
];

function LinkGenerator({ game, selectedTheme, onThemeChange }: { game: GameDef; selectedTheme: string; onThemeChange: (key: string) => void }) {
  const { isLoggedIn, account, token } = useAuth();
  const [channelName, setChannelName] = useState(account?.username || '');
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsState, setSettingsState] = useState<Record<string, boolean | number | string>>(() => {
    const defaults: Record<string, boolean | number | string> = {};
    for (const s of game.settings || []) defaults[s.id] = s.default;
    return defaults;
  });

  const theme = game.themes.find((t) => t.key === selectedTheme) || game.themes[0];

  const visibleSettings = (game.settings || []).filter(
    (s) => !s.showFor || s.showFor.length === 0 || s.showFor.includes(selectedTheme),
  );

  const updateSetting = (id: string, value: boolean | number | string) => {
    setSettingsState((prev) => ({ ...prev, [id]: value }));
  };

  const generateUrl = useCallback(() => {
    if (!channelName.trim() || !theme) return '';
    const base = `https://www.pixelplush.dev${theme.page}`;
    const params = new URLSearchParams();
    params.set('channel', channelName.trim().toLowerCase());
    if (token) {
      params.set('oauth', token);
    }
    for (const setting of game.settings || []) {
      if (setting.showFor && setting.showFor.length > 0 && !setting.showFor.includes(selectedTheme)) continue;
      const val = settingsState[setting.id];
      if (val !== undefined && val !== setting.default) {
        if (setting.id === 'cooldown') {
          params.set(setting.param, String(Number(val) * 1000));
        } else {
          params.set(setting.param, String(val));
        }
      }
    }
    return `${base}?${params.toString()}`;
  }, [channelName, theme, token, game.settings, settingsState, selectedTheme]);

  const url = generateUrl();

  const copyUrl = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[var(--color-pp-border)] bg-[var(--color-pp-bg)]/50 p-5">
      <h3 className="mb-4 text-sm font-semibold text-[var(--color-pp-headings)]">Generate Browser Source Link</h3>

      <div className="space-y-4">
        {/* Channel name */}
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-pp-text-muted)]">Twitch Channel Name</label>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value.toLowerCase())}
            placeholder="e.g. instafluff"
            className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-2 text-sm text-[var(--color-pp-text)] placeholder-[var(--color-pp-text-muted)] focus:border-[var(--color-pp-accent)] focus:outline-none"
          />
          {!isLoggedIn && (
            <p className="mt-1 text-[10px] text-[var(--color-pp-text-muted)]">
              <Link href="/login" className="text-[var(--color-pp-link)] hover:underline">Log in</Link> to auto-fill your channel and enable token-based features.
            </p>
          )}
        </div>

        {/* Theme selector */}
        {game.themes.length > 1 && (
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-pp-text-muted)]">Theme</label>
            <select
              value={selectedTheme}
              onChange={(e) => onThemeChange(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-2 text-sm text-[var(--color-pp-text)] focus:border-[var(--color-pp-accent)] focus:outline-none"
            >
              {game.themes.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.premium && t.requires && !account?.owned?.includes(t.requires) ? '🔒 ' : t.premium && account?.owned?.includes(t.requires || '') ? '✓ ' : ''}{t.name}{t.premium ? ' 💎' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Premium unlock CTA */}
        {theme?.premium && theme.requires && isLoggedIn && !account?.owned?.includes(theme.requires) && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">{theme.name}</p>
              <p className="text-xs text-amber-700">
                This premium theme requires an add-on.
                <Link href="/market" className="font-semibold underline ml-1">Get it in the Market →</Link>
              </p>
            </div>
          </div>
        )}
        {theme?.premium && theme.requires && !isLoggedIn && (
          <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 flex items-center gap-3">
            <span className="text-2xl">🔑</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">{theme.name}</p>
              <p className="text-xs text-blue-700">
                <Link href="/login" className="font-semibold underline">Log in</Link> to check if you own this premium theme.
              </p>
            </div>
          </div>
        )}

        {/* Game Settings */}
        {visibleSettings.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="flex w-full items-center justify-between rounded-lg bg-[var(--color-pp-card)] px-3 py-2 text-xs font-medium text-[var(--color-pp-text)] hover:bg-[var(--color-pp-border)]/50 transition cursor-pointer"
            >
              <span>Game Settings</span>
              <span className="text-[var(--color-pp-text-muted)]">{showSettings ? '▲' : '▼'}</span>
            </button>
            {showSettings && (
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {visibleSettings.map((s) => (
                  <div key={s.id} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[var(--color-pp-text-muted)]">
                      {s.label}
                      {s.suffix && <span className="ml-1 text-[10px] text-[var(--color-pp-text-muted)]">({s.suffix})</span>}
                      {s.requiresAuth && !isLoggedIn && <span className="ml-1 text-[10px] text-amber-600">(requires login)</span>}
                    </label>
                    {s.type === 'toggle' && (
                      <button
                        type="button"
                        onClick={() => updateSetting(s.id, !settingsState[s.id])}
                        disabled={s.requiresAuth && !isLoggedIn}
                        className={`relative h-6 w-11 rounded-full transition cursor-pointer ${
                          settingsState[s.id] ? 'bg-[var(--color-pp-accent)]' : 'bg-[var(--color-pp-border)]'
                        } ${s.requiresAuth && !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          settingsState[s.id] ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    )}
                    {s.type === 'number' && (
                      <input
                        type="number"
                        value={settingsState[s.id] as number}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (!isNaN(v)) updateSetting(s.id, Math.min(s.max ?? v, Math.max(s.min ?? v, v)));
                        }}
                        min={s.min}
                        max={s.max}
                        className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-1.5 text-xs text-[var(--color-pp-text)] focus:border-[var(--color-pp-accent)] focus:outline-none"
                      />
                    )}
                    {s.type === 'text' && (
                      <input
                        type="text"
                        value={settingsState[s.id] as string}
                        onChange={(e) => updateSetting(s.id, e.target.value)}
                        className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-1.5 text-xs text-[var(--color-pp-text)] focus:border-[var(--color-pp-accent)] focus:outline-none"
                      />
                    )}
                    {s.type === 'select' && (
                      <select
                        value={settingsState[s.id] as string}
                        onChange={(e) => updateSetting(s.id, e.target.value)}
                        className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-1.5 text-xs text-[var(--color-pp-text)] focus:border-[var(--color-pp-accent)] focus:outline-none"
                      >
                        {s.options?.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generated URL */}
        {channelName.trim() && (
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-pp-text-muted)]">Browser Source URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-2 text-xs text-[var(--color-pp-text-muted)] focus:outline-none"
              />
              <button
                onClick={copyUrl}
                className="shrink-0 rounded-lg bg-[var(--color-pp-accent)] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#4a7de0]"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg bg-[var(--color-pp-card)] p-3 text-[11px] text-[var(--color-pp-text-muted)]">
          <p className="font-medium text-[var(--color-pp-text)]">How to add to OBS:</p>
          <ol className="mt-1 list-inside list-decimal space-y-0.5">
            <li>Copy the URL above</li>
            <li>In OBS, add a new <strong>Browser Source</strong></li>
            <li>Paste the URL and set size to <strong>1920×1080</strong></li>
            <li>Check &quot;Refresh browser when scene becomes active&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function GamesContent() {
  const searchParams = useSearchParams();
  const { account } = useAuth();
  const selectedType = searchParams.get('type');
  const selectedGame = selectedType ? games.find((g) => g.id === selectedType) : null;
  const [selectedTheme, setSelectedTheme] = useState(selectedGame?.themes[0]?.key || '');
  const currentTheme = selectedGame?.themes.find((t) => t.key === selectedTheme);

  useEffect(() => {
    if (selectedGame) {
      setSelectedTheme(selectedGame.themes[0]?.key || '');
    }
  }, [selectedGame]);

  if (selectedGame) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/games" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-pp-accent)] hover:underline">
          &larr; All Games
        </Link>

        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] overflow-hidden">
          {/* Hero image */}
          <div className="relative h-64 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center">
            <Image
              key={currentTheme?.key}
              src={assetPath(currentTheme?.preview || selectedGame.images[0])}
              alt={`${selectedGame.name} - ${currentTheme?.name || ''}`}
              width={400}
              height={250}
              className="pixelated max-h-56 w-auto object-contain"
              unoptimized
            />
          </div>

          <div className="p-8">
            <div className="mb-4 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[var(--color-pp-headings)]">{selectedGame.name}</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${selectedGame.badgeColor}`}>
                {selectedGame.badge}
              </span>
            </div>
            <p className="mb-6 text-lg text-[var(--color-pp-text-muted)]">{selectedGame.description}</p>

            {/* Theme list */}
            {selectedGame.themes.length > 1 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-[var(--color-pp-text-muted)]">
                  Available Themes ({selectedGame.themes.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGame.themes.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setSelectedTheme(t.key)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                        t.key === selectedTheme
                          ? 'ring-2 ring-[var(--color-pp-accent)] bg-[var(--color-pp-accent)]/20 text-[var(--color-pp-accent)]'
                          : t.premium
                            ? 'bg-amber-600/15 text-amber-800 hover:bg-amber-600/25'
                            : 'bg-[var(--color-pp-success)]/15 text-[var(--color-pp-success)] hover:bg-[var(--color-pp-success)]/25'
                      }`}
                    >
                      {t.premium && t.requires && !account?.owned?.includes(t.requires) ? '🔒 ' : ''}
                      {t.premium && t.requires && account?.owned?.includes(t.requires) ? '✓ ' : ''}
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Link Generator */}
            <LinkGenerator game={selectedGame} selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">Games &amp; Overlays</h1>
        <p className="text-[var(--color-pp-text-muted)]">
          Free Twitch chat-integrated games and overlays. Add them to OBS as browser sources.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games?type=${game.id}`}
            className={`group rounded-2xl border p-5 transition hover:scale-[1.02] hover:shadow-lg ${game.color} bg-[#FFFDF8]`}
          >
            <div className="mb-4 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-black/20">
              <Image
                src={assetPath(game.images[0])}
                alt={game.name}
                width={200}
                height={150}
                className="pixelated max-h-36 w-auto object-contain"
                unoptimized
              />
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold text-[var(--color-pp-headings)] group-hover:text-[var(--color-pp-accent)]">{game.name}</h2>
                <p className="mt-1 text-sm text-[var(--color-pp-text-muted)]">{game.tagline}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${game.badgeColor}`}>
                {game.badge}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" /></div>}>
      <GamesContent />
    </Suspense>
  );
}
