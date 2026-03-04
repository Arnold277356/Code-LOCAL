import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      ewasteInfo: 'E-Waste Info',
      dropoffMap: 'Drop-off Map',
      updates: 'Updates',
      register: 'Register',
      incentives: 'Incentives',
      login: 'Login',
      myAccount: 'My Account',
    },

    // HomePage
    home: {
      heroTitle: 'E-Cycle Hub',
      heroTagline: 'Responsibly recycle your e-waste and earn rewards while protecting our environment',
      registerBtn: 'Register Drop-off',
      learnMoreBtn: 'Learn More',
      whyTitle: 'Why E-Cycle Hub?',
      feature1Title: 'Protect Environment',
      feature1Desc: 'Prevent toxic e-waste from contaminating our soil and water',
      feature2Title: 'Earn Rewards',
      feature2Desc: 'Get ₱5 per kilogram of e-waste you responsibly recycle',
      feature3Title: 'Circular Economy',
      feature3Desc: 'Help recover valuable materials for reuse and manufacturing',
      feature4Title: 'Community Impact',
      feature4Desc: 'Join thousands making a difference in our barangay',
      quickAccessTitle: 'Quick Access',
      link1Title: 'Learn About E-Waste',
      link1Desc: 'Understand why e-waste matters',
      link2Title: 'Find Drop-off Points',
      link2Desc: 'Locate nearest collection center',
      link3Title: 'Register E-Waste',
      link3Desc: 'Start your recycling journey',
      link4Title: 'View Rewards',
      link4Desc: 'See how much you can earn',
    },

    // LoginPage
    login: {
      welcomeBack: 'Welcome Back',
      subtitle: 'Sign in to track your e-waste drops and earn rewards',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter your username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      signInBtn: 'Sign In',
      signingIn: 'Signing in...',
      noAccount: "Don't have an account?",
      registerHere: 'Register here',
      featuresTitle: 'Features',
      feature1: 'Track e-waste drops',
      feature2: 'Monitor rewards earned',
      feature3: 'View collection history',
      trackImpact: '📊 Track Impact',
      trackImpactDesc: 'Monitor your e-waste drops and rewards',
      earnRewards: '💰 Earn Rewards',
      earnRewardsDesc: 'Get ₱5 per kilogram of e-waste',
      helpEnv: '🌍 Help Environment',
      helpEnvDesc: 'Be part of the solution',
    },

    // RegisterPage
    register: {
      titleLoggedIn: 'Report E-Waste',
      titleNew: 'Register - E-Cycle Hub',
      ewasteSection: 'E-Waste Details',
      optional: '(Optional)',
      optionalNote: 'You can report e-waste now or later from your dashboard.',
      dropoffAddress: 'Drop-off Address',
      weight: 'Weight (kg)',
      selectEwaste: 'Select E-Waste Type',
      accountSection: 'Account Credentials (Required)',
      firstName: 'First Name *',
      lastName: 'Last Name *',
      username: 'Username *',
      email: 'Email *',
      password: 'Password *',
      confirmPassword: 'Confirm Password *',
      securityAnswer: 'Security Answer *',
      consent: 'I agree to the e-waste processing terms.',
      submitEwaste: 'Submit E-Waste Record',
      completeReg: 'Complete Registration',
      processing: 'Processing...',
    },

    // DashboardPage
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome,',
      logout: 'Logout',
      logoutConfirm: 'Logout?',
      logoutText: 'Are you sure you want to logout?',
      logoutYes: 'Yes, logout',
      totalDrops: 'Total Drops',
      ewasteItems: 'e-waste items',
      totalWeight: 'Total Weight',
      recycled: 'recycled',
      totalRewards: 'Total Rewards',
      earned: 'earned',
      envImpact: 'Environmental Impact',
      co2Saved: 'kg CO₂ saved',
      dropHistory: 'Your Drop History',
      noDrops: 'No e-waste submissions yet.',
      noDropsHint: 'Use the New Drop-off button to get started!',
      type: 'Type',
      weight: 'Weight',
      date: 'Date',
      location: 'Location',
      reward: 'Reward',
      status: 'Status',
      quickActions: 'Quick Actions',
      newDropoff: 'New Drop-off',
      newDropoffDesc: 'Register e-waste',
      findLocation: 'Find Location',
      findLocationDesc: 'Nearest drop-off',
      viewRewards: 'View Rewards',
      viewRewardsDesc: 'Reward details',
      updates: 'Updates',
      updatesDesc: 'Latest news',
    },

    // UpdatesPage
    updates: {
      title: 'Collection Updates & Announcements',
      subtitle: 'Stay informed about collection schedules and important notices',
      all: 'All Updates',
      collection: 'Collection',
      notices: 'Notices',
      announcements: 'Announcements',
      noAnnouncements: 'No announcements at this time. Check back soon!',
      tip: '💡 Tip:',
      tipText: 'Follow our Barangay Facebook page for real-time updates and announcements.',
    },
  },

  fil: {
    // Navigation
    nav: {
      home: 'Tahanan',
      ewasteInfo: 'Impormasyon sa E-Waste',
      dropoffMap: 'Mapa ng Drop-off',
      updates: 'Mga Update',
      register: 'Mag-rehistro',
      incentives: 'Mga Insentibo',
      login: 'Mag-login',
      myAccount: 'Aking Account',
    },

    // HomePage
    home: {
      heroTitle: 'E-Cycle Hub',
      heroTagline: 'Responsableng i-recycle ang iyong e-waste at kumita ng gantimpala habang pinoprotektahan ang ating kalikasan',
      registerBtn: 'Mag-rehistro ng Drop-off',
      learnMoreBtn: 'Matuto Pa',
      whyTitle: 'Bakit E-Cycle Hub?',
      feature1Title: 'Protektahan ang Kalikasan',
      feature1Desc: 'Pigilan ang nakakalason na e-waste mula sa pagkontamina ng ating lupa at tubig',
      feature2Title: 'Kumita ng Gantimpala',
      feature2Desc: 'Makakuha ng ₱5 bawat kilo ng e-waste na iyong responsableng ini-recycle',
      feature3Title: 'Circular Economy',
      feature3Desc: 'Tumulong sa pagbawi ng mahahalagang materyales para sa muling paggamit',
      feature4Title: 'Epekto sa Komunidad',
      feature4Desc: 'Samahan ang libu-libo na gumagawa ng pagbabago sa ating barangay',
      quickAccessTitle: 'Mabilis na Access',
      link1Title: 'Matuto Tungkol sa E-Waste',
      link1Desc: 'Unawain kung bakit mahalaga ang e-waste',
      link2Title: 'Hanapin ang Drop-off Points',
      link2Desc: 'Hanapin ang pinakamalapit na koleksyon',
      link3Title: 'Mag-rehistro ng E-Waste',
      link3Desc: 'Simulan ang iyong paglalakbay sa pag-recycle',
      link4Title: 'Tingnan ang Gantimpala',
      link4Desc: 'Alamin kung magkano ang maaari mong kitain',
    },

    // LoginPage
    login: {
      welcomeBack: 'Maligayang Pagbabalik',
      subtitle: 'Mag-sign in para subaybayan ang iyong mga e-waste drop at kumita ng gantimpala',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Ilagay ang iyong username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Ilagay ang iyong password',
      signInBtn: 'Mag-sign In',
      signingIn: 'Nagsi-sign in...',
      noAccount: 'Wala pang account?',
      registerHere: 'Mag-rehistro dito',
      featuresTitle: 'Mga Tampok',
      feature1: 'Subaybayan ang mga e-waste drop',
      feature2: 'Bantayan ang mga natanggap na gantimpala',
      feature3: 'Tingnan ang kasaysayan ng koleksyon',
      trackImpact: '📊 Subaybayan ang Epekto',
      trackImpactDesc: 'Bantayan ang iyong mga e-waste drop at gantimpala',
      earnRewards: '💰 Kumita ng Gantimpala',
      earnRewardsDesc: 'Makakuha ng ₱5 bawat kilo ng e-waste',
      helpEnv: '🌍 Tulungan ang Kalikasan',
      helpEnvDesc: 'Maging bahagi ng solusyon',
    },

    // RegisterPage
    register: {
      titleLoggedIn: 'Mag-ulat ng E-Waste',
      titleNew: 'Mag-rehistro - E-Cycle Hub',
      ewasteSection: 'Mga Detalye ng E-Waste',
      optional: '(Opsyonal)',
      optionalNote: 'Maaari kang mag-ulat ng e-waste ngayon o mamaya mula sa iyong dashboard.',
      dropoffAddress: 'Address ng Drop-off',
      weight: 'Timbang (kg)',
      selectEwaste: 'Piliin ang Uri ng E-Waste',
      accountSection: 'Mga Kredensyal ng Account (Kinakailangan)',
      firstName: 'Pangalan *',
      lastName: 'Apelyido *',
      username: 'Username *',
      email: 'Email *',
      password: 'Password *',
      confirmPassword: 'Kumpirmahin ang Password *',
      securityAnswer: 'Sagot sa Seguridad *',
      consent: 'Sumasang-ayon ako sa mga tuntunin ng pagproseso ng e-waste.',
      submitEwaste: 'Isumite ang Rekord ng E-Waste',
      completeReg: 'Kumpletuhin ang Pagpaparehistro',
      processing: 'Pinoproseso...',
    },

    // DashboardPage
    dashboard: {
      title: 'Dashboard',
      welcome: 'Maligayang pagdating,',
      logout: 'Mag-logout',
      logoutConfirm: 'Mag-logout?',
      logoutText: 'Sigurado ka bang gusto mong mag-logout?',
      logoutYes: 'Oo, mag-logout',
      totalDrops: 'Kabuuang Drops',
      ewasteItems: 'mga e-waste',
      totalWeight: 'Kabuuang Timbang',
      recycled: 'na-recycle',
      totalRewards: 'Kabuuang Gantimpala',
      earned: 'nakuha',
      envImpact: 'Epekto sa Kalikasan',
      co2Saved: 'kg CO₂ na natipid',
      dropHistory: 'Kasaysayan ng Iyong Drops',
      noDrops: 'Wala pang mga isinumiteng e-waste.',
      noDropsHint: 'Gamitin ang pindutan ng Bagong Drop-off para magsimula!',
      type: 'Uri',
      weight: 'Timbang',
      date: 'Petsa',
      location: 'Lokasyon',
      reward: 'Gantimpala',
      status: 'Katayuan',
      quickActions: 'Mabilis na Aksyon',
      newDropoff: 'Bagong Drop-off',
      newDropoffDesc: 'Mag-rehistro ng e-waste',
      findLocation: 'Hanapin ang Lokasyon',
      findLocationDesc: 'Pinakamalapit na drop-off',
      viewRewards: 'Tingnan ang Gantimpala',
      viewRewardsDesc: 'Mga detalye ng gantimpala',
      updates: 'Mga Update',
      updatesDesc: 'Pinakabagong balita',
    },

    // UpdatesPage
    updates: {
      title: 'Mga Update at Anunsyo sa Koleksyon',
      subtitle: 'Manatiling updated tungkol sa mga iskedyul ng koleksyon at mahahalagang abiso',
      all: 'Lahat ng Update',
      collection: 'Koleksyon',
      notices: 'Mga Abiso',
      announcements: 'Mga Anunsyo',
      noAnnouncements: 'Walang mga anunsyo sa ngayon. Bumalik muli mamaya!',
      tip: '💡 Tip:',
      tipText: 'Sundan ang aming Facebook page ng Barangay para sa mga real-time na update at anunsyo.',
    },
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fil' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}