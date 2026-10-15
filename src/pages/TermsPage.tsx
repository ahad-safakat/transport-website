import { displayName } from '../config/company'
import { Seo } from '../components/seo/Seo'

export function TermsPage() {
  return (
    <article className="container-site section-pad max-w-3xl pt-28">
      <Seo
        title={`Terms and Conditions | ${displayName()}`}
        description="Website terms for transportation enquiries."
        path="/terms"
      />
      <p className="eyebrow">Legal</p>
      <h1 className="display-title mt-3 text-4xl">Terms and Conditions</h1>
      <p className="mt-4 text-sm text-slate">Starter copy for legal review before launch. Not a compliance certification.</p>
      <div className="mt-8 space-y-5 text-sm leading-7 text-slate">
        <p>
          This website is an information and enquiry channel for point-to-point transportation. Submitting a form,
          chatting with the website assistant, or sending a WhatsApp message is a request for a quotation. It does
          not create a carriage contract, reserve a vehicle, or confirm price, schedule, or availability.
        </p>
        <p>
          Transportation proceeds only after the company and the customer confirm the vehicle, route, cargo, timing,
          and commercial terms in a separate agreement or written confirmation.
        </p>
        <p>
          Website content must not be read as a claim about fleet size, certifications, insurance, licences, or
          coverage that has not been independently confirmed. The automated assistant is not a human agent and cannot
          bind the company.
        </p>
        <p>Replace this page with counsel-approved language before public launch. {displayName()}.</p>
      </div>
    </article>
  )
}
