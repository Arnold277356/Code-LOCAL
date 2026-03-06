import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import './EducationPage.css';

const safetySteps = {
  en: [
    {
      icon: '🧤',
      title: 'Wear Protective Gear',
      desc: 'Always wear gloves when handling e-waste. Some devices contain lead, mercury, and cadmium that can be absorbed through skin contact.'
    },
    {
      icon: '📦',
      title: 'Pack Items Properly',
      desc: 'Place e-waste in a sturdy box or bag before bringing to a drop-off point. Wrap sharp or broken items in newspaper or bubble wrap to prevent injury.'
    },
    {
      icon: '🔋',
      title: 'Remove Batteries Separately',
      desc: 'If possible, remove batteries from devices before dropping off. Batteries must be handled separately as they pose fire and chemical hazards.'
    },
    {
      icon: '💧',
      title: 'Keep Dry and Away from Heat',
      desc: 'Store e-waste in a cool, dry place before drop-off. Exposure to water or heat can cause short circuits and release toxic chemicals.'
    },
    {
      icon: '🚫',
      title: 'Do Not Burn or Crush',
      desc: 'Never burn, crush, or puncture electronic devices. This releases toxic fumes and harmful substances into the air and soil.'
    },
    {
      icon: '🧒',
      title: 'Keep Away from Children',
      desc: 'Store e-waste out of reach of children. Circuit boards, batteries, and small parts can be dangerous if touched or swallowed.'
    },
  ],
  fil: [
    {
      icon: '🧤',
      title: 'Magsuot ng Protective Gear',
      desc: 'Laging magsuot ng guwantes kapag humahawak ng e-waste. Ang ilang device ay naglalaman ng tingga, mercury, at cadmium na maaaring masipsip sa pamamagitan ng pakikipag-ugnayan sa balat.'
    },
    {
      icon: '📦',
      title: 'I-pack nang Maayos ang mga Item',
      desc: 'Ilagay ang e-waste sa matibay na kahon o bag bago dalhin sa drop-off point. Balutin ang matutulis o sirang item sa dyaryo o bubble wrap upang maiwasan ang pinsala.'
    },
    {
      icon: '🔋',
      title: 'Alisin ang mga Baterya nang Hiwalay',
      desc: 'Kung maaari, alisin ang mga baterya mula sa mga device bago mag-drop off. Ang mga baterya ay dapat hawakan nang hiwalay dahil nagdudulot ng panganib ng sunog at kemikal.'
    },
    {
      icon: '💧',
      title: 'Panatilihing Tuyo at Malayo sa Init',
      desc: 'Iimbak ang e-waste sa malamig, tuyong lugar bago mag-drop off. Ang pagkalanghap ng tubig o init ay maaaring magdulot ng short circuit at maglabas ng mga nakakalason na kemikal.'
    },
    {
      icon: '🚫',
      title: 'Huwag Sunugin o Durugin',
      desc: 'Huwag kailanman sunugin, durugin, o tusukin ang mga electronic na device. Naglalabas ito ng nakakalason na usok at mapanganib na sangkap sa hangin at lupa.'
    },
    {
      icon: '🧒',
      title: 'Panatilihing Malayo sa mga Bata',
      desc: 'Iimbak ang e-waste na hindi maaabot ng mga bata. Ang mga circuit board, baterya, at maliliit na parte ay maaaring mapanganib kung mahipo o malunok.'
    },
  ]
};

const dropoffSteps = {
  en: [
    { step: '1', title: 'Prepare Your Items', desc: 'Gather all e-waste you want to dispose of. Pack them securely in a bag or box.' },
    { step: '2', title: 'Register Online', desc: 'Log in to E-Cycle Hub, go to Register, and submit your drop-off details — location, type, and estimated weight.' },
    { step: '3', title: 'Go to Drop-off Point', desc: 'Bring your packed e-waste to your selected drop-off location during operating hours (Friday–Saturday).' },
    { step: '4', title: 'Staff Will Verify', desc: 'Barangay staff will weigh and verify your items. Your submission status will be updated in your dashboard.' },
    { step: '5', title: 'Claim Your Reward', desc: 'Once marked as Done, download your certificate from your dashboard and claim your ₱5/kg reward at the Barangay Hall.' },
  ],
  fil: [
    { step: '1', title: 'Ihanda ang Iyong mga Item', desc: 'Tipunin ang lahat ng e-waste na nais mong itapon. I-pack ang mga ito nang maayos sa isang bag o kahon.' },
    { step: '2', title: 'Mag-rehistro Online', desc: 'Mag-login sa E-Cycle Hub, pumunta sa Mag-rehistro, at isumite ang iyong mga detalye ng drop-off — lokasyon, uri, at tinatayang timbang.' },
    { step: '3', title: 'Pumunta sa Drop-off Point', desc: 'Dalhin ang iyong nakapackang e-waste sa iyong piniling lokasyon ng drop-off sa oras ng operasyon (Biyernes–Sabado).' },
    { step: '4', title: 'I-verify ng Staff', desc: 'Ang barangay staff ay magtatimbang at mag-ve-verify ng iyong mga item. Ang katayuan ng iyong submission ay ia-update sa iyong dashboard.' },
    { step: '5', title: 'I-claim ang Iyong Gantimpala', desc: 'Kapag namarkahan bilang Done, i-download ang iyong sertipiko mula sa iyong dashboard at i-claim ang iyong gantimpalang ₱5/kg sa Barangay Hall.' },
  ]
};

function EducationPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const { t, language } = useLanguage();

  const faqs = [
    { id: 1, question: t.education.faq1Q, answer: t.education.faq1A },
    { id: 2, question: t.education.faq2Q, answer: t.education.faq2A },
    { id: 3, question: t.education.faq3Q, answer: t.education.faq3A },
  ];

  const toggleFaq = (id) => setExpandedFaq(expandedFaq === id ? null : id);

  return (
    <div className="page-container">
      <section className="education-page">
        <div className="container">
          <h1 className="page-title">{t.education.title}</h1>
          <p className="page-subtitle">{t.education.subtitle}</p>

          {/* FAQ + Stats */}
          <div className="education-content">
            <div className="faq-container">
              {faqs.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button className={`faq-question ${expandedFaq === faq.id ? 'active' : ''}`} onClick={() => toggleFaq(faq.id)}>
                    <span>{faq.question}</span>
                    <FaChevronDown className="faq-icon" />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="faq-answer"><p>{faq.answer}</p></div>
                  )}
                </div>
              ))}
            </div>

            <div className="education-stats">
              <div className="stat-card">
                <div className="stat-icon">📱</div>
                <div className="stat-content">
                  <h3>{t.education.stat1Title}</h3>
                  <p>{t.education.stat1Desc}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>{t.education.stat2Title}</h3>
                  <p>{t.education.stat2Desc}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h3>{t.education.stat3Title}</h3>
                  <p>{t.education.stat3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── SAFETY SECTION ── */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {language === 'en' ? '⚠️ Safe Handling of E-Waste' : '⚠️ Ligtas na Paghawak ng E-Waste'}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {language === 'en'
                  ? 'Follow these guidelines to protect yourself and your community'
                  : 'Sundin ang mga alituntuning ito upang protektahan ang iyong sarili at komunidad'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {safetySteps[language].map((step, i) => (
                <div key={i} className="bg-white rounded-xl border-2 border-orange-100 p-5 hover:border-orange-300 hover:shadow-md transition-all">
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── HOW TO DROP OFF ── */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {language === 'en' ? '📋 How to Drop Off Your E-Waste' : '📋 Paano Mag-drop Off ng E-Waste'}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {language === 'en'
                  ? 'Simple steps to properly dispose and earn rewards'
                  : 'Mga simpleng hakbang para maayos na itapon at kumita ng gantimpala'}
              </p>
            </div>

            <div className="relative">
              {dropoffSteps[language].map((step, i) => (
                <div key={i} className="flex gap-4 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    {i < dropoffSteps[language].length - 1 && (
                      <div className="w-0.5 bg-emerald-200 flex-1 mt-2" style={{ minHeight: '24px' }} />
                    )}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4 flex-1 hover:shadow-sm transition-all">
                    <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accepted items reminder */}
          <div className="mt-8 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
            <h3 className="font-bold text-emerald-800 text-lg mb-3">
              {language === 'en' ? '✅ Accepted E-Waste Items' : '✅ Tinatanggap na mga E-Waste Item'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['📱 Smartphones', '💻 Laptops', '🖥️ Monitors', '🖨️ Printers',
                '⌨️ Keyboards', '🔌 Chargers & Cables', '💾 Hard Drives', '🖱️ Mouse',
                '📺 Televisions', '🔋 Batteries*', '🖥️ Desktop CPUs', '📡 Routers'].map((item, i) => (
                <div key={i} className="bg-white rounded-lg px-3 py-2 text-sm text-gray-700 border border-emerald-100 text-center">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {language === 'en'
                ? '* Batteries must be removed from devices and handled separately.'
                : '* Ang mga baterya ay dapat alisin mula sa mga device at hawakan nang hiwalay.'}
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default EducationPage;