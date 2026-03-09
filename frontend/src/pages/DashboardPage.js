import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import './EducationPage.css';

// ── Safety Steps (7 steps from the document) ──────────────
const safetySteps = {
  en: [
    {
      icon: '🔍',
      title: 'Step 1 — Identify Your E-Waste',
      color: 'emerald',
      content: {
        accepted: [
          'Mobile phones and smartphones',
          'Laptops and desktop computers',
          'Computer accessories — keyboards, mouse, USB drives',
          'Chargers, cables, and adapters',
          'Batteries — rechargeable and disposable',
          'Tablets and e-readers',
          'Radios and portable speakers',
          'Electric fans and small household appliances',
          'LED bulbs and fluorescent lamps',
          'Solar panels',
        ],
        notAccepted: [
          'Large appliances — refrigerators, washing machines, air conditioners',
          'Non-electronic items',
          'Items with biological or chemical contamination',
        ]
      }
    },
    {
      icon: '🧤',
      title: 'Step 2 — Prepare Your Protective Gear',
      color: 'emerald',
      desc: 'Before handling any e-waste — especially batteries, broken screens, or damaged devices — make sure you have basic protective measures:',
      bullets: [
        '🧤 Gloves — Use rubber or latex gloves when handling batteries, broken screens, or any damaged/leaking device.',
        '😷 Face Mask — Wear a mask when handling old or dusty devices to avoid inhaling toxic particles.',
        '👟 Closed-toe Shoes — Avoid open-toed footwear to prevent injury from accidental drops.',
        '👕 Old Clothing — Wear old clothes to avoid contaminating your regular clothing with toxic residues.',
      ]
    },
    {
      icon: '🔎',
      title: 'Step 3 — Inspect Your Devices Carefully',
      color: 'emerald',
      desc: 'Before packing your e-waste for drop-off, carefully inspect each device:',
      bullets: [
        '🔋 Swollen or leaking batteries — Do NOT squeeze or puncture. Place in a sealed plastic bag away from heat.',
        '💥 Cracked or broken screens — Handle carefully to avoid cuts. Wrap in newspaper or bubble wrap.',
        '🟤 Corrosion or rust — Wear gloves and avoid touching corroded areas directly.',
        '👃 Unusual odors — If a device smells chemical or burnt, seal it in a plastic bag immediately.',
        '🔌 Damaged cables — Coil loosely and secure with a rubber band before packing.',
      ]
    },
    {
      icon: '📦',
      title: 'Step 4 — Pack Your E-Waste Safely',
      color: 'emerald',
      desc: 'Once you have inspected your devices, pack them safely for transport:',
      bullets: [
        'Place each device in a separate sealed plastic bag — especially batteries and small components.',
        'Wrap fragile items such as monitors or tablets in newspaper or bubble wrap.',
        'Place all items in a sturdy cardboard box or thick plastic bag that can be securely closed.',
        'Label your package with your name and drop-off date if you have registered online.',
        'Do NOT stack heavy devices on top of fragile ones.',
        'Keep packed e-waste away from children and pets at all times.',
      ]
    },
    {
      icon: '🏠',
      title: 'Step 5 — Store Properly Before Drop-off',
      color: 'emerald',
      desc: 'If you are not dropping off immediately, store your e-waste safely at home:',
      bullets: [
        'Store in a cool, dry, and well-ventilated area away from direct sunlight and heat.',
        'Keep away from food, water, and cooking areas to prevent contamination.',
        'Keep out of reach of children and pets at all times.',
        'Do NOT store in enclosed spaces without ventilation — especially if batteries are involved.',
        'Do NOT store near flammable materials such as gasoline, paint, or cleaning products.',
        'Limit home storage to no more than 30 days before bringing to the nearest drop-off location.',
      ]
    },
    {
      icon: '🚶',
      title: 'Step 6 — Transport to Drop-off Location',
      color: 'emerald',
      desc: 'When bringing your e-waste to the nearest E-Cycle Hub drop-off location:',
      bullets: [
        'Carry your e-waste in a closed bag or box — do not carry loose electronic devices openly.',
        'If using a motorcycle or vehicle, secure your bag to prevent it from falling during transit.',
        'Do not expose your packed e-waste to rain or extreme heat during transport.',
        'Present your packed e-waste to barangay staff on duty for weighing and verification.',
        'Do NOT attempt to open or dismantle any device at the drop-off location.',
      ]
    },
    {
      icon: '✅',
      title: 'Step 7 — After Drop-off',
      color: 'emerald',
      desc: 'Once you have successfully turned over your e-waste:',
      bullets: [
        '🧼 Wash your hands thoroughly with soap and water immediately after handling e-waste.',
        '👕 Remove and wash any clothing that may have come into contact with e-waste materials.',
        '🧤 Dispose of used gloves properly — do not reuse gloves that have contacted leaking devices.',
        '📱 Check your E-Cycle Hub dashboard to confirm your drop-off has been recorded.',
        '🏆 Wait for your reward certificate after verification by barangay staff.',
      ]
    },
  ],
  fil: [
    {
      icon: '🔍',
      title: 'Hakbang 1 — Tukuyin ang Iyong E-Waste',
      color: 'emerald',
      content: {
        accepted: [
          'Mga cellphone at smartphone',
          'Mga laptop at desktop computer',
          'Mga computer accessories — keyboard, mouse, USB drives',
          'Mga charger, cable, at adapter',
          'Mga baterya — rechargeable at disposable',
          'Mga tablet at e-reader',
          'Mga radyo at portable speaker',
          'Mga electric fan at maliliit na appliance',
          'Mga LED bulb at fluorescent lamp',
          'Mga solar panel',
        ],
        notAccepted: [
          'Malalaking appliance — ref, washing machine, aircon',
          'Mga hindi electronic na gamit',
          'Mga item na may biological o chemical na kontaminasyon',
        ]
      }
    },
    {
      icon: '🧤',
      title: 'Hakbang 2 — Ihanda ang Iyong Protective Gear',
      color: 'emerald',
      desc: 'Bago hawakan ang anumang e-waste — lalo na ang mga baterya, sirang screen, o sirang device:',
      bullets: [
        '🧤 Guwantes — Gumamit ng rubber o latex gloves kapag humahawak ng baterya o sirang device.',
        '😷 Face Mask — Magsuot ng mask kapag humahawak ng lumang o maalikabok na device.',
        '👟 Saradong Sapatos — Iwasan ang bukas na sapatos para hindi masaktan kung may mahulog.',
        '👕 Lumang Damit — Magsuot ng lumang damit para hindi makontamina ang iyong regular na damit.',
      ]
    },
    {
      icon: '🔎',
      title: 'Hakbang 3 — Suriin nang Maingat ang Iyong mga Device',
      color: 'emerald',
      desc: 'Bago i-pack ang iyong e-waste, maingat na suriin ang bawat device:',
      bullets: [
        '🔋 Namumuntog o tumatawid na baterya — HUWAG pisilin o tusukin. Ilagay sa sealed na plastic bag.',
        '💥 Basag o sirang screen — Hawakan nang maingat. Balutin sa dyaryo o bubble wrap.',
        '🟤 Kalawang o koroso — Magsuot ng guwantes at iwasang hawakan ang mga koroso na bahagi.',
        '👃 Hindi karaniwang amoy — Kung may kemikal o sunog na amoy, i-seal agad sa plastic bag.',
        '🔌 Sirang cable — Itiklop nang maluwag at i-secure ng rubber band bago i-pack.',
      ]
    },
    {
      icon: '📦',
      title: 'Hakbang 4 — I-pack nang Ligtas ang E-Waste',
      color: 'emerald',
      desc: 'Kapag nasuri na ang mga device, i-pack ang mga ito nang ligtas:',
      bullets: [
        'Ilagay ang bawat device sa hiwalay na sealed na plastic bag — lalo na ang mga baterya.',
        'Balutin ang marupok na item tulad ng monitor o tablet sa dyaryo o bubble wrap.',
        'Ilagay ang lahat sa matibay na kahon o makapal na plastic bag na may takip.',
        'Lagyan ng label ng iyong pangalan at petsa ng drop-off kung naka-register ka na.',
        'HUWAG itapon ang mabibigat na device sa ibabaw ng mga marupok.',
        'Panatilihing malayo ang nakapackang e-waste sa mga bata at alagang hayop.',
      ]
    },
    {
      icon: '🏠',
      title: 'Hakbang 5 — Iimbak nang Maayos Bago Mag-drop Off',
      color: 'emerald',
      desc: 'Kung hindi ka agad mag-drop off, iimbak nang ligtas ang iyong e-waste sa bahay:',
      bullets: [
        'Iimbak sa malamig, tuyo, at mahangin na lugar malayo sa araw at init.',
        'Panatilihing malayo sa pagkain, tubig, at lugar ng pagluluto.',
        'Panatilihing hindi maaabot ng mga bata at alagang hayop.',
        'HUWAG iimbak sa saradong lugar nang walang bentilasyon — lalo na kung may baterya.',
        'HUWAG iimbak malapit sa mga nasusunog na materyales tulad ng gasolina o pintura.',
        'Limitahan ang pag-iimbak sa bahay sa hindi hihigit sa 30 araw.',
      ]
    },
    {
      icon: '🚶',
      title: 'Hakbang 6 — Dalhin sa Drop-off Location',
      color: 'emerald',
      desc: 'Kapag dala mo na ang iyong e-waste sa pinakamalapit na drop-off location:',
      bullets: [
        'Dalhin ang e-waste sa saradong bag o kahon — huwag magdala ng bukas na electronic device.',
        'Kung sa motorsiklo o sasakyan, i-secure ang bag para hindi mahulog sa daan.',
        'Huwag ilantad ang nakapackang e-waste sa ulan o matinding init.',
        'Ipakita ang iyong e-waste sa barangay staff para sa pagtitimbang at pag-verify.',
        'HUWAG subukang buksan o sirain ang anumang device sa drop-off location.',
      ]
    },
    {
      icon: '✅',
      title: 'Hakbang 7 — Pagkatapos ng Drop-off',
      color: 'emerald',
      desc: 'Pagkatapos mong maibigay ang iyong e-waste:',
      bullets: [
        '🧼 Hugasan agad ang iyong mga kamay ng sabon at tubig pagkatapos humawak ng e-waste.',
        '👕 Tanggalin at hugasan ang damit na maaaring nakahawak sa e-waste na materyales.',
        '🧤 Itapon nang maayos ang mga ginamit na guwantes — huwag muling gamitin.',
        '📱 Tingnan ang iyong E-Cycle Hub dashboard para kumpirmahin ang iyong drop-off.',
        '🏆 Hintayin ang iyong reward certificate pagkatapos ng pag-verify ng barangay staff.',
      ]
    },
  ]
};

// ── Emergency Procedures ───────────────────────────────────
const emergencies = {
  en: [
    {
      icon: '🖐️',
      title: 'Skin Contact',
      steps: [
        'Remove contaminated clothing immediately.',
        'Wash the affected area with soap and water for at least 15 minutes.',
        'Do NOT rub — rinse gently with running water.',
        'If irritation, redness, or burning persists, seek medical attention immediately.',
      ]
    },
    {
      icon: '👁️',
      title: 'Eye Contact',
      steps: [
        'Do NOT rub your eyes.',
        'Rinse eyes immediately with clean running water for at least 15 minutes.',
        'Remove contact lenses if present and continue rinsing.',
        'Seek medical attention immediately even if irritation seems minor.',
      ]
    },
    {
      icon: '🤢',
      title: 'Accidental Ingestion',
      steps: [
        'Do NOT induce vomiting unless directed by a medical professional.',
        'Rinse mouth with water immediately.',
        'Call the Poison Control Center or go to the nearest hospital ER immediately.',
        'Bring the device or material involved to the hospital for reference.',
      ]
    },
    {
      icon: '💨',
      title: 'Inhalation of Toxic Fumes',
      steps: [
        'Move to fresh air immediately.',
        'If breathing is difficult, seek emergency medical assistance right away.',
        'Do NOT re-enter the area until it has been properly ventilated.',
        'If dizziness, headache, or difficulty breathing persists, go to the nearest hospital.',
      ]
    },
  ],
  fil: [
    {
      icon: '🖐️',
      title: 'Pakikipag-ugnayan sa Balat',
      steps: [
        'Agad na alisin ang kontaminadong damit.',
        'Hugasan ang apektadong lugar ng sabon at tubig nang hindi bababa sa 15 minuto.',
        'HUWAG kuskusin — banlawan nang dahan-dahan ng tubig.',
        'Kung may pamamaga, pamumula, o sunog na sensasyon, agad na humingi ng medikal na tulong.',
      ]
    },
    {
      icon: '👁️',
      title: 'Pakikipag-ugnayan sa Mata',
      steps: [
        'HUWAG kuskusin ang iyong mga mata.',
        'Agad na banlawan ng malinis na tubig nang hindi bababa sa 15 minuto.',
        'Alisin ang contact lenses kung nakasuot at ipagpatuloy ang pagbabanlawan.',
        'Agad na humingi ng medikal na tulong kahit maliit lang ang irritasyon.',
      ]
    },
    {
      icon: '🤢',
      title: 'Aksidenteng Pagkain/Pag-inom',
      steps: [
        'HUWAG pilitin ang pagsusuka maliban kung sinabi ng medikal na propesyonal.',
        'Agad na banlawan ang bibig ng tubig.',
        'Tumawag sa Poison Control Center o pumunta sa pinakamalapit na ER.',
        'Dalhin ang device o materyales na nasangkot sa ospital para sa sanggunian.',
      ]
    },
    {
      icon: '💨',
      title: 'Pag-inhale ng Nakakalason na Usok',
      steps: [
        'Lumabas agad sa sariwang hangin.',
        'Kung mahirap huminga, humingi agad ng emergency na medikal na tulong.',
        'HUWAG bumalik sa lugar hanggang hindi pa maayos na nasasaliwan ng hangin.',
        'Kung nagpapatuloy ang pagkahilo, sakit ng ulo, o hirap sa paghinga, pumunta sa ospital.',
      ]
    },
  ]
};

const emergencyContacts = [
  { label: 'Barangay Burol 1 Hall', number: '09916338752' },
  { label: 'Dasmariñas City Health Office', number: '(046) 432-0050' },
  { label: 'Philippine Red Cross', number: '143' },
  { label: 'Emergency Hotline', number: '911' },
  { label: 'National Poison Control Center', number: '(02) 8524-1078' },
];

function EducationPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedSafety, setExpandedSafety] = useState(null);
  const [expandedEmergency, setExpandedEmergency] = useState(null);
  const { t, language } = useLanguage();

  const faqs = [
    { id: 1, question: t.education.faq1Q, answer: t.education.faq1A },
    { id: 2, question: t.education.faq2Q, answer: t.education.faq2A },
    { id: 3, question: t.education.faq3Q, answer: t.education.faq3A },
  ];

  // Add emojis to FAQ questions to match stat cards
  const faqsWithEmoji = [
    { ...faqs[0], emoji: '♻️' },
    { ...faqs[1], emoji: '⚠️' },
    { ...faqs[2], emoji: '🌍' },
  ];

  const toggleFaq = (id) => setExpandedFaq(expandedFaq === id ? null : id);
  const toggleSafety = (i) => setExpandedSafety(expandedSafety === i ? null : i);
  const toggleEmergency = (i) => setExpandedEmergency(expandedEmergency === i ? null : i);

  const steps = safetySteps[language];
  const emerg = emergencies[language];

  return (
    <div className="page-container">
      <section className="education-page">
        <div className="container">
          <h1 className="page-title">{t.education.title}</h1>
          <p className="page-subtitle">{t.education.subtitle}</p>

          {/* ── FAQ + Stats ── */}
          <div className="education-content">
            <div className="faq-container">
              {faqsWithEmoji.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    className={`faq-question ${expandedFaq === faq.id ? 'active' : ''}`}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{faq.emoji}</span>
                      <span>{faq.question}</span>
                    </span>
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

          {/* ── WARNING BANNER ── */}
          <div className="mt-12 bg-red-50 border-2 border-red-200 rounded-xl p-5 flex gap-4 items-start">
            <span className="text-3xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-bold text-red-800 text-base mb-1">
                {language === 'en' ? 'WARNING NOTICE' : 'BABALA'}
              </h3>
              <p className="text-red-700 text-sm leading-relaxed">
                {language === 'en'
                  ? 'Electronic devices contain hazardous materials including lead, mercury, cadmium, and arsenic. These toxic substances can be harmful to your health when inhaled, ingested, or absorbed through skin contact. Please handle all e-waste with care and follow the guidelines below at all times.'
                  : 'Ang mga electronic na device ay naglalaman ng mapanganib na materyales kabilang ang tingga, mercury, cadmium, at arsenic. Ang mga nakakalason na sangkap na ito ay maaaring makapinsala sa iyong kalusugan. Mangyaring hawakan ang lahat ng e-waste nang may pag-iingat at sundin ang mga alituntunin sa lahat ng oras.'}
              </p>
            </div>
          </div>

          {/* ── SAFE HANDLING — 7 STEPS ── */}
          <div className="mt-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {language === 'en' ? '🛡️ Safe Handling Guidelines' : '🛡️ Mga Alituntunin sa Ligtas na Paghawak'}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {language === 'en'
                  ? 'Follow all 7 steps before, during, and after your e-waste drop-off'
                  : 'Sundin ang lahat ng 7 hakbang bago, habang, at pagkatapos ng iyong e-waste drop-off'}
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="bg-white rounded-xl border-2 border-emerald-100 overflow-hidden hover:border-emerald-300 transition-all">
                  <button
                    onClick={() => toggleSafety(i)}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-emerald-50 transition-colors"
                  >
                    <span className="text-2xl flex-shrink-0">{step.icon}</span>
                    <span className="font-bold text-gray-800 flex-1 text-base">{step.title}</span>
                    <FaChevronDown
                      className="text-emerald-500 flex-shrink-0 transition-transform duration-200"
                      style={{ transform: expandedSafety === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {expandedSafety === i && (
                    <div className="px-6 pb-5 border-t border-emerald-100 pt-4 bg-emerald-50">
                      {/* Step 1 has accepted/not accepted lists */}
                      {step.content ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold text-emerald-700 mb-2 text-sm uppercase tracking-wide">
                              ✅ {language === 'en' ? 'Accepted' : 'Tinatanggap'}
                            </h4>
                            <ul className="space-y-1">
                              {step.content.accepted.map((item, j) => (
                                <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold text-red-600 mb-2 text-sm uppercase tracking-wide">
                              ❌ {language === 'en' ? 'Not Accepted' : 'Hindi Tinatanggap'}
                            </h4>
                            <ul className="space-y-1">
                              {step.content.notAccepted.map((item, j) => (
                                <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <>
                          {step.desc && <p className="text-gray-600 text-sm mb-3 leading-relaxed">{step.desc}</p>}
                          <ul className="space-y-2">
                            {step.bullets.map((bullet, j) => (
                              <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── EMERGENCY PROCEDURES ── */}
          <div className="mt-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {language === 'en' ? '🆘 Emergency Procedures' : '🆘 Mga Emergency na Pamamaraan'}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {language === 'en'
                  ? 'In case of accidental exposure to hazardous e-waste materials, act immediately'
                  : 'Sa kaso ng aksidenteng pagkakalantad sa mapanganib na materyales ng e-waste, kumilos agad'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {emerg.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border-2 border-emerald-100 overflow-hidden hover:border-emerald-300 transition-all">
                  <button
                    onClick={() => toggleEmergency(i)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-emerald-50 transition-colors"
                  >
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <span className="font-bold text-gray-800 flex-1">{item.title}</span>
                    <FaChevronDown
                      className="text-emerald-500 flex-shrink-0 transition-transform duration-200"
                      style={{ transform: expandedEmergency === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  {expandedEmergency === i && (
                    <div className="px-5 pb-4 border-t border-emerald-100 pt-3 bg-emerald-50">
                      <ol className="space-y-2">
                        {item.steps.map((step, j) => (
                          <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{j + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
              <h3 className="font-bold text-red-800 text-base mb-4 flex items-center gap-2">
                📞 {language === 'en' ? 'Emergency Contact Numbers' : 'Mga Emergency na Numero'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyContacts.map((contact, i) => (
                  <div key={i} className="bg-white rounded-lg px-4 py-3 border border-red-100 flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-medium">{contact.label}</span>
                    <span className="text-sm font-bold text-red-700 ml-2">{contact.number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── HOW TO DROP OFF ── */}
          <div className="mt-10">
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
              {[
                { step: '1', en: { title: 'Prepare Your Items', desc: 'Gather all e-waste you want to dispose of. Pack them securely in a bag or box.' }, fil: { title: 'Ihanda ang Iyong mga Item', desc: 'Tipunin ang lahat ng e-waste. I-pack ang mga ito nang maayos sa isang bag o kahon.' } },
                { step: '2', en: { title: 'Register Online', desc: 'Log in to E-Cycle Hub, go to Register, and submit your drop-off details — location, type, and estimated weight.' }, fil: { title: 'Mag-rehistro Online', desc: 'Mag-login sa E-Cycle Hub, pumunta sa Mag-rehistro, at isumite ang iyong mga detalye ng drop-off.' } },
                { step: '3', en: { title: 'Go to Drop-off Point', desc: 'Bring your packed e-waste to your selected drop-off location during operating hours (Friday–Saturday).' }, fil: { title: 'Pumunta sa Drop-off Point', desc: 'Dalhin ang iyong nakapackang e-waste sa piniling lokasyon sa oras ng operasyon (Biyernes–Sabado).' } },
                { step: '4', en: { title: 'Staff Will Verify', desc: 'Barangay staff will weigh and verify your items. Your submission status will be updated in your dashboard.' }, fil: { title: 'I-verify ng Staff', desc: 'Ang barangay staff ay magtatimbang at mag-ve-verify ng iyong mga item. Ia-update ang status sa dashboard.' } },
                { step: '5', en: { title: 'Claim Your Reward', desc: 'Once marked as Done, download your certificate from your dashboard and claim your ₱5/kg reward at the Barangay Hall.' }, fil: { title: 'I-claim ang Iyong Gantimpala', desc: 'Kapag Done na, i-download ang iyong sertipiko mula sa dashboard at i-claim ang ₱5/kg sa Barangay Hall.' } },
              ].map((s, i, arr) => (
                <div key={i} className="flex gap-4 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                      {s.step}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-0.5 bg-emerald-200 flex-1 mt-2" style={{ minHeight: '24px' }} />
                    )}
                  </div>
                  <div className="bg-white rounded-xl border border-emerald-100 p-4 flex-1 hover:border-emerald-300 hover:shadow-sm transition-all">
                    <h3 className="font-bold text-gray-900 mb-1">{language === 'en' ? s.en.title : s.fil.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{language === 'en' ? s.en.desc : s.fil.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default EducationPage;