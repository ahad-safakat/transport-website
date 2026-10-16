import { displayName } from '../config/company'
import { LegalLayout } from '../components/layout/LegalLayout'
import { Seo } from '../components/seo/Seo'

export function PrivacyPage() {
  return (
    <>
      <Seo
        title={`Privacy Policy | ${displayName()}`}
        description="How this transportation website collects, uses, and shares enquiry information."
        path="/privacy"
      />
      <LegalLayout title="Privacy Policy">
        <section>
          <h2>Information we collect</h2>
          <p>We only collect information you choose to submit through the quotation form, general enquiry form, or website assistant:</p>
          <ul>
            <li>Name, mobile number, and optional company name and email address.</li>
            <li>Pickup and delivery locations, preferred pickup date, vehicle type, cargo description, and approximate weight.</li>
            <li>Any additional requirements or message you write.</li>
          </ul>
          <p>
            The website assistant runs in your browser. Chat messages are not stored by us unless you copy them into a form and
            submit it.
          </p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>
            Enquiry details are used only to review your transportation request, contact you about it, and prepare a quotation.
            We do not sell personal information or use it for unrelated marketing.
          </p>
        </section>
        <section>
          <h2>Who receives it</h2>
          <ul>
            <li>
              <strong className="text-navy">Email delivery provider</strong> — form submissions are sent through our configured
              email service (for example, Resend) to the company’s enquiry inbox.
            </li>
            <li>
              <strong className="text-navy">WhatsApp</strong> — only if you choose to open a WhatsApp chat. The prefilled message is
              shared with WhatsApp (Meta) when you send it.
            </li>
            <li>
              <strong className="text-navy">Website hosting provider</strong> — standard technical logs such as IP address may be
              processed to deliver the website and prevent abuse.
            </li>
          </ul>
        </section>
        <section>
          <h2>Retention and your choices</h2>
          <p>
            Enquiry records are kept only as long as needed to respond and for reasonable business records. You may ask us to
            access, correct, or delete the details you submitted by contacting us using the published contact details.
          </p>
        </section>
        <section>
          <h2>Driver and operational data</h2>
          <p>This public website does not display or collect driver records, internal vehicle availability, or operational data.</p>
        </section>
      </LegalLayout>
    </>
  )
}
