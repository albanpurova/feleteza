import { COUNTRY_KOSOVO, COUNTRY_ALBANIA, COUNTRY_MACEDONIA } from "./shipping";

// Qytetet sipas shtetit. Mund t'i editoni/shtoni lirisht.
export const CITIES: Record<string, string[]> = {
  [COUNTRY_KOSOVO]: [
    "Prishtinë", "Prizren", "Pejë", "Gjakovë", "Gjilan", "Mitrovicë", "Ferizaj",
    "Vushtrri", "Podujevë", "Suharekë", "Rahovec", "Lipjan", "Malishevë", "Kamenicë",
    "Viti", "Deçan", "Istog", "Klinë", "Skenderaj", "Dragash", "Fushë Kosovë",
    "Obiliq", "Shtime", "Kaçanik", "Hani i Elezit", "Junik", "Mamushë", "Novobërdë",
    "Graçanicë", "Shtërpcë",
  ],
  [COUNTRY_ALBANIA]: [
    "Tiranë", "Durrës", "Vlorë", "Shkodër", "Elbasan", "Fier", "Korçë", "Berat",
    "Lushnjë", "Kavajë", "Pogradec", "Gjirokastër", "Sarandë", "Lezhë", "Kukës",
    "Krujë", "Burrel", "Peshkopi", "Kuçovë", "Patos", "Librazhd", "Laç", "Tepelenë",
    "Përmet", "Bilisht", "Gramsh", "Ballsh", "Divjakë", "Rrëshen", "Bulqizë",
  ],
  [COUNTRY_MACEDONIA]: [
    "Shkup", "Tetovë", "Gostivar", "Kumanovë", "Strugë", "Dibër", "Ohër", "Kërçovë",
    "Manastir", "Veles", "Prilep", "Strumicë", "Koçan", "Kavadar", "Negotinë",
    "Resnjë", "Krushevë", "Vinicë", "Radovish", "Kriva Pallankë",
  ],
};
