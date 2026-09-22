import { ref, computed } from "vue";
import manifestData from "@inventory-data/manifest.json";
import itemsData from "@inventory-data/items.json";
import countriesData from "@inventory-data/countries.json";
import partnersData from "@inventory-data/partners.json";
import dynastiesData from "@inventory-data/dynasties.json";
import timelinesData from "@inventory-data/timelines.json";
import timelineEventsData from "@inventory-data/timeline_events.json";
import collectionsData from "@inventory-data/collections.json";

const items = ref(itemsData);
const countries = ref(countriesData);
const partners = ref(partnersData);
const dynasties = ref(dynastiesData);
const timelines = ref(timelinesData);
const timelineEvents = ref(timelineEventsData);
const collections = ref(collectionsData);
const availableLangs = ref(manifestData.languages ?? []);
const defaultLang = (manifestData.languages ?? []).includes("en")
  ? "en"
  : ((manifestData.languages ?? [])[0] ?? "en");

const translationsCache = ref({});
const translations = ref({});

async function loadTranslations(lang) {
  if (translationsCache.value[lang]) return translationsCache.value[lang];
  const files = [
    "items",
    "countries",
    "dynasties",
    "partners",
    "timeline_events",
    "collections",
  ];
  const loadedTranslations = {};
  const results = await Promise.allSettled(
    files.map(async (file) => {
      const result = await import(
        `@inventory-data/translations/${file}.${lang}.json`
      );
      return { file, data: result.default };
    }),
  );
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      loadedTranslations[result.value.file] = result.value.data;
    }
  });
  translationsCache.value = {
    ...translationsCache.value,
    [lang]: loadedTranslations,
  };
  return loadedTranslations;
}

translations.value = await loadTranslations("en");

function getTranslation(lang, category, id) {
  if (!translationsCache.value[lang]) {
    translationsCache.value[lang] = loadTranslations(lang);
  }
  return translationsCache.value[lang][category][id];
}

function itemLabel(item) {
  if (!item) return "";
  return (
    translations.value.items[item.id]?.name ?? item.internal_name ?? item.id
  );
}
function countryLabel(countryId) {
  if (!countryId) return "";
  const fallback = countries.value.find((c) => c.id === countryId);
  return (
    translations.value.countries[countryId]?.name ??
    fallback?.internal_name ??
    countryId
  );
}
function dynastyLabel(dynastyId) {
  if (!dynastyId) return "";
  return translations.value.dynasties[dynastyId]?.name ?? dynastyId;
}
function partnerLabel(partnerId) {
  if (!partnerId) return "";
  const fallback = partners.value.find((p) => p.id === partnerId);
  return (
    translations.value.partners[partnerId]?.name ?? fallback?.id ?? partnerId
  );
}

export function useInventoryData() {
  return {
    items,
    countries,
    partners,
    dynasties,
    timelines,
    timelineEvents,
    collections,
    availableLangs,
    defaultLang,
    translations,
    translationsCache,
    loadTranslations,
    getTranslation,
    itemLabel,
    countryLabel,
    dynastyLabel,
    partnerLabel,
  };
}
