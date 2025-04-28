import React from 'react'


const services = [
    {
      title: "Medical Consultation and Follow-Up",
      description: "Expert advice and thorough follow-up to ensure your health goals are met.",
      icon: "🩺",
    },
    {
      title: "Point of Care Blood Tests",
      description: "On-the-spot testing for anemia, cholesterol, gout, and diabetes.",
      icon: "🩸",
    },
    {
      title: "Home Visit",
      description: "Convenient care at the comfort of your home for patients unable to visit the clinic.",
      icon: "🏠",
    },
    {
      title: "Elderly Care",
      description: "A specialized service to support the health and well-being of elderly patients.",
      icon: "👴",
    },
    {
      title: "Nebulisation and Injections",
      description: "Quick relief for respiratory issues and administration of necessary injections.",
      icon: "💉",
    },
    {
      title: "Prescriptions and Referral Letters",
      description: "Accurate and prompt medical documentation.",
      icon: "📄",
    },
    {
      title: "Wound Care and Dressing",
      description: "Professional care for injuries to promote healing.",
      icon: "🩹",
    },
    {
      title: "Medical and Fitness Certificates",
      description: "Issuance of certificates for work, travel, or fitness.",
      icon: "📜",
    },
    {
      title: "Death Certificates",
      description: "Compassionate and timely assistance with medical documentation.",
      icon: "⚰️",
    },
  ];

export default function Services() {
    return (
        <div className="container py-5">
        <div className="row">
          {services.map((service, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="service-card p-4 shadow-sm">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}
