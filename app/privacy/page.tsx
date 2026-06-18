import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Manifestasia',
  description: 'Privacy Policy for the Manifestasia app.',
}

const sections = [
  {
    title: 'Information We Collect',
    body: [
      'Account information such as your name, email address, and authentication details when you create or sign in to an account.',
      'App content you choose to provide, including onboarding responses, journal entries, scripts, evidence logs, vision prompts, and practice activity.',
      'Generated or uploaded media if you use features that create, save, or personalize vision images.',
      'Usage and diagnostic information such as device type, app interactions, feature usage, and error logs used to operate and improve the service.',
    ],
  },
  {
    title: 'How We Use Information',
    body: [
      'To provide authentication, save your progress, and personalize your onboarding and daily mindset practices.',
      'To generate and store app content you request, such as AI vision prompts or images.',
      'To maintain app security, troubleshoot issues, prevent abuse, and improve performance and reliability.',
      'To communicate with you about account-related matters, support requests, and important service updates.',
    ],
  },
  {
    title: 'AI Features',
    body: [
      'Manifestasia may send the prompts, journal text, or other content you submit to third-party AI service providers to generate responses, reflections, images, or other requested outputs.',
      'Do not submit sensitive personal information, health information, financial information, or content you do not want processed by AI systems.',
    ],
  },
  {
    title: 'Sharing of Information',
    body: [
      'We do not sell your personal information.',
      'We may share information with service providers that help us operate the app, including hosting, database, analytics, authentication, storage, and AI infrastructure providers.',
      'We may disclose information if required by law, to protect rights and safety, or to enforce our terms and policies.',
    ],
  },
  {
    title: 'Data Retention',
    body: [
      'We retain account information and user-generated content while your account is active or as needed to provide the service.',
      'You may request deletion of your account or personal data by contacting us. Some information may be retained where required by law, security, fraud prevention, or legitimate business records.',
    ],
  },
  {
    title: 'Your Choices',
    body: [
      'You may choose not to provide optional content, though some features may not work without it.',
      'You may request access, correction, or deletion of your personal information by contacting us.',
      'You can stop using the app at any time and may delete the app from your device.',
    ],
  },
  {
    title: 'Security',
    body: [
      'We use reasonable technical and organizational measures designed to protect personal information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.',
    ],
  },
  {
    title: 'Children',
    body: [
      'Manifestasia is not intended for children under 13. We do not knowingly collect personal information from children under 13.',
    ],
  },
  {
    title: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised effective date.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <p className="mb-3 text-sm font-medium text-primary">Manifestasia</p>
        <h1 className="font-serif text-4xl font-medium leading-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-muted-foreground">
          Effective date: May 12, 2026
        </p>

        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <p className="leading-7 text-card-foreground">
            This Privacy Policy explains how Manifestasia collects, uses, and
            protects information when you use our app, website, and related
            services. By using Manifestasia, you agree to the practices described
            in this policy.
          </p>
        </section>

        <div className="mt-10 space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl font-medium">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {section.body.map((item) => (
                  <li key={item} className="flex gap-3 leading-7 text-muted-foreground">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-10 border-t border-border pt-8">
          <h2 className="font-serif text-2xl font-medium">Contact Us</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            If you have questions about this Privacy Policy or want to make a
            privacy request, contact us at{' '}
            <a className="font-medium text-primary underline" href="mailto:support@manifestasia.ai">
              support@manifestasia.ai
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
