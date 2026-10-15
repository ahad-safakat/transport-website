import { displayName } from '../config/company'
import { Seo } from '../components/seo/Seo'

export function PrivacyPage() {
  return (
    <article className="container-site section-pad max-w-3xl pt-28">
      <Seo
        title={`Privacy Policy | ${displayName()}`}
        description="How this transportation website handles enquiry information."
        path="/privacy"
      />
      <p className="eyebrow">Legal</p>
      <h1 className="display-title mt-3 text-4xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-slate">Starter copy for legal review before launch. Not a compliance certification.</p>
      <div className="mt-8 space-y-5 text-sm leading-7 text-slate">
        <p>
          This website collects information that you choose to submit through the quotation and contact forms:
          name, optional company name, mobile number, optional email address, pickup and delivery details, cargo
          description, and related transportation requirements.
        </p>
        <p>
          That information is used only to respond to your enquiry. If email delivery is configured, the message is
          sent through the email provider named in the server environment (for example, Resend) to the company’s
          notification inbox. If you continue on WhatsApp, the details you reviewed are shared with WhatsApp because
          you opened the click-to-chat link.
        </p>
        <p>
          We do not sell personal information. We do not collect driver records or expose internal fleet systems on
          this public website. You may ask for enquiry records to be deleted by contacting the published email or
          telephone number once those details are configured.
        </p>
        <p>Replace this page with counsel-approved language before public launch.</p>
      </div>
    </article>
  )
}
