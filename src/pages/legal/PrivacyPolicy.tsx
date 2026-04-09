import React from "react";
import { Navbar } from "../../components/home/Navbar";
import { Footer } from "../../components/home/Footer";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Users, FileText, Clock } from "lucide-react";

export const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: Shield,
      content: `Trust Bridge AI is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.

Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our website or services.`,
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      icon: FileText,
      content: `We collect information in the following ways:

• Personal Identification Information: Name, email address, phone number, address, date of birth
• Account Information: Username, password, profile data, business information
• Payment Information: Credit card details (processed securely through Stripe)
• Usage Data: Pages visited, time spent, clicks, device information, browser type
• Communication Data: Messages, inquiries, feedback, and support tickets
• Investment Data: Investment preferences, funding history, portfolio information`,
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: Eye,
      content: `We use collected information for various purposes:

• Service Provision: To provide, maintain, and improve our platform and services
• Account Management: To create and manage your account, process transactions
• Communication: To send service updates, newsletters, and respond to inquiries
• Security: To detect and prevent fraud, abuse, and security incidents
• Legal Compliance: To comply with applicable laws and regulations
• Analytics: To understand user behavior and improve user experience
• Marketing: To send promotional materials (only with your consent)
• Customer Support: To provide assistance and troubleshoot issues
• Research: To conduct research for improving our services`,
    },
    {
      id: "data-sharing",
      title: "How We Share Your Information",
      icon: Users,
      content: `We may share your information in the following circumstances:

• Service Providers: With third-party vendors who assist in operating our website (payment processors, analytics providers)
• Business Partners: With entrepreneurs or investors you choose to connect with
• Legal Requirements: When required by law, court order, or government request
• Business Transfers: In case of merger, acquisition, or sale of assets
• User Consent: With your explicit permission for specific purposes
• Aggregated Data: We may share anonymized, aggregated data for analytics

We do NOT sell your personal information to third parties for their marketing purposes.`,
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: `We implement comprehensive security measures to protect your information:

• Encryption: SSL/TLS encryption for data in transit
• Secure Storage: Encrypted storage for sensitive data at rest
• Access Controls: Limited access to personal information on a need-to-know basis
• Firewalls: Advanced firewalls and intrusion detection systems
• Regular Audits: Periodic security audits and penetration testing
• Employee Training: Regular privacy and security training for staff
• Incident Response: Rapid response procedures for any security breaches

However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`,
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: Clock,
      content: `We retain your personal information for as long as necessary to:

• Maintain your account and provide services
• Comply with legal and regulatory requirements
• Resolve disputes and enforce agreements
• Meet our legitimate business interests

When information is no longer needed, we securely delete or anonymize it. If you request deletion, we will remove your data within 30 days, except where retention is required by law.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
        <div className="absolute top-10 right-5 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-8 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <motion.div
          className="max-w-4xl mx-auto relative z-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full border border-primary-300 mb-6">
            <Shield size={16} />
            <span className="text-sm font-semibold">Your Privacy Matters</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are committed to protecting your privacy and ensuring you have a positive experience on our platform.
          </p>
        </motion.div>
      </section>

      {/* Table of Contents */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-black text-gray-900 mb-6">Table of Contents</h2>
            <ul className="space-y-3">
              {sections.map((section, idx) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    {idx + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, idx) => {
            const IconComponent = section.icon;
            return (
              <motion.div
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl border border-gray-200 p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{section.title}</h3>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Additional Sections */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black text-gray-900 mb-6">Your Rights</h3>
            <div className="text-gray-700 space-y-4 leading-relaxed">
              <p>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold flex-shrink-0">•</span>
                  <span><strong>Right to Access:</strong> You can request a copy of your personal data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold flex-shrink-0">•</span>
                  <span><strong>Right to Rectification:</strong> You can correct inaccurate information</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold flex-shrink-0">•</span>
                  <span><strong>Right to Erasure:</strong> You can request deletion of your data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold flex-shrink-0">•</span>
                  <span><strong>Right to Opt-Out:</strong> You can opt out of marketing communications</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold flex-shrink-0">•</span>
                  <span><strong>Right to Withdraw Consent:</strong> You can withdraw consent at any time</span>
                </li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us at <strong>privacy@trustbridge.ai</strong>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black text-gray-900 mb-6">Cookies & Tracking</h3>
            <div className="text-gray-700 space-y-4 leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings.
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold flex-shrink-0">•</span>
                  <span><strong>Essential Cookies:</strong> Required for site functionality</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold flex-shrink-0">•</span>
                  <span><strong>Analytics Cookies:</strong> Help us understand how you use our site</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold flex-shrink-0">•</span>
                  <span><strong>Marketing Cookies:</strong> Used for personalized advertising (with consent)</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl border border-primary-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black text-gray-900 mb-4">Contact Us</h3>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="space-y-3 text-gray-900">
              <div>
                <p className="font-bold text-sm text-gray-600">Email:</p>
                <a href="mailto:privacy@trustbridge.ai" className="text-primary-600 hover:text-primary-700 font-semibold">
                  privacy@trustbridge.ai
                </a>
              </div>
              <div>
                <p className="font-bold text-sm text-gray-600">General Support:</p>
                <a href="mailto:support@trustbridge.ai" className="text-primary-600 hover:text-primary-700 font-semibold">
                  support@trustbridge.ai
                </a>
              </div>
              <div>
                <p className="font-bold text-sm text-gray-600">Address:</p>
                <p className="text-gray-700">
                  Trust Bridge AI<br />
                  River Garden, Gujrat, Pakistan
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black mb-4">Have Privacy Questions?</h2>
            <p className="text-lg text-primary-100 mb-8">
              We're here to help clarify how we protect your data. Reach out anytime.
            </p>
            <a
              href="mailto:privacy@trustbridge.ai"
              className="inline-block px-8 py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Contact Privacy Team
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};
