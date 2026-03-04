import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credits',
  description: 'Sound effects and asset credits for PixelPlush games.',
};

const credits = [
  {
    game: 'Stream Weather',
    sounds: [
      { name: 'Wind', author: 'felix.blume', url: 'https://freesound.org/people/felix.blume/sounds/217506/' },
      { name: 'Rain', author: 'inchadney', url: 'https://freesound.org/people/inchadney/sounds/104734/' },
      { name: 'Thunder', author: 'hantorio', url: 'https://freesound.org/people/hantorio/sounds/121945/' },
      { name: 'Thunder (alt)', author: 'bone666138', url: 'https://freesound.org/people/bone666138/sounds/198857/' },
      { name: 'Snow', author: 'Eelke', url: 'https://freesound.org/people/Eelke/sounds/166673/' },
      { name: 'Birds', author: 'hargissssound', url: 'https://freesound.org/people/hargissssound/sounds/345851/' },
    ],
  },
  {
    game: 'Parachute Drop',
    sounds: [
      { name: 'Airplane', author: 'Benboncan', url: 'https://freesound.org/people/Benboncan/sounds/76816/' },
      { name: 'Wind', author: 'Felix Blume', url: 'https://freesound.org/people/felix.blume/sounds/222569/' },
      { name: 'Landing', author: 'MATRIXXX_', url: 'https://freesound.org/people/MATRIXXX_/sounds/365233/' },
      { name: 'Parachute Open', author: 'michorvath', url: 'https://freesound.org/people/michorvath/sounds/269178/' },
      { name: 'Ocean', author: 'Noted451', url: 'https://freesound.org/people/Noted451/sounds/531015/' },
    ],
  },
  {
    game: 'Plinko Bounce',
    sounds: [
      { name: 'Plink', author: 'NenadSimic', url: 'https://freesound.org/people/NenadSimic/sounds/171697/' },
      { name: 'Ding', author: 'Aiwha', url: 'https://freesound.org/people/Aiwha/sounds/196106/' },
    ],
  },
];

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">Credits</h1>
      <p className="mb-8 text-slate-400">Sound effects and assets used in PixelPlush games.</p>

      <div className="space-y-8">
        {credits.map((section) => (
          <div
            key={section.game}
            className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-6"
          >
            <h2 className="mb-4 text-xl font-semibold text-white">{section.game}</h2>
            <div className="divide-y divide-white/5">
              {section.sounds.map((sound) => (
                <div key={sound.url} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <span className="font-medium text-slate-200">{sound.name}</span>
                    <span className="ml-2 text-sm text-slate-400">by {sound.author}</span>
                  </div>
                  <a
                    href={sound.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-pp-accent)] hover:underline"
                  >
                    freesound.org &rarr;
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        All sound effects sourced from{' '}
        <a href="https://freesound.org" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-accent)] hover:underline">
          freesound.org
        </a>{' '}
        under Creative Commons licenses.
      </p>
    </div>
  );
}
