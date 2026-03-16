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
        <h1 className="mb-2 text-3xl font-bold text-white">Privacy Notice</h1>
        <p className="mb-8 text-sm text-slate-400">Last updated: July 19, 2020</p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <p>
            Thank you for choosing to be part of our community at Munomic, LLC., doing business as PixelPlush Games
            (&ldquo;PixelPlush Games&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We are committed to protecting
            your personal information and your right to privacy. If you have any questions or concerns, please contact us at{' '}
            <a href="mailto:support@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">support@pixelplush.dev</a>.
          </p>

          <nav>
            <h2 className="mb-3 text-lg font-semibold text-white">Table of Contents</h2>
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
                'Do We Make Updates to This Notice?',
                'How Can You Contact Us About This Notice?',
              ].map((item, i) => (
                <li key={i}><span className="text-slate-300">{item}</span></li>
              ))}
            </ol>
          </nav>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">1. What Information Do We Collect?</h2>
            <p><strong className="text-white">Personal Information Provided by You.</strong> We collect usernames, email addresses, and other similar information when you register on our Services.</p>
            <p className="mt-2"><strong className="text-white">Payment Data.</strong> We may collect data necessary to process your payment if you make purchases. All payment data is stored by PayPal. You may find their privacy notice at{' '}
              <a href="https://www.paypal.com/va/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-accent)] hover:underline">paypal.com/privacy</a>.
            </p>
            <p className="mt-2"><strong className="text-white">Social Media Login Data.</strong> We may provide you with the option to register using your existing Twitch account details.</p>
            <p className="mt-2"><strong className="text-white">Automatically Collected Information.</strong> We automatically collect certain information when you visit our Services, including IP address, browser type, device information, and usage data. This information is needed to maintain security and for analytics.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">2. How Do We Use Your Information?</h2>
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
            <h2 className="mb-3 text-lg font-semibold text-white">3. Will Your Information Be Shared with Anyone?</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">4. Who Will Your Information Be Shared With?</h2>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong className="text-white">Cloud Computing Services:</strong> Amazon Web Services (AWS)</li>
              <li><strong className="text-white">Invoice and Billing:</strong> PayPal</li>
              <li><strong className="text-white">User Account Registration and Authentication:</strong> Twitch Authentication</li>
              <li><strong className="text-white">Web and Mobile Analytics:</strong> Google Analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">5. Do We Use Cookies?</h2>
            <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">6. How Do We Handle Your Social Logins?</h2>
            <p>Our Services offer you the ability to register and login using your third-party social media account (Twitch). Where you choose to do this, we will receive certain profile information about you from your social media provider. We will use the information we receive only for the purposes described in this privacy notice.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">7. Is Your Information Transferred Internationally?</h2>
            <p>Our servers are located in the United States. If you are accessing our Services from outside the US, please be aware that your information may be transferred to, stored, and processed by us in the United States.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">8. How Long Do We Keep Your Information?</h2>
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required by law.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">9. How Do We Keep Your Information Safe?</h2>
            <p>We have implemented appropriate technical and organizational security measures designed to protect your personal information. However, no electronic transmission or storage technology can be guaranteed to be 100% secure.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">10. What Are Your Privacy Rights?</h2>
            <p>In some regions (like the European Economic Area), you have certain rights under applicable data protection laws, including the right to request access, rectification, or erasure of your personal information. If you have questions, email us at{' '}
              <a href="mailto:support@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">support@pixelplush.dev</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">11. Controls for Do-Not-Track Features</h2>
            <p>We do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">12. Do California Residents Have Specific Privacy Rights?</h2>
            <p>Yes. California Civil Code Section 1798.83, also known as the &ldquo;Shine The Light&rdquo; law, permits our users who are California residents to request information about personal information disclosed to third parties for direct marketing purposes.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">13. Do We Make Updates to This Notice?</h2>
            <p>Yes, we will update this notice as necessary to stay compliant with relevant laws. The updated version will be indicated by an updated &ldquo;Revised&rdquo; date.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">14. How Can You Contact Us About This Notice?</h2>
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
