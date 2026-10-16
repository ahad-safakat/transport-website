import { displayName } from '../config/company'
import { LegalLayout } from '../components/layout/LegalLayout'
import { Seo } from '../components/seo/Seo'

export function TermsPage() {
  return (
    <>
      <Seo
        title={`Terms and Conditions | ${displayName()}`}
        description="Website terms for transportation enquiries and quotations."
        path="/terms"
      />
      <LegalLayout title="Terms and Conditions">
        <section>
          <h2>Enquiries are not bookings</h2>
          <p>
            This website is an information and enquiry channel for point-to-point transportation. Submitting a form, chatting
            with the website assistant, or sending a WhatsApp message is a request for a quotation. It does not create a
            contract of carriage, reserve a vehicle, or confirm price, schedule, or availability.
          </p>
        </section>
        <section>
          <h2>Confirmation of transport</h2>
          <p>
            Transportation proceeds only after {displayName()} and the customer confirm the vehicle, route, cargo, timing, and
            commercial terms in a separate written confirmation or agreement. Those confirmed terms govern the movement.
          </p>
        </section>
        <section>
          <h2>Accuracy of information</h2>
          <p>
            Customers are responsible for providing accurate pickup, delivery, and cargo details, including weight and any
            handling requirements. Specialised, hazardous, refrigerated, or oversized cargo is accepted only when separately
            confirmed in writing.
          </p>
        </section>
        <section>
          <h2>Website content</h2>
          <p>
            Website content is general information. It is not a claim about fleet size, certifications, insurance, licences, or
            coverage beyond what is expressly confirmed. The automated assistant is not a human agent and cannot bind the
            company.
          </p>
        </section>
      </LegalLayout>
    </>
  )
}
