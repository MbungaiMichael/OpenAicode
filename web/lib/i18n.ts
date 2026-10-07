export const locales = ["en", "fr", "sw", "ar"] as const;
export type Locale = (typeof locales)[number];

const dict: Record<string, Record<Locale, string>> = {
  tagline: {
    en: "Hospitals, translators, coordinators, cost estimates, and support.",
    fr: "Hôpitaux, traducteurs, coordinateurs, devis et assistance.",
    sw: "Hospitali, wakalimani, waratibu, makadirio ya gharama na usaidizi.",
    ar: "مستشفيات ومترجمون ومنسقون وتقديرات تكلفة ودعم.",
  },
  browseHospitals: {
    en: "Browse Hospitals", fr: "Voir les hôpitaux", sw: "Tazama Hospitali", ar: "تصفح المستشفيات",
  },
  requestHelp: {
    en: "Request Assistance", fr: "Demander de l'aide", sw: "Omba Msaada", ar: "طلب المساعدة",
  },
  hospitals: {
    en: "Hospitals", fr: "Hôpitaux", sw: "Hospitali", ar: "المستشفيات",
  },
  treatments: {
    en: "Treatments", fr: "Traitements", sw: "Matibabu", ar: "العلاجات",
  },
  myRequests: {
    en: "My Requests", fr: "Mes demandes", sw: "Maombi Yangu", ar: "طلباتي",
  },
  support: {
    en: "Support", fr: "Assistance", sw: "Msaada", ar: "الدعم",
  },
  login: {
    en: "Login", fr: "Connexion", sw: "Ingia", ar: "تسجيل الدخول",
  },
  register: {
    en: "Register", fr: "S'inscrire", sw: "Jisajili", ar: "التسجيل",
  },
  statusNew: {
    en: "new", fr: "nouveau", sw: "mpya", ar: "جديد",
  },
  statusAssigned: {
    en: "assigned", fr: "assigné", sw: "imethibitishwa", ar: "تم التعيين",
  },
  statusDone: {
    en: "done", fr: "terminé", sw: "imekamilika", ar: "تم",
  },
  disclaimerShort: {
    en: "Information only — no diagnosis or guaranteed costs.",
    fr: "Information uniquement — ni diagnostic ni coûts garantis.",
    sw: "Taarifa tu — hakuna uchunguzi wala gharama za uhakika.",
    ar: "معلومات فقط — لا تشخيص ولا تكاليف مضمونة.",
  },
};

export function t(key: keyof typeof dict, locale: string) {
  const l = (locales as readonly string[]).includes(locale) ? (locale as Locale) : "en";
  return dict[key][l];
}
