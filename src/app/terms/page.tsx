import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'PixelPlush Games Terms of Use — Munomic, LLC.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-8 md:p-12">
        <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">Terms of Use</h1>
        <p className="mb-8 text-sm text-[var(--color-pp-text-muted)]">Last updated: July 19, 2020</p>

        <div className="space-y-8 text-sm leading-relaxed text-[var(--color-pp-text)]">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">Agreement to Terms</h2>
            <p>
              These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity
              (&ldquo;you&rdquo;) and Munomic, LLC., doing business as PixelPlush Games (&ldquo;PixelPlush Games&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo;), concerning your access to and use of the{' '}
              <a href="https://www.pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">https://www.pixelplush.dev</a>{' '}
              website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise
              connected thereto (collectively, the &ldquo;Site&rdquo;). You agree that by accessing the Site, you have read, understood, and
              agreed to be bound by all of these Terms of Use. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN YOU ARE EXPRESSLY
              PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>
            <p className="mt-3">
              We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Use at any time and for any
              reason. We will alert you about any changes by updating the &ldquo;Last updated&rdquo; date of these Terms of Use. It is your
              responsibility to periodically review these Terms of Use to stay informed of updates.
            </p>
            <p className="mt-3">
              The Site is intended for users who are at least 13 years of age. All users who are minors in the jurisdiction in which they
              reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to
              use the Site.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software,
              website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &ldquo;Content&rdquo;) and the
              trademarks, service marks, and logos contained therein (the &ldquo;Marks&rdquo;) are owned or controlled by us or licensed to
              us, and are protected by copyright and trademark laws. The Content and the Marks are provided on the Site &ldquo;AS IS&rdquo;
              for your information and personal use only.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">User Representations</h2>
            <p>By using the Site, you represent and warrant that:</p>
            <ol className="mt-2 ml-5 list-decimal space-y-1">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update it as necessary.</li>
              <li>You have the legal capacity and agree to comply with these Terms of Use.</li>
              <li>You are not under the age of 13.</li>
              <li>You are not a minor in your jurisdiction, or if a minor, you have received parental permission.</li>
              <li>You will not access the Site through automated or non-human means.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose.</li>
              <li>Your use of the Site will not violate any applicable law or regulation.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">Prohibited Activities</h2>
            <p>You may not access or use the Site for any purpose other than that for which we make the Site available. As a user of the Site, you agree not to:</p>
            <ol className="mt-2 ml-5 list-decimal space-y-1">
              <li>Systematically retrieve data from the Site to create a collection or database without written permission.</li>
              <li>Trick, defraud, or mislead us and other users.</li>
              <li>Circumvent, disable, or interfere with security-related features of the Site.</li>
              <li>Disparage, tarnish, or otherwise harm us and/or the Site.</li>
              <li>Use any information obtained from the Site to harass, abuse, or harm another person.</li>
              <li>Make improper use of our support services or submit false reports.</li>
              <li>Use the Site in a manner inconsistent with any applicable laws or regulations.</li>
              <li>Use the Site to advertise or offer to sell goods and services.</li>
              <li>Upload or transmit viruses, Trojan horses, or other disruptive material.</li>
              <li>Engage in any automated use of the system, such as using scripts or bots.</li>
              <li>Delete the copyright or other proprietary rights notice from any Content.</li>
              <li>Attempt to impersonate another user or person.</li>
              <li>Sell or otherwise transfer your profile.</li>
              <li>Upload or transmit passive or active information collection mechanisms.</li>
              <li>Interfere with, disrupt, or create an undue burden on the Site.</li>
              <li>Harass, annoy, intimidate, or threaten any of our employees or agents.</li>
              <li>Attempt to bypass any measures designed to prevent or restrict access to the Site.</li>
              <li>Copy or adapt the Site&apos;s software.</li>
              <li>Decipher, decompile, disassemble, or reverse engineer any software on the Site.</li>
              <li>Use, launch, or distribute any unauthorized automated system (spider, robot, scraper).</li>
              <li>Use a buying agent or purchasing agent to make purchases on the Site.</li>
              <li>Make any unauthorized use of the Site, including collecting user data.</li>
              <li>Use the Site to compete with us or for any revenue-generating endeavor.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">User Generated Contributions</h2>
            <p>
              The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other
              functionality. Contributions may be viewable by other users of the Site and through third-party websites. When you create or
              make available any Contributions, you represent and warrant that your Contributions do not infringe any third-party rights, are
              not false or misleading, are not unsolicited advertising, and do not violate any applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">Contribution License</h2>
            <p>
              By posting your Contributions to any part of the Site, you automatically grant us an unrestricted, unlimited, irrevocable,
              perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right and license to use, copy, reproduce, publish,
              and distribute such Contributions for any purpose. We do not assert any ownership over your Contributions. You retain full
              ownership of all of your Contributions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">Social Media</h2>
            <p>
              As part of the functionality of the Site, you may link your account with online accounts you have with third-party service
              providers (such as Twitch) by providing your Third-Party Account login information through the Site or allowing us to access
              your Third-Party Account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">Third-Party Websites and Content</h2>
            <p>
              The Site may contain links to other websites as well as articles, photographs, text, graphics, pictures, designs, and other
              content belonging to third parties. Such Third-Party Content is not investigated, monitored, or checked for accuracy by us.
              If you decide to leave the Site and access Third-Party Websites, you do so at your own risk.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">Site Management</h2>
            <p>
              We reserve the right, but not the obligation, to: (1) monitor the Site for violations; (2) take appropriate legal action;
              (3) refuse, restrict access to, or disable any Contributions; (4) remove files and content that are excessive in size; and
              (5) otherwise manage the Site to protect our rights and property.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">Contact Us</h2>
            <p>
              For questions about these Terms of Use, contact us at{' '}
              <a href="mailto:support@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">support@pixelplush.dev</a>.
            </p>
            <p className="mt-2">
              Munomic, LLC.<br />
              6520 29th Ave SW<br />
              Seattle, WA 98126<br />
              United States
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
