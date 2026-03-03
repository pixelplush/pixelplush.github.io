import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to PixelPlush with your Twitch account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-3xl font-bold text-white">Log In</h1>
        <p className="mt-4 mb-8 text-slate-400">
          Connect your Twitch account to access your PixelPlush profile.
        </p>
        <button className="rounded-xl bg-purple-600 px-8 py-3 text-lg font-semibold text-white hover:bg-purple-500 transition-colors">
          Log in with Twitch
        </button>
        <p className="mt-4 text-sm text-slate-500">
          Hello from Maaya and Instafluff!
        </p>
      </div>
    </div>
  );
}
