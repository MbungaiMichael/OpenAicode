const glossary: Record<string, { fr: string; sw: string; ar: string }> = {
  "I need a translator for my hospital visit": {
    fr: "J'ai besoin d'un traducteur pour ma visite à l'hôpital.",
    sw: "Nahitaji mkalimani kwa ziara yangu hospitalini.",
    ar: "أحتاج إلى مترجم لزيارتي إلى المستشفى.",
  },
  "Where is the pharmacy?": {
    fr: "Où est la pharmacie ?",
    sw: "Famasia iko wapi?",
    ar: "أين الصيدلية؟",
  },
  "I need a cost estimate in writing": {
    fr: "J'ai besoin d'un devis écrit.",
    sw: "Nahitaji makadirio ya gharama kwa maandishi.",
    ar: "أحتاج إلى تقدير تكلفة مكتوب.",
  },
  "When is my appointment?": {
    fr: "Quand est mon rendez-vous ?",
    sw: "Miadi yangu ni lini?",
    ar: "متى موعدي؟",
  },
  "I have an allergy": {
    fr: "J'ai une allergie.",
    sw: "Nina mzio.",
    ar: "لدي حساسية.",
  },
  "Please call my coordinator": {
    fr: "Veuillez appeler mon coordinateur.",
    sw: "Tafadhali mpigie mratibu wangu.",
    ar: "يرجى الاتصال بمنسقي.",
  },
};

export function translatePhrase(english: string) {
  const key = Object.keys(glossary).find((k) => k.toLowerCase() === english.trim().toLowerCase());
  return key ? { english: key, ...glossary[key] } : null;
}

export function phraseList() {
  return Object.keys(glossary);
}
