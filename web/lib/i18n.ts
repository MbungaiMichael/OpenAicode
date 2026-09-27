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
};

export function t(key: keyof typeof dict, locale: string) {
  const l = (locales as readonly string[]).includes(locale) ? (locale as Locale) : "en";
  return dict[key][l];
}
