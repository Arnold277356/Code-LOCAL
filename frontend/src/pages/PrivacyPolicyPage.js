import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const sections = [
  {
    num: '01',
    titleEn: 'Introduction',
    titleFil: 'Panimula',
    contentEn: `The E-Cycle Hub is committed to protecting the privacy and personal information of all its users in accordance with Republic Act No. 10173, also known as the Data Privacy Act of 2012, and its implementing rules and regulations. This Privacy Policy explains how we collect, use, store, and protect your personal information when you access and use the E-Cycle Hub platform.\n\nBy registering and using the E-Cycle Hub, you acknowledge that you have read, understood, and agreed to the terms outlined in this Privacy Policy. If you do not agree with any part of this policy, please refrain from using the platform.`,
    contentFil: `Ang E-Cycle Hub ay nakatuon sa pagprotekta ng privacy at personal na impormasyon ng lahat ng mga gumagamit nito alinsunod sa Republika Batas Blg. 10173, na kilala rin bilang ang Data Privacy Act ng 2012, at ang mga panuntunang nagpapatupad nito. Ipinaliliwanag ng Privacy Policy na ito kung paano namin kinokolekta, ginagamit, iniimbak, at pinoprotektahan ang iyong personal na impormasyon kapag na-access at ginamit mo ang platform ng E-Cycle Hub.\n\nSa pagpaparehistro at paggamit ng E-Cycle Hub, kinikilala mo na iyong nabasa, naunawaan, at napagkasunduan ang mga tuntunin na nakabalangkas sa Privacy Policy na ito.`,
  },
  {
    num: '02',
    titleEn: 'What Personal Information We Collect',
    titleFil: 'Anong Personal na Impormasyon ang Aming Kinokolekta',
    contentEn: `When you register and use the E-Cycle Hub, we may collect the following personal information:\n\n📋 Account Information:\n• Full name\n• Email address (Gmail or any valid email)\n• Barangay zone or area within Burol 1\n\n♻️ Usage Information:\n• E-waste drop-off submission records\n• Type and weight of e-waste submitted\n• Selected drop-off location\n• Date and time of submissions\n• Reward points and redemption history\n\n💻 Device Information:\n• Browser type and version\n• Device type used to access the website`,
    contentFil: `Kapag nagrerehistro at gumagamit ng E-Cycle Hub, maaari naming kolektahin ang sumusunod na personal na impormasyon:\n\n📋 Impormasyon sa Account:\n• Buong pangalan\n• Email address (Gmail o anumang valid na email)\n• Zone o lugar sa loob ng Burol 1\n\n♻️ Impormasyon sa Paggamit:\n• Mga rekord ng pagsumite ng e-waste drop-off\n• Uri at timbang ng isinumiteng e-waste\n• Piniling lokasyon ng drop-off\n• Petsa at oras ng mga pagsumite\n• Mga reward points at kasaysayan ng redemption\n\n💻 Impormasyon ng Device:\n• Uri at bersyon ng browser\n• Uri ng device na ginamit sa pag-access sa website`,
  },
  {
    num: '03',
    titleEn: 'Why We Collect Your Information',
    titleFil: 'Bakit Namin Kinokolekta ang Iyong Impormasyon',
    contentEn: `Your personal information is collected for the following specific and legitimate purposes only:\n\n• To create and manage your E-Cycle Hub user account\n• To track your e-waste drop-off history and reward points\n• To verify your drop-off submissions and issue reward certificates\n• To send you email notifications about collection schedules, updates, and reward reminders\n• To generate anonymized community-level data for program monitoring and barangay reporting\n• To improve the features and services of the E-Cycle Hub platform\n\nYour personal information will not be used for any other purpose without your explicit consent.`,
    contentFil: `Ang iyong personal na impormasyon ay kinokolekta para sa mga sumusunod na tiyak at lehitimong layunin lamang:\n\n• Para lumikha at pamahalaan ang iyong user account sa E-Cycle Hub\n• Para subaybayan ang iyong kasaysayan ng e-waste drop-off at reward points\n• Para i-verify ang iyong mga pagsumite ng drop-off at mag-isyu ng mga reward certificate\n• Para magpadala sa iyo ng mga email notification tungkol sa mga iskedyul ng koleksyon, mga update, at mga paalala ng gantimpala\n• Para makabuo ng anonymized na data sa antas ng komunidad para sa pagsubaybay ng programa at pag-uulat ng barangay\n• Para mapabuti ang mga tampok at serbisyo ng platform ng E-Cycle Hub\n\nAng iyong personal na impormasyon ay hindi gagamitin para sa anupamang layunin nang wala ang iyong pahintulot.`,
  },
  {
    num: '04',
    titleEn: 'How We Protect Your Information',
    titleFil: 'Paano Namin Pinoprotektahan ang Iyong Impormasyon',
    contentEn: `The E-Cycle Hub implements the following measures to protect your personal data:\n\n🔒 Your personal information is stored in a secure database with access limited to authorized E-Cycle Hub administrators and designated Barangay Burol 1 personnel only.\n\n🚫 Your email address and personal details are never sold, shared, or disclosed to any third party without your explicit consent, except as required by law.\n\n🛡️ All data transmissions between your device and the E-Cycle Hub website are protected through secure protocols.\n\n🔑 Access to user data is restricted on a need-to-know basis — only personnel directly involved in program administration are authorized to view user information.`,
    contentFil: `Ipinapatupad ng E-Cycle Hub ang mga sumusunod na hakbang para protektahan ang iyong personal na data:\n\n🔒 Ang iyong personal na impormasyon ay iniimbak sa isang secure na database na may access na limitado sa mga awtorisadong administrator ng E-Cycle Hub at itinalagang tauhan ng Barangay Burol 1 lamang.\n\n🚫 Ang iyong email address at personal na detalye ay hindi kailanman ibinebenta, ibinabahagi, o ibinubunyag sa anumang third party nang wala ang iyong pahintulot, maliban kung kinakailangan ng batas.\n\n🛡️ Lahat ng pagpapadala ng data sa pagitan ng iyong device at ng website ng E-Cycle Hub ay protektado sa pamamagitan ng mga secure na protocol.\n\n🔑 Ang access sa data ng user ay nililimitahan batay sa pangangailangan — ang mga tauhan lamang na direktang kasangkot sa pamamahala ng programa ang awtorisadong tingnan ang impormasyon ng user.`,
  },
  {
    num: '05',
    titleEn: 'Your Rights Under the Data Privacy Act of 2012',
    titleFil: 'Ang Iyong Mga Karapatan Ayon sa Data Privacy Act ng 2012',
    contentEn: `As a data subject under Republic Act No. 10173, you have the following rights:\n\n📢 Right to be Informed — You have the right to know what personal information is being collected, why, and how it will be used.\n\n👁️ Right to Access — You have the right to request access to your personal information stored in our system at any time.\n\n✏️ Right to Rectification — You have the right to correct any inaccurate or outdated personal information in your account.\n\n🗑️ Right to Erasure or Blocking — You have the right to request the deletion or blocking of your personal information if it is no longer necessary.\n\n🚫 Right to Object — You have the right to object to the processing of your personal information for purposes not directly related to the E-Cycle Hub program.\n\n📦 Right to Data Portability — You have the right to obtain a copy of your personal data in a structured and commonly used format.\n\n⚖️ Right to Lodge a Complaint — If you believe your data privacy rights have been violated, you have the right to file a complaint with the National Privacy Commission (NPC) of the Philippines.`,
    contentFil: `Bilang isang data subject sa ilalim ng Republika Batas Blg. 10173, mayroon kang mga sumusunod na karapatan:\n\n📢 Karapatang Maabisuhan — Mayroon kang karapatang malaman kung anong personal na impormasyon ang kinokolekta, bakit, at kung paano ito gagamitin.\n\n👁️ Karapatang Mag-access — Mayroon kang karapatang humiling ng access sa iyong personal na impormasyon na nakaimbak sa aming sistema anumang oras.\n\n✏️ Karapatang Itama — Mayroon kang karapatang itama ang anumang hindi tumpak o lumang personal na impormasyon sa iyong account.\n\n🗑️ Karapatang Burahin o Harangan — Mayroon kang karapatang humiling ng pagtanggal o pagharang ng iyong personal na impormasyon kung hindi na ito kinakailangan.\n\n🚫 Karapatang Tumutol — Mayroon kang karapatang tumutol sa pagproseso ng iyong personal na impormasyon para sa mga layuning hindi direktang may kaugnayan sa programa ng E-Cycle Hub.\n\n📦 Karapatang sa Data Portability — Mayroon kang karapatang makakuha ng kopya ng iyong personal na data sa isang nakastruktura at karaniwang ginagamit na format.\n\n⚖️ Karapatang Magreklamo — Kung naniniwala kang nilabag ang iyong mga karapatan sa privacy ng data, mayroon kang karapatang magreklamo sa National Privacy Commission (NPC) ng Pilipinas.`,
  },
  {
    num: '06',
    titleEn: 'Data Retention',
    titleFil: 'Pagpapanatili ng Data',
    contentEn: `Your personal information will be retained for as long as your account remains active and for as long as it is necessary to fulfill the purposes outlined in this Privacy Policy.\n\nIf you choose to delete your account, your personal information will be removed from our active database within thirty (30) days of your request, except for records required to be retained by law or for legitimate barangay reporting purposes.`,
    contentFil: `Ang iyong personal na impormasyon ay ipapanatili habang ang iyong account ay nananatiling aktibo at habang kinakailangan para matupad ang mga layuning nakabalangkas sa Privacy Policy na ito.\n\nKung pipiliin mong burahin ang iyong account, ang iyong personal na impormasyon ay aalisin mula sa aming aktibong database sa loob ng tatlumpung (30) araw mula sa iyong kahilingan, maliban sa mga rekord na kinakailangang panatilihin ng batas o para sa mga lehitimong layunin ng pag-uulat ng barangay.`,
  },
  {
    num: '07',
    titleEn: 'Cookies and Website Usage Data',
    titleFil: 'Cookies at Data sa Paggamit ng Website',
    contentEn: `The E-Cycle Hub website may use cookies and similar technologies to improve your browsing experience and to understand how users interact with the platform. These are used solely for functional and analytical purposes and do not collect sensitive personal information.\n\nYou may adjust your browser settings to refuse cookies, although this may affect certain features of the website.`,
    contentFil: `Ang website ng E-Cycle Hub ay maaaring gumamit ng cookies at katulad na mga teknolohiya para mapabuti ang iyong karanasan sa pag-browse at upang maunawaan kung paano nakikipag-ugnayan ang mga user sa platform. Ginagamit lamang ang mga ito para sa mga functional at analytical na layunin at hindi kinokolekta ang sensitibong personal na impormasyon.\n\nMaaari mong i-adjust ang mga setting ng iyong browser para tanggihan ang cookies, bagaman maaari itong makaapekto sa ilang tampok ng website.`,
  },
  {
    num: '08',
    titleEn: 'Changes to This Privacy Policy',
    titleFil: 'Mga Pagbabago sa Privacy Policy na Ito',
    contentEn: `The E-Cycle Hub reserves the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with an updated effective date.\n\nWe encourage users to review this Privacy Policy periodically to stay informed about how we are protecting their information.`,
    contentFil: `Ang E-Cycle Hub ay nagtatakda ng karapatang i-update o baguhin ang Privacy Policy na ito anumang oras. Ang anumang pagbabago ay ipapaskil sa pahinang ito na may na-update na petsa ng pagkabisa.\n\nHinahikayat namin ang mga user na pana-panahong suriin ang Privacy Policy na ito upang manatiling may kaalaman tungkol sa kung paano namin pinoprotektahan ang kanilang impormasyon.`,
  },
  {
    num: '09',
    titleEn: 'Contact Information for Data Privacy Concerns',
    titleFil: 'Impormasyon sa Pakikipag-ugnayan para sa Mga Alalahanin sa Privacy ng Data',
    contentEn: `If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us:\n\nE-Cycle Hub — Data Privacy Officer\n📍 Barangay Burol 1 Hall, Dasmariñas City, Cavite\n📞 09916338752\n🕐 Office Hours: Monday to Friday, 8:00 AM to 5:00 PM\n\nYou may also file a complaint directly with the National Privacy Commission at:\n🌐 www.privacy.gov.ph`,
    contentFil: `Kung mayroon kang mga katanungan, alalahanin, o kahilingan tungkol sa Privacy Policy na ito o sa paghawak ng iyong personal na impormasyon, mangyaring makipag-ugnayan sa amin:\n\nE-Cycle Hub — Data Privacy Officer\n📍 Barangay Burol 1 Hall, Dasmariñas City, Cavite\n📞 09916338752\n🕐 Oras ng Opisina: Lunes hanggang Biyernes, 8:00 AM hanggang 5:00 PM\n\nMaaari ka ring direktang magreklamo sa National Privacy Commission sa:\n🌐 www.privacy.gov.ph`,
  },
];

function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const [openSection, setOpenSection] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {language === 'en' ? 'Data Privacy Policy' : 'Patakaran sa Privacy ng Data'}
          </h1>
          <p className="text-emerald-100 text-sm">
            {language === 'en'
              ? 'In accordance with Republic Act No. 10173 — Data Privacy Act of 2012'
              : 'Alinsunod sa Republika Batas Blg. 10173 — Data Privacy Act ng 2012'}
          </p>
          <p className="text-emerald-200 text-xs mt-2">
            {language === 'en' ? 'Effective Date: March 2026' : 'Petsa ng Bisa: Marso 2026'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        {sections.map((section, i) => {
          const isOpen = openSection === i;
          const title = language === 'en' ? section.titleEn : section.titleFil;
          const content = language === 'en' ? section.contentEn : section.contentFil;

          return (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenSection(isOpen ? null : i)}
                className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-emerald-600 font-bold text-lg min-w-[32px]">{section.num}</span>
                <span className="font-semibold text-gray-800 flex-1">{title}</span>
                <span className={`text-emerald-600 text-xl transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                  {content.split('\n').map((line, li) => (
                    <p key={li} className={`text-gray-600 leading-relaxed ${line === '' ? 'mb-3' : 'mb-1'}`}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Closing statement */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
          <p className="text-emerald-800 font-semibold text-base">
            {language === 'en'
              ? 'By using E-Cycle Hub, you agree to this Privacy Policy and consent to the collection and processing of your personal information in accordance with the Data Privacy Act of 2012.'
              : 'Sa paggamit ng E-Cycle Hub, sumasang-ayon ka sa Privacy Policy na ito at nagbibigay ng pahintulot sa pagkolekta at pagproseso ng iyong personal na impormasyon alinsunod sa Data Privacy Act ng 2012.'}
          </p>
          <p className="text-emerald-600 text-sm mt-3 font-medium">
            {language === 'en'
              ? '— E-Cycle Hub, Barangay Burol 1, Dasmariñas City, Cavite 💚'
              : '— E-Cycle Hub, Barangay Burol 1, Dasmariñas City, Cavite 💚'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;