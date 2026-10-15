MASTER PROMPT: BUILD A PREMIUM TRANSPORTATION COMPANY WEBSITE
Act as an elite web designer, senior full-stack developer, UI/UX architect, brand strategist, and conversion optimization specialist.
Your task is to design and build a complete, premium, production-ready website for a transportation company operating in India.
This is a real client project. The website must look exceptionally professional, communicate trust, attract corporate customers, and generate genuine transportation enquiries.
I do not want a generic template, a static landing page, or a basic beginner-level website. I want an impressive, modern, commercially usable website with refined animations, outstanding visual design, working enquiry forms, WhatsApp integration, and a customer-facing chatbot.
Build the actual website in the current coding environment. Inspect the project first, implement the files, run the application, test the important features, and fix errors. Do not stop after giving me a plan or creating a homepage mockup.
If information is missing, use clearly marked placeholders and centralized configuration rather than inventing company facts.

1. UNDERSTAND THE BUSINESS
The company specializes in transporting goods directly from Point A to Point B.
It is a premium transportation company, not a warehousing or storage company.
The company does not operate warehouses or stock-holding facilities as part of its advertised service offering.
The website should position the business as a dependable transportation partner for companies, manufacturers, traders, distributors, and other businesses that need cargo moved between locations.
The main business objective is to generate qualified enquiries and help the company establish a strong digital presence.
The public website is separate from a future private driver-management platform. Do not expose driver records, internal availability information, private operational data, or unconfirmed vehicle availability on this website.
Brand personality
The brand should feel:
* Premium.
* Trustworthy.
* Professional.
* Modern.
* Dependable.
* Efficient.
* Business-focused.
* Capable of serving customers across its confirmed Indian operating regions.
Do not make the website look like a cheap local truck-booking template.
Do not portray the company as an enormous multinational corporation unless the supplied facts support that positioning.
Premium design should come from strong branding, photography, typography, excellent usability, and professional communication.

2. COMPANY CONFIGURATION
Create a centralized company configuration file so the website can be customized easily.
Include:
* Company name: [COMPANY NAME]
* Tagline: [TAGLINE]
* Headquarters: [CITY, STATE, INDIA]
* WhatsApp number: [WHATSAPP NUMBER WITH COUNTRY CODE]
* Business telephone: [PHONE NUMBER]
* Business email: [EMAIL ADDRESS]
* Office address: [OFFICE ADDRESS]
* Serviceable regions: [CONFIRMED REGIONS]
* Logo: [LOGO ASSET]
* Instagram URL: [INSTAGRAM URL]
* LinkedIn URL: [LINKEDIN URL]
* Website domain: [DOMAIN]
Suggested file: src/config/company.ts, or an equivalent location appropriate to the existing project.
Centralize company information, services, vehicle categories, contact details, navigation items, and serviceable regions.
Make sure changing the company name or WhatsApp number updates the relevant sections throughout the website.
Do not invent company history, founding year, fleet size, number of customers, certifications, client logos, customer reviews, or operational statistics.
If a value has not been supplied, omit it or use an editable placeholder that is not presented as a verified fact.

3. TECHNOLOGY AND PROJECT SETUP
First inspect the existing project, its framework, dependencies, file structure, and available scripts.
Preserve existing working code wherever appropriate.
If the environment is empty, use a suitable modern stack:
* React.
* TypeScript.
* Vite.
* Tailwind CSS.
* React Router if multiple routes are appropriate.
* Lucide icons.
* Framer Motion or another appropriate animation library if needed.
If a different existing framework is already configured, work with it rather than unnecessarily migrating the project.
Use reusable components, clean architecture, readable code, strong typing, and centralized configuration.
Do not put the entire application into one enormous component.
Do not install unnecessary dependencies.

4. VISUAL DESIGN SYSTEM
Create a premium commercial transportation brand identity.
Color palette
Use:
* Deep navy: #0B1220
* Dark charcoal: #151C28
* White: #FFFFFF
* Light background: #F4F6F8
* Premium orange accent: #F28C28
* Secondary text: a readable slate gray.
Use the orange accent selectively for important CTAs, active navigation states, highlights, and small visual details.
Keep the color palette in reusable design tokens so it can be adjusted later.
Typography
Use a modern, premium sans-serif font such as Manrope or Inter.
Create a clear hierarchy between:
* Hero headlines.
* Section headings.
* Supporting text.
* Service titles.
* Navigation.
* Buttons.
* Form labels.
* Small metadata.
Use confident headlines and concise copy.
Visual characteristics
The website should feature:
* Large editorial-style headlines.
* Full-width truck photography.
* Carefully composed image overlays.
* Generous but controlled whitespace.
* Consistent spacing.
* Clean grids.
* Refined button styles.
* Subtle borders.
* Excellent alignment.
* Premium photography.
* Smooth transitions.
* Elegant navigation.
* Strong mobile layouts.
Avoid excessive gradients, excessive rounded cards, cluttered layouts, generic stock-template styling, and distracting animation.
Use authentic-looking transportation imagery: heavy commercial trucks, modern freight vehicles, highway journeys, cargo transport, and long-distance driving.
Do not use warehouse shelves, storage facilities, fulfilment centres, or inventory-management imagery.
Use properly licensed or otherwise permitted images. Do not hotlink unreliable image URLs. Prefer stable assets or an image service with a documented setup and appropriate fallbacks.

5. WEBSITE NAVIGATION
Create a premium navigation bar containing:
* Home.
* About Us.
* Services.
* Coverage.
* Contact.
Add a prominent CTA:
REQUEST A QUOTE
The navigation should be transparent or visually integrated with the hero at the top, then transition into a readable solid or semi-solid background when scrolling if appropriate.
Requirements:
* Smooth navigation.
* Working anchor links or routes.
* Active section indication where appropriate.
* Responsive mobile menu.
* Keyboard accessibility.
* Correct focus states.
* No overlap between navigation elements.
* No horizontal overflow on mobile.
On mobile, implement a working hamburger menu with proper open, close, and Escape-key behavior where appropriate.

6. HERO SECTION — MAKE THE FIRST IMPRESSION EXCEPTIONAL
Create a cinematic, premium homepage hero.
Use a striking photograph of a modern heavy-duty freight truck travelling on an Indian highway, with professional composition and sufficient negative space for text.
The truck should be the primary visual focus.
Use a subtle dark overlay where needed to maintain text contrast.
Suggested headline:
"YOUR CARGO. OUR COMMITMENT."
Suggested supporting copy:
"Premium transportation solutions connecting businesses from pickup to destination."
Alternative supporting message:
"Dependable freight transportation for businesses moving goods across cities and states."
Use the wording that best fits the final visual design.
Add two buttons:
Primary: "Request a Quote"
Secondary: "Explore Our Services"
The primary button should scroll to or navigate to the quote form.
The secondary button should navigate to the services section.
Add a subtle scroll indicator if it complements the design.
Use restrained entrance animations for the heading, supporting copy, and buttons.
Do not delay the main content while waiting for animation libraries or external images.
The hero must look excellent on both mobile and desktop.

7. ABOUT US SECTION
Create a refined company introduction section.
Suggested heading:
"TRANSPORTATION BUILT ON TRUST."
Explain how the company helps businesses transport cargo between agreed pickup and delivery points.
Focus on:
* Professional transportation coordination.
* Reliable communication.
* Customer-focused service.
* Efficient vehicle coordination.
* Commitment to agreed transportation arrangements.
* Long-term business relationships.
Use concise, professional copy.
Include the company's mission, vision, and core values as editable content.
Use a complementary truck or highway image in an editorial layout.
Do not invent the company's history, founding date, management team, fleet size, or experience.
If those details are supplied later, make them easy to add.

8. SERVICES SECTION
Suggested heading:
"TRANSPORTATION SOLUTIONS THAT MOVE BUSINESS FORWARD."
Build a premium services section using high-quality images, restrained animations, and consistent typography.
Potential service categories:
1. Full Truckload Transportation.
2. Commercial Goods Transportation.
3. Intercity Transportation.
4. Interstate Transportation.
5. Part-Load Transportation, only if offered.
6. Other confirmed transportation services.
Each service should have:
* A title.
* A short description.
* Relevant photography or an appropriate icon.
* A "Request a Quote" CTA.
* A link or action that opens the quote form with the selected service prefilled.
Make the service catalogue configurable.
Do not automatically advertise every potential category. The company must confirm which services it actually offers.
Do not claim that specialized, refrigerated, hazardous, oversized, or other regulated cargo is accepted unless confirmed.
The company transports goods from Point A to Point B. Do not advertise warehousing, stock holding, inventory management, fulfilment, or storage.

9. WHY CHOOSE US SECTION
Create a strong section explaining the company's transportation value proposition.
Suggested heading:
"WHY BUSINESSES CHOOSE US."
Potential themes:
* Customer-focused transportation coordination.
* Professional communication.
* Flexible vehicle requirements, where supported.
* Clear quotation and confirmation process.
* Intercity and interstate transportation capabilities, where offered.
* A direct point of contact for enquiries.
* Commitment to agreed service arrangements.
Use elegant visual cards, numbered benefits, or an editorial layout.
Avoid exaggerated claims such as "100% guaranteed delivery", "India's number one transporter", or "lowest prices in India".
Do not present unverified claims as established facts.

10. HOW IT WORKS SECTION
Build a clear four-step process.
STEP 1 — SHARE YOUR REQUIREMENTS
The customer provides pickup location, destination, cargo information, required vehicle, and preferred pickup date.
STEP 2 — RECEIVE A QUOTATION
The company reviews the enquiry and contacts the customer with pricing and availability information.
STEP 3 — CONFIRM THE TRANSPORT
The company and customer confirm the vehicle, schedule, price, and other agreed details.
STEP 4 — MOVE YOUR CARGO
The transportation is carried out according to the confirmed arrangement.
Use a sophisticated timeline or numbered process layout.
The layout should become vertical on mobile.
Do not claim that a truck is automatically assigned immediately after submitting a form.
Actual driver matching and assignment will belong to a separate private operations platform.

11. SERVICE COVERAGE SECTION
Suggested heading:
"CONNECTING BUSINESSES ACROSS INDIA."
Create a premium visual section demonstrating the company's confirmed transportation coverage.
Include:
* An India-focused map, illustration, or route visual.
* Configurable serviceable cities, states, or routes.
* A clear explanation of transportation coverage.
* A CTA for customers to enquire about other routes.
Use only real coverage information supplied by the company.
Do not suggest that the company operates warehouses, offices, or depots across India.
Do not imply that every route is available.
If an interactive map is used, implement it using an appropriate mapping solution and document the required API setup.
If no map API key is available, show an attractive static visual or a clean list of configured service regions.
Never display fabricated live truck positions or fake tracking data.

12. REQUEST A QUOTE FORM
This is a critical business feature.
Build a professional, fully responsive transportation enquiry form.
The form should feel like part of a premium commercial website rather than an administrative spreadsheet.
Customer details
* Full name.
* Company name, optional.
* Mobile number.
* Email address, optional.
Transportation details
* Pickup address or location.
* Pickup city.
* Pickup state.
* Delivery address or location.
* Delivery city.
* Delivery state.
* Preferred pickup date.
* Required vehicle type.
* Cargo description.
* Approximate cargo weight.
* Additional requirements, optional.
Vehicle types must be configurable according to the company's actual fleet or sourcing capabilities.
Provide an "Other / Not Sure" option.
Form functionality
Implement:
* Required-field validation.
* Appropriate phone and email validation.
* Date validation.
* Inline error messages.
* Clear focus states.
* Submission loading state.
* Duplicate-submission prevention.
* Success and failure states.
* Preservation of form values when submission fails.
* Mobile-friendly form controls.
* Accessible labels.
* Spam-protection measures appropriate to the architecture.
Real submission behavior
If a backend exists, integrate with it.
If there is no backend, create an appropriate server-side submission endpoint.
Email notifications can be implemented through a service such as Resend, configured through server-side environment variables.
Example environment variables:
RESEND_API_KEY= QUOTE_NOTIFICATION_EMAIL=
Provide an .env.example file with placeholders, not real secrets.
Never expose email-provider API keys in frontend code.
A successful form submission must actually reach the configured destination.
Do not display a success message merely because the submit button was clicked.
If the backend or email service is not configured, explain the problem and provide a clear WhatsApp fallback.
WhatsApp enquiry fallback
Offer a button allowing the customer to review their details and continue in WhatsApp with a prefilled message.
The customer must explicitly click the button and send the message themselves.
Do not silently discard the form data or pretend the request was submitted to the company's backend.

13. FLOATING WHATSAPP BUTTON
Implement a polished floating WhatsApp button in the bottom-right corner.
It should remain visible across the website without obstructing essential content.
Use the configured company WhatsApp number.
Construct the official click-to-chat link in this format:
https://wa.me/WHATSAPP_NUMBER?text=ENCODED_MESSAGE
The phone number must contain the international country code, without the plus sign, spaces, or punctuation.
For an Indian number, configure the correct number with the country code 91.
Suggested default message:
"Hello, I visited your website and would like to enquire about your transportation services. Could you please assist me with a quotation?"
Requirements:
* Open WhatsApp or WhatsApp Web.
* Prefill the enquiry message.
* Work on desktop and mobile.
* Use safe external-link behavior.
* Have an accessible label.
* Use the correct configured number.
* Hide or disable the action gracefully if the number is not configured.
Allow contextual messages from the quote form to include the customer's chosen pickup, destination, and vehicle details after the customer explicitly initiates the action.
Do not send WhatsApp messages automatically.

14. FLOATING CHATBOT — TRANSPORTATION ASSISTANT
Create a custom, premium chat widget in the bottom-right corner.
This is a transportation enquiry assistant, not a generic AI chatbot.
The chat launcher should look professional and inviting.
Suggested launcher text:
"Need transport?"
When opened, show:
* Company name or logo.
* Welcome message.
* Close button.
* Chat history for the current session.
* Quick-reply buttons.
* Text input.
* Send button.
* WhatsApp contact option.
Suggested greeting:
"Hello! Welcome to [COMPANY NAME]. Where would you like to transport your goods today?"
Quick-reply options
1. Get a Transportation Quote.
2. Explore Our Services.
3. Check Serviceable Routes.
4. Contact Us on WhatsApp.
Quote conversation
When the customer selects "Get a Transportation Quote", guide them through:
1. Pickup location.
2. Destination.
3. Required vehicle type.
4. Cargo description.
5. Preferred pickup date, if available.
Show the collected details back to the customer.
Offer two actions:
* "Continue to Quote Form".
* "Continue on WhatsApp".
When the customer continues to the full form, transfer the collected information into the appropriate fields.
When the customer chooses WhatsApp, prepare a message containing the relevant details for their review.
Do not automatically submit forms or send messages.
Service questions
When a visitor asks about services, respond using the company's configured service catalogue.
When a visitor asks about routes, use the configured serviceable regions.
When the chatbot cannot verify a route, say that the company team needs to confirm it.
Free-text handling
Implement basic scripted intent recognition for common questions:
* What services do you offer?
* How do I request a quote?
* Which cities do you serve?
* What truck types can I request?
* How can I contact the company?
* How do I transport goods between two cities?
* Can you confirm vehicle availability?
For unknown questions, respond honestly and offer direct contact with the company.
Never invent:
* Prices.
* Delivery times.
* Truck availability.
* Driver identities.
* Live tracking information.
* Confirmed routes.
* Service guarantees.
Technical chatbot requirements
* Implement a functional scripted assistant without a mandatory AI API subscription.
* Keep chatbot code modular so an AI service can be integrated later.
* Do not pretend that a human is answering when responses are automated.
* Ensure the open and close actions work.
* Support keyboard navigation and appropriate Enter-key behavior.
* Validate empty messages.
* Prevent accidental duplicate actions.
* Ensure the chat panel fits on small screens.
* Prevent the chat widget and WhatsApp button from overlapping.
* Provide accessible labels and focus states.
* Respect reduced-motion preferences.
* Do not let the chatbot prevent the rest of the website from loading.
If an AI API is added later, all secret keys must remain on the server.

15. CONTACT SECTION
Build a premium contact section.
Include configurable:
* Phone number.
* WhatsApp number.
* Business email.
* Office address.
* Social links.
* General enquiry form.
Use appropriate tel: and mailto: links.
Hide unavailable contact details instead of displaying fake information.
Suggested heading:
"LET'S MOVE YOUR BUSINESS FORWARD."
Suggested supporting text:
"Tell us about your transportation requirements. Our team will review your enquiry and help you understand the available options."
Provide clear contact actions.

16. FOOTER
Build a refined footer with:
* Company logo.
* Company name.
* Short transportation-focused introduction.
* Navigation.
* Confirmed services.
* Contact details.
* WhatsApp link.
* Social links, if configured.
* Privacy Policy.
* Terms and Conditions.
* Dynamically generated copyright year.
Create starter privacy and terms pages with appropriate editable content for review before launch.
Do not claim legal compliance or invent registration details.

17. ANIMATIONS AND MICRO-INTERACTIONS
Add refined animations:
* Hero content entrance.
* Subtle section reveals.
* Button hover transitions.
* Image hover effects.
* Navigation transitions.
* Service-card interactions.
* Smooth scrolling.
* Chat widget transitions.
* Mobile menu transitions.
* Form submission feedback.
Use an animation library only when useful.
Respect prefers-reduced-motion.
Do not over-animate the website.
The page should remain fast, readable, and usable when animations are disabled.
Do not let animation effects obscure content or block user interactions.

18. MOBILE RESPONSIVENESS
The website must work exceptionally well on:
* 360px mobile screens.
* 390px mobile screens.
* Tablets.
* Laptops.
* 1440px desktop screens.
* Larger desktop displays.
Check:
* Navigation.
* Hero text wrapping.
* Hero image cropping.
* Section spacing.
* Service grids.
* Coverage section.
* Form fields.
* Chatbot dimensions.
* WhatsApp button position.
* Footer layout.
* Touch target sizes.
There must be no horizontal overflow, clipped content, overlapping controls, or inaccessible forms.
On mobile, the floating chatbot should fit inside the viewport and not cover critical form actions.

19. SEO AND PERFORMANCE
Implement:
* Unique page titles.
* Meta descriptions.
* Canonical URL configuration when the production domain is known.
* Open Graph metadata.
* Social-sharing metadata.
* Semantic HTML.
* Correct heading hierarchy.
* Descriptive image alt text.
* Favicon.
* Configurable logo.
* Sitemap where appropriate.
* Robots.txt.
* Search-engine-friendly copy.
* Appropriate Organization or LocalBusiness structured data where supported by verified facts.
Optimize images and avoid unnecessary dependencies.
Use lazy loading for appropriate below-the-fold images.
Prevent layout shifts.
Keep the initial page load efficient.
Ensure the website works on slower mobile connections.
Do not create fake reviews, fake ratings, or fabricated structured data.

20. SECURITY AND PRIVACY
* Keep API keys and server secrets out of frontend code.
* Validate form submissions on the server.
* Sanitize and safely handle user input.
* Add reasonable spam protection and rate limiting.
* Do not expose private driver information.
* Do not collect unnecessary personal information.
* Document what external providers receive customer data.
* Use HTTPS in production.
* Keep secrets out of source control.
* Provide a suitable privacy notice near enquiry forms.

21. TEST THE COMPLETE WEBSITE
After implementation, test:
1. The application starts successfully.
2. The production build succeeds.
3. Navigation links work.
4. The mobile menu works.
5. All CTAs navigate correctly.
6. Service-specific buttons prefill the selected service.
7. Form validation works.
8. Invalid inputs are handled properly.
9. The backend submission endpoint works.
10. Email configuration errors are handled properly.
11. WhatsApp links use the configured number.
12. WhatsApp messages are encoded correctly.
13. The chatbot opens and closes.
14. Quick replies work.
15. The chatbot handles unknown questions safely.
16. Chat details transfer into the quote form.
17. Missing configuration does not crash the website.
18. No false submission-success messages are displayed.
19. Images load correctly.
20. The mobile layout has no horizontal overflow.
21. The browser console has no avoidable errors.
22. The website can be deployed using documented instructions.
Run the available build and test commands.
Fix the errors you discover.
Clearly identify any external integration that cannot be verified because credentials are unavailable.

22. REQUIRED PROJECT DELIVERABLES
Deliver:
* Complete source code.
* All major website sections.
* Responsive navigation.
* Centralized company configuration.
* Configurable service listings.
* Request-a-quote form.
* Backend submission endpoint if needed.
* WhatsApp integration.
* Floating transportation chatbot.
* Contact section.
* Footer.
* Privacy and terms starter pages.
* SEO metadata.
* Favicon and logo configuration.
* .env.example.
* Appropriate .gitignore.
* README.
* Setup instructions.
* Development commands.
* Production build commands.
* Deployment instructions.
* Domain configuration instructions.
* WhatsApp configuration instructions.
* Email provider configuration instructions.
* Testing results and known limitations.
Create actual files in the project environment rather than returning isolated snippets.
Do not leave the main functionality as TODO comments.
If credentials are unavailable, build the integration, provide a safe fallback, and explain precisely what needs to be configured.

23. FINAL EXECUTION INSTRUCTIONS
Work in this order:
1. Inspect the current project and framework.
2. Briefly report the existing setup.
3. Implement the complete website.
4. Create the necessary components and configuration files.
5. Implement the enquiry form, chatbot, and WhatsApp behavior.
6. Add responsive styling and animations.
7. Add SEO and performance improvements.
8. Run the application.
9. Run the production build and available tests.
10. Fix errors.
11. Summarize what has been completed.
12. Tell me which company details and credentials I must supply.
13. Provide precise instructions to run and deploy the website.
Do not stop after planning or generating a single page.
Make sensible implementation decisions independently.
Prioritize premium design, functionality, customer trust, lead generation, accessibility, maintainability, and performance.
FINAL OBJECTIVE: Build a fully functional, premium transportation company website that can be demonstrated to a real client, generate genuine customer enquiries, and serve as the public-facing foundation of the company's digital presence.
Begin by inspecting the current project and then implement the website.