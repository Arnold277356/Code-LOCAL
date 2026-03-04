import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const faqs = {
  en: [
    {
      category: '📱 Using the Website',
      items: [
        {
          q: 'Do I need to create an account to use E-Cycle Hub?',
          a: 'You can browse the website freely — view the map, updates, and education pages without an account. You only need to register when you want to drop off e-waste and earn rewards.'
        },
        {
          q: 'I don\'t have internet at home. Can I still use this?',
          a: 'Yes! You can visit the Barangay Hall and ask the barangay staff to assist you in registering your e-waste drop-off. The system can be accessed on any device with internet.'
        },
        {
          q: 'I forgot my password. What do I do?',
          a: 'Currently, please visit the Barangay Hall and ask staff to assist you in resetting your account. Bring a valid ID.'
        },
        {
          q: 'How do I register my e-waste drop-off?',
          a: 'Log in to your account, click "Register" in the navigation bar, select your drop-off location, enter the weight and type of your e-waste, then submit. You can track your submission status on your Dashboard.'
        },
      ]
    },
    {
      category: '♻️ E-Waste Drop-off',
      items: [
        {
          q: 'What items are accepted?',
          a: 'We accept: mobile phones, laptops, desktop computers, tablets, monitors, keyboards, mice, cables, chargers, printers, scanners, hard drives, RAM, motherboards, power supplies, and televisions.'
        },
        {
          q: 'Where are the drop-off locations?',
          a: 'Drop-off points are located at the Burol 1 Barangay Hall, Burol 1 Community Center, and Burol 1 Market Area. Check the Drop-off Map page for exact locations and schedules.'
        },
        {
          q: 'What are the collection hours?',
          a: 'Collection is every Friday and Saturday. Hours vary per location — check the Drop-off Map page for the most updated schedule.'
        },
        {
          q: 'Can I drop off e-waste without registering online?',
          a: 'Yes, you can bring your e-waste directly to any drop-off point. However, to earn rewards, you must have a registered account and submit your drop-off through the website.'
        },
      ]
    },
    {
      category: '💰 Rewards',
      items: [
        {
          q: 'How much can I earn?',
          a: 'You earn ₱5 for every kilogram of e-waste you drop off. The minimum weight for a reward claim is 0.5 kg.'
        },
        {
          q: 'How do I claim my reward?',
          a: 'Once your drop-off status is marked as "Done" by the barangay admin, go to your Dashboard and click the "Claim Reward" button. Follow the instructions — you will need to visit the Barangay Hall with a valid ID to collect your reward voucher.'
        },
        {
          q: 'Why does my reward show ₱0 or "Pending"?',
          a: 'Rewards are only finalized once the barangay staff has verified and weighed your e-waste and marked your submission as "Done." Please wait for your status to update.'
        },
        {
          q: 'How long are reward vouchers valid?',
          a: 'Reward vouchers are valid for 12 months from the date of issuance. Vouchers are non-transferable and non-refundable.'
        },
      ]
    },
    {
      category: '🏛️ Barangay & Contact',
      items: [
        {
          q: 'Who manages the E-Cycle Hub?',
          a: 'The E-Cycle Hub is managed by the Barangay Government of Burol 1, Dasmariñas City, Cavite.'
        },
        {
          q: 'How do I contact the barangay for help?',
          a: 'You can call 09916338752 or visit the Barangay Hall at Burol 1, Dasmariñas Cavite during office hours. You can also follow our Facebook page for updates.'
        },
        {
          q: 'I need help using the website. Who can I ask?',
          a: 'Visit the Barangay Hall and our staff will assist you. You can also ask a family member or neighbor to help you register and submit your e-waste online.'
        },
      ]
    },
  ],
  fil: [
    {
      category: '📱 Paggamit ng Website',
      items: [
        {
          q: 'Kailangan ba akong gumawa ng account para magamit ang E-Cycle Hub?',
          a: 'Maaari kang mag-browse ng website nang libre — tingnan ang mapa, mga update, at mga pahina ng edukasyon nang walang account. Kailangan mo lamang mag-register kapag gusto mong mag-drop off ng e-waste at kumita ng gantimpala.'
        },
        {
          q: 'Wala akong internet sa bahay. Magagamit ko pa rin ba ito?',
          a: 'Oo! Maaari kang bumisita sa Barangay Hall at humingi ng tulong sa barangay staff para sa pagpaparehistro ng iyong e-waste drop-off. Maaaring ma-access ang sistema sa anumang device na may internet.'
        },
        {
          q: 'Nakalimutan ko ang aking password. Ano ang gagawin ko?',
          a: 'Sa kasalukuyan, mangyaring bisitahin ang Barangay Hall at humingi ng tulong sa staff para i-reset ang iyong account. Magdala ng valid ID.'
        },
        {
          q: 'Paano ako magrerehistro ng aking e-waste drop-off?',
          a: 'Mag-login sa iyong account, i-click ang "Mag-rehistro" sa navigation bar, piliin ang iyong lokasyon ng drop-off, ilagay ang timbang at uri ng iyong e-waste, pagkatapos ay isumite. Maaari mong subaybayan ang katayuan ng iyong submission sa iyong Dashboard.'
        },
      ]
    },
    {
      category: '♻️ Pagdadala ng E-Waste',
      items: [
        {
          q: 'Anong mga gamit ang tinatanggap?',
          a: 'Tumatanggap kami ng: mga cellphone, laptop, desktop computer, tablet, monitor, keyboard, mouse, cable, charger, printer, scanner, hard drive, RAM, motherboard, power supply, at telebisyon.'
        },
        {
          q: 'Saan ang mga lokasyon ng drop-off?',
          a: 'Ang mga drop-off point ay matatagpuan sa Burol 1 Barangay Hall, Burol 1 Community Center, at Burol 1 Market Area. Tingnan ang pahina ng Drop-off Map para sa eksaktong lokasyon at mga iskedyul.'
        },
        {
          q: 'Ano ang mga oras ng koleksyon?',
          a: 'Ang koleksyon ay tuwing Biyernes at Sabado. Iba-iba ang oras depende sa lokasyon — tingnan ang pahina ng Drop-off Map para sa pinakabagong iskedyul.'
        },
        {
          q: 'Maaari ba akong mag-drop off ng e-waste nang hindi nagpaparehistro online?',
          a: 'Oo, maaari kang magdala ng iyong e-waste direkta sa anumang drop-off point. Gayunpaman, para kumita ng gantimpala, kailangan mong magkaroon ng registered account at isumite ang iyong drop-off sa pamamagitan ng website.'
        },
      ]
    },
    {
      category: '💰 Mga Gantimpala',
      items: [
        {
          q: 'Magkano ang maaari kong kitain?',
          a: 'Kumikita ka ng ₱5 para sa bawat kilo ng e-waste na iyong ibi-drop off. Ang minimum na timbang para sa pag-claim ng gantimpala ay 0.5 kg.'
        },
        {
          q: 'Paano ko i-claim ang aking gantimpala?',
          a: 'Kapag ang katayuan ng iyong drop-off ay minarkahan ng barangay admin bilang "Done," pumunta sa iyong Dashboard at i-click ang button na "I-claim ang Gantimpala." Sundin ang mga instruksyon — kakailanganin mong bumisita sa Barangay Hall na may valid ID para kolektahin ang iyong reward voucher.'
        },
        {
          q: 'Bakit nagpapakita ang aking gantimpala ng ₱0 o "Pending"?',
          a: 'Ang mga gantimpala ay nagiging pinal lamang kapag na-verify at natimbang ng barangay staff ang iyong e-waste at namarkahan ang iyong submission bilang "Done." Mangyaring hintayin ang pag-update ng iyong katayuan.'
        },
        {
          q: 'Gaano katagal valid ang mga reward voucher?',
          a: 'Ang mga reward voucher ay valid sa loob ng 12 buwan mula sa petsa ng pagbibigay. Ang mga voucher ay hindi maaaring ilipat o ibalik.'
        },
      ]
    },
    {
      category: '🏛️ Barangay at Pakikipag-ugnayan',
      items: [
        {
          q: 'Sino ang namamahala ng E-Cycle Hub?',
          a: 'Ang E-Cycle Hub ay pinamahalaan ng Pamahalaan ng Barangay ng Burol 1, Dasmariñas City, Cavite.'
        },
        {
          q: 'Paano ako makikipag-ugnayan sa barangay para sa tulong?',
          a: 'Maaari kang tumawag sa 09916338752 o bumisita sa Barangay Hall sa Burol 1, Dasmariñas Cavite sa oras ng opisina. Maaari ka ring sumunod sa aming Facebook page para sa mga update.'
        },
        {
          q: 'Kailangan ko ng tulong sa paggamit ng website. Kanino ako magtatanong?',
          a: 'Bumisita sa Barangay Hall at ang aming staff ay tutulong sa iyo. Maaari ka ring humingi ng tulong sa isang miyembro ng pamilya o kapitbahay para tulungan kang mag-register at isumite ang iyong e-waste online.'
        },
      ]
    },
  ]
};

function FAQPage() {
  const [openItem, setOpenItem] = useState(null);
  const { language } = useLanguage();
  const content = faqs[language];

  const toggle = (key) => setOpenItem(openItem === key ? null : key);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {language === 'en' ? 'Frequently Asked Questions' : 'Mga Madalas na Katanungan'}
          </h1>
          <p className="text-emerald-100">
            {language === 'en'
              ? 'Everything you need to know about E-Cycle Hub'
              : 'Lahat ng kailangan mong malaman tungkol sa E-Cycle Hub'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {content.map((section, si) => (
          <div key={si}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{section.category}</h2>
            <div className="space-y-3">
              {section.items.map((item, ii) => {
                const key = `${si}-${ii}`;
                const isOpen = openItem === key;
                return (
                  <div key={ii} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-800 pr-4">{item.q}</span>
                      <span className={`text-emerald-600 text-xl transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Offline help box */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
          <p className="text-2xl mb-2">🏛️</p>
          <h3 className="font-bold text-emerald-800 text-lg mb-1">
            {language === 'en' ? 'Need help in person?' : 'Kailangan ng tulong nang personal?'}
          </h3>
          <p className="text-emerald-700 text-sm mb-3">
            {language === 'en'
              ? 'Visit us at the Barangay Hall — our staff will assist you with registration and drop-off.'
              : 'Bisitahin kami sa Barangay Hall — ang aming staff ay tutulong sa iyo sa pagpaparehistro at drop-off.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm font-semibold text-emerald-800">
            <span>📍 Burol 1, Dasmariñas Cavite</span>
            <span>📞 09916338752</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;