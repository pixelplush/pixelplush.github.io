import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'PixelPlush Games Privacy Notice — Munomic, LLC.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-8 md:p-12">
        <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">Privacy Notice</h1>
        <p className="mb-8 text-sm text-[var(--color-pp-text-muted)]">Last updated: May 9, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-[var(--color-pp-text)]">
          <p>
            Thank you for choosing to be part of our community at Munomic, LLC., doing business as PixelPlush Games
            (&ldquo;PixelPlush Games&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We are committed to protecting
            your personal information and your right to privacy. If you have any questions or concerns, please contact us at{' '}
            <a href="mailto:support@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">support@pixelplush.dev</a>.
          </p>

          <nav>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">Table of Contents</h2>
            <ol className="grid grid-cols-1 gap-1 list-decimal ml-5 text-[var(--color-pp-accent)]">
              {[
                'What Information Do We Collect?',
                'How Do We Use Your Information?',
                'Will Your Information Be Shared?',
                'Who Will Your Information Be Shared With?',
                'Do We Use Cookies?',
                'How Do We Handle Your Social Logins?',
                'Is Your Information Transferred Internationally?',
                'How Long Do We Keep Your Information?',
                'How Do We Keep Your Information Safe?',
                'What Are Your Privacy Rights?',
                'Controls for Do-Not-Track Features',
                'Do California Residents Have Specific Privacy Rights?',
                'Children\u2019s Privacy',
                'Data Deletion',
                'Do We Make Updates to This Notice?',
                'How Can You Contact Us About This Notice?',
              ].map((item, i) => (
                <li key={i}><span className="text-[var(--color-pp-text)]">{item}</span></li>
              ))}
            </ol>
          </nav>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">1. What Information Do We Collect?</h2>
            <p><strong className="text-[var(--color-pp-headings)]">Personal Information Provided by You.</strong> We collect usernames, email addresses, and other similar information when you register on our Services. When you log in via Twitch, we collect your Twitch username, display name, and profile picture to identify you on our gaming platform.</p>
            <p className="mt-2"><strong className="text-[var(--color-pp-headings)]">Payment Data.</strong> We may collect data necessary to process your payment if you make purchases, including purchases of virtual currency (coins) and in-game cosmetic items. All payment data is stored by our payment processors. We do not store your full payment card details on our servers. You may find their privacy notices here:</p>
            <ul className="ml-5 mt-1 list-disc space-y-1">
              <li><a href="https://www.paypal.com/va/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-accent)] hover:underline">PayPal Privacy Policy</a></li>
              <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-accent)] hover:underline">Stripe Privacy Policy</a></li>
            </ul>
            <p className="mt-2"><strong className="text-[var(--color-pp-headings)]">Social Media Login Data.</strong> We provide the option to register and log in using your Twitch account. When you do so, we receive your Twitch username, display name, email address, and profile picture. Twitch is the primary authentication method for our Services.</p>
            <p className="mt-2"><strong className="text-[var(--color-pp-headings)]">Virtual Currency and Transaction Data.</strong> We process transactions related to virtual currency (coins) purchases and in-game cosmetic items (characters, outfits, pets, and add-ons). We maintain records of your purchases, account balances, and transaction history.</p>
            <p className="mt-2"><strong className="text-[var(--color-pp-headings)]">Automatically Collected Information.</strong> We automatically collect certain information when you visit our Services, including IP address, browser type, device information, and usage data. This information is needed to maintain security and for analytics.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">2. How Do We Use Your Information?</h2>
            <ul className="ml-5 list-disc space-y-1">
              <li>To facilitate account creation and logon process</li>
              <li>To manage user accounts</li>
              <li>To send administrative information to you</li>
              <li>To protect our Services</li>
              <li>To enforce our terms, conditions and policies</li>
              <li>To respond to legal requests and prevent harm</li>
              <li>To fulfill and manage your orders</li>
              <li>To deliver and facilitate delivery of services to the user</li>
              <li>To respond to user inquiries/offer support</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">3. Will Your Information Be Shared with Anyone?</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">4. Who Will Your Information Be Shared With?</h2>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong className="text-[var(--color-pp-headings)]">Cloud Computing Services:</strong> Amazon Web Services (AWS), Microsoft Azure</li>
              <li><strong className="text-[var(--color-pp-headings)]">Invoice and Billing:</strong> PayPal, Stripe</li>
              <li><strong className="text-[var(--color-pp-headings)]">User Account Registration and Authentication:</strong> Twitch Authentication</li>
              <li><strong className="text-[var(--color-pp-headings)]">Web and Mobile Analytics:</strong> Google Analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">5. Do We Use Cookies?</h2>
            <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">6. How Do We Handle Your Social Logins?</h2>
            <p>Our Services offer you the ability to register and log in using your Twitch account. Twitch is the primary login method for PixelPlush Games. When you choose to do this, we receive your Twitch username, display name, email address, and profile picture. We use this information to create and manage your account, display your identity in games, and track your scores and purchases. We will use the information we receive only for the purposes described in this privacy notice.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">7. Is Your Information Transferred Internationally?</h2>
            <p>Our servers are located in the United States. If you are accessing our Services from outside the US, please be aware that your information may be transferred to, stored, and processed by us in the United States.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">8. How Long Do We Keep Your Information?</h2>
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required by law.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">9. How Do We Keep Your Information Safe?</h2>
            <p>We have implemented appropriate technical and organizational security measures designed to protect your personal information. However, no electronic transmission or storage technology can be guaranteed to be 100% secure.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">10. What Are Your Privacy Rights?</h2>
            <p>In some regions (like the European Economic Area), you have certain rights under applicable data protection laws, including the right to request access, rectification, or erasure of your personal information. If you have questions, email us at{' '}
              <a href="mailto:support@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">support@pixelplush.dev</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">11. Controls for Do-Not-Track Features</h2>
            <p>We do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">12. Do California Residents Have Specific Privacy Rights?</h2>
            <p>Yes. California Civil Code Section 1798.83, also known as the &ldquo;Shine The Light&rdquo; law, permits our users who are California residents to request information about personal information disclosed to third parties for direct marketing purposes.</p>
            <p className="mt-2">Additionally, the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), provides California residents with the following rights:</p>
            <ul className="ml-5 mt-1 list-disc space-y-1">
              <li>The right to know what personal information we collect, use, disclose, and sell</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to opt out of the sale or sharing of your personal information</li>
              <li>The right to non-discrimination for exercising your privacy rights</li>
              <li>The right to correct inaccurate personal information</li>
            </ul>
            <p className="mt-2">We do not sell personal information. To exercise any of these rights, please contact us at{' '}
              <a href="mailto:privacy@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">privacy@pixelplush.dev</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">13. Children&apos;s Privacy</h2>
            <p>Our Services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information as quickly as possible. If you believe we have collected information from a child under 13, please contact us at{' '}
              <a href="mailto:privacy@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">privacy@pixelplush.dev</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">14. Data Deletion</h2>
            <p>You may request deletion of your account and associated personal data at any time by contacting us at{' '}
              <a href="mailto:support@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">support@pixelplush.dev</a>.
              Upon receiving a verified request, we will delete your personal information from our active databases within 30 days. Some information may be retained in backup archives or as required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">15. Do We Make Updates to This Notice?</h2>
            <p>Yes, we will update this notice as necessary to stay compliant with relevant laws. The updated version will be indicated by an updated &ldquo;Revised&rdquo; date.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">16. How Can You Contact Us About This Notice?</h2>
            <p>
              If you have questions or comments about this notice, you may email us at{' '}
              <a href="mailto:privacy@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">privacy@pixelplush.dev</a> or by post to:
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
