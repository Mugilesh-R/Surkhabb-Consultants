const modal = document.getElementById("modal");
const modalData = document.getElementById("modalData");
const closeBtn = document.getElementById("closeBtn");

const services = {

  business: {
    title: "Business Loan",

    description:
    "Business loans provide flexible financial support for startups, SMEs, and expanding businesses. These loans help companies manage working capital, equipment purchases, office expansion, inventory management, and operational expenses with affordable repayment plans.",

    benefits: [
      "Quick approval process",
      "Low interest rates",
      "Flexible repayment options",
      "Minimal documentation",
      "High loan amount eligibility",
      "Support for business expansion"
    ],

    eligibility: [
      "Minimum 2 years business operation",
      "Valid business registration",
      "Good credit history",
      "Stable annual turnover"
    ],

    process: [
      "Submit online application",
      "Upload business documents",
      "Verification process",
      "Loan approval and disbursement"
    ]
  },

  car: {
    title: "Car Loan",

    description:
    "Car loans help individuals purchase new or used vehicles with affordable EMI options and flexible repayment tenures. Fast approvals and competitive interest rates make vehicle ownership simple and convenient.",

    benefits: [
      "Up to 90% financing",
      "Flexible EMI plans",
      "Quick processing",
      "Low down payment",
      "New and used vehicle support"
    ],

    eligibility: [
      "Minimum income requirement",
      "Valid driving license",
      "Age between 21 to 60",
      "Stable employment or business"
    ],

    process: [
      "Choose your vehicle",
      "Apply for loan",
      "Submit KYC documents",
      "Approval and vehicle delivery"
    ]
  },

  personal: {
    title: "Personal Loan",

    description:
    "Personal loans provide immediate financial assistance for weddings, education, travel, home renovation, medical emergencies, and other personal expenses without collateral requirements.",

    benefits: [
      "No collateral required",
      "Instant approval",
      "Flexible repayment",
      "Multi-purpose usage",
      "Quick fund transfer"
    ],

    eligibility: [
      "Minimum monthly income",
      "Stable job or business",
      "Good credit score",
      "Valid ID proof"
    ],

    process: [
      "Fill application form",
      "Upload required documents",
      "Loan verification",
      "Amount disbursement"
    ]
  },

  life: {
    title: "Life Insurance",

    description:
    "Life insurance offers financial protection to your loved ones and ensures long-term financial security through comprehensive coverage and future planning benefits.",

    benefits: [
      "Family financial protection",
      "Tax benefits",
      "Long-term savings",
      "Retirement support",
      "Flexible policy plans"
    ],

    eligibility: [
      "Minimum age requirement",
      "Basic health assessment",
      "Valid identity proof"
    ],

    process: [
      "Choose insurance plan",
      "Complete documentation",
      "Medical verification",
      "Policy activation"
    ]
  },

  health: {
    title: "Health Insurance",

    description:
    "Health insurance provides coverage for hospitalization, surgeries, medical expenses, and emergency treatments with cashless healthcare facilities and affordable premium plans.",

    benefits: [
      "Cashless hospitalization",
      "Family coverage",
      "Pre and post hospitalization support",
      "Affordable premiums",
      "Emergency medical support"
    ],

    eligibility: [
      "Basic medical eligibility",
      "Identity proof submission",
      "Policy age criteria"
    ],

    process: [
      "Select health plan",
      "Complete health details",
      "Document verification",
      "Policy confirmation"
    ]
  },

  general: {
    title: "General Insurance",

    description:
    "General insurance protects your property, vehicle, travel, and business assets from unexpected risks, accidents, and damages through comprehensive coverage plans.",

    benefits: [
      "Property protection",
      "Vehicle coverage",
      "Travel insurance support",
      "Business risk management",
      "Fast claim processing"
    ],

    eligibility: [
      "Valid asset ownership",
      "Identity proof",
      "Policy verification"
    ],

    process: [
      "Choose coverage plan",
      "Submit required documents",
      "Policy approval",
      "Insurance activation"
    ]
  },

  advisory: {
    title: "Registration & Compliance Services",

    description:
    "The company provides professional registration and compliance-related services for startups, businesses, entrepreneurs, manufacturers, traders, and service providers. Our services help businesses complete government registrations, certifications, licensing, and legal compliance processes with professional guidance and documentation support.",

    services: [
      "GST Registration",
      "MSME Registration",
      "ISO Certification",
      "GEM Registration",
      "DSC (Digital Signature Certificate)",
      "IEC Code Registration",
      "Startup Registration",
      "Shop Act License",
      "FSSAI Registration",
      "Trademark Registration"
    ],

    responsibilities: [
      "Clients must provide accurate and valid documents",
      "Incorrect or incomplete information may delay processing",
      "The client is responsible for verifying submitted details before approval"
    ],

    processing: [
      "Registration timelines depend on government departments and approval authorities",
      "Delays caused by third-party departments are not the responsibility of the service provider"
    ],

    payments: [
      "All service charges must be paid in advance unless otherwise agreed",
      "Government fees, renewal fees, and taxes are additional where applicable",
      "Payments once processed may be non-refundable after application submission"
    ],

    verification: [
      "The company reserves the right to reject applications with invalid or suspicious documents",
      "Additional documents may be requested during processing"
    ],

    trademark: [
      "Trademark approval depends on government examination and availability",
      "ISO certifications are subject to audit and verification standards"
    ],

    refund: [
      "Refunds are not applicable after submission to government portals",
      "Partial refunds may be considered only before processing starts"
    ],

    confidentiality: [
      "Client information and documents will be kept confidential and used only for service purposes"
    ],

    liability: [
      "The company is not responsible for losses due to government rejection, policy changes, or incorrect client information"
    ],

    communication: [
      "Updates may be provided through phone, email, or WhatsApp",
      "Clients should respond promptly to avoid delays"
    ],

    terms: [
      "Terms and conditions may be updated without prior notice"
    ],

    acceptance: [
      "By using these services, the client agrees to all terms and conditions mentioned above"
    ]
  }

};

document.querySelectorAll(".service-card").forEach(card => {

  card.addEventListener("click", () => {

    const service = services[card.dataset.service];

    if(card.dataset.service === "advisory"){

      modalData.innerHTML = `

        <h2 class="modal-title">
          ${service.title}
        </h2>

        <p class="modal-text">
          ${service.description}
        </p>

        <div class="modal-section">
          <h4>1. Service Scope</h4>

          <ul>
            ${service.services.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>2. Client Responsibilities</h4>

          <ul>
            ${service.responsibilities.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>3. Processing Time</h4>

          <ul>
            ${service.processing.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>4. Fees & Payments</h4>

          <ul>
            ${service.payments.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>5. Document Verification</h4>

          <ul>
            ${service.verification.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>6. Trademark & Certification</h4>

          <ul>
            ${service.trademark.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>7. Cancellation & Refund</h4>

          <ul>
            ${service.refund.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>8. Confidentiality</h4>

          <ul>
            ${service.confidentiality.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>9. Limitation of Liability</h4>

          <ul>
            ${service.liability.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>10. Communication</h4>

          <ul>
            ${service.communication.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>11. Changes to Terms</h4>

          <ul>
            ${service.terms.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>12. Acceptance</h4>

          <ul>
            ${service.acceptance.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <a href="mailto:info@surkhaabconsultants.com" class="apply-btn">
          Get Consultation
        </a>

      `;

    } else {

      modalData.innerHTML = `

        <h2 class="modal-title">
          ${service.title}
        </h2>

        <p class="modal-text">
          ${service.description}
        </p>

        <div class="modal-section">
          <h4>Key Benefits</h4>

          <ul>
            ${service.benefits.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>Eligibility</h4>

          <ul>
            ${service.eligibility.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <h4>Application Process</h4>

          <ul>
            ${service.process.map(item => `<li>✔ ${item}</li>`).join("")}
          </ul>
        </div>

        <a href="mailto:info@surkhaabconsultants.com" class="apply-btn">
          Apply Now
        </a>

      `;

    }

    modal.classList.add("active");

  });

});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {

  if(e.target === modal){
    modal.classList.remove("active");
  }

});

const params = new URLSearchParams(window.location.search);
if (params.get("service") === "advisory") {
  const card = document.querySelector('.service-card[data-service="advisory"]');
  if (card) card.click();
}