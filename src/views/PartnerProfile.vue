<template>
  <div id="partner-profile-wrapper">
    <!-- Available language options for profile data -->
    <div id="profile-languages">
      <button
        class="profile-languages-button"
        :class="{
          'profile-language-selected': defaultLang,
        }"
        v-for="language in availableLangs"
        :key="language"
        @click="setLanguage(language)"
      >
        {{ availableLangs[language] }}
      </button>
    </div>

    <div id="partner-profile-container">
      <button @click="$router.go(-1)">
        <font-awesome-icon :icon="['fas', 'reply']" />Back
      </button>

      <!-- <LoaderComponent /> -->
      <div id="partner-profile">
        <p id="partner-name">{{ text.name }}</p>
        <p id="partner-location">
          <span v-if="text.city">{{ text.city }}, </span
          >{{ partner.country_id }} (placeholder)
        </p>

        <!-- "Links" to show different categories of information -->
        <div id="partner-links-container">
          <div id="partner-links-wrapper">
            <div id="partner-links" class="partner-links-background">
              <div>
                <button @click="setShowingInfo = 'description'">About</button>
                <span class="partner-links-divider">|</span>
                <button
                  @click="setShowingInfo = 'contact'"
                  v-if="hasContactInfo"
                >
                  Contact
                </button>
                <span class="partner-links-divider" v-if="hasContactInfo"
                  >|</span
                >
                <button @click="setShowingInfo = 'logo'">Logo</button>
                <span
                  class="partner-links-divider"
                  v-if="text.website && !lessThan599"
                  >|</span
                >
              </div>
              <div>
                <a
                  id="partner-home"
                  v-if="text.website"
                  :href="sanitizedURL"
                  target="_blank"
                >
                  <font-awesome-icon :icon="['fas', 'up-right-from-square']" />
                  Go to the Partner's homepage
                </a>
              </div>
            </div>
          </div>
          <!-- Link that goes to Partner Objects page -->
          <div id="partner-objects" v-if="partner.item_count">
            <!-- <router-link
                class="partner-links-background"
                :to="{
                    name: 'partner-objects',
                    params: {
                    database: info.projectId,
                    country: info.countryId,
                    id: info.partnerId,
                    page: 1,
                    },
                }"
                >View Objects
                </router-link> -->
            <p class="partner-links-background">View Objects (Placeholder)</p>
          </div>
        </div>

        <div id="profile-photo-wrapper">
          <!-- Partner photos and thumbnails -->
          <div class="profile-photo-container" v-if="partner.images.length">
            <div class="profile-photo" @click="showLightbox = true">
              <!-- <ZoomComponent :img-normal="currentPhoto"></ZoomComponent> -->
            </div>
            <div id="profile-thumbnail-container">
              <div
                class="profile-thumbnail"
                v-for="pic in partner.images"
                :key="pic.url"
                @click="currentPhoto = pic.url"
              >
                <img :src="pic.url" />
                <!-- Hover information for photo -->
                <div
                  class="tooltip-text"
                  v-if="
                    (pic.photographer || pic.copyright || pic.alt_text) &&
                    !lessThan974
                  "
                >
                  <div v-if="pic.photographer">
                    {{ $t("photograph") }}: {{ pic.photographer }}
                  </div>
                  <div v-if="pic.copyright">&#169; {{ pic.copyright }}</div>
                  <div v-if="pic.alt_text">{{ pic.alt_text }}</div>
                </div>
              </div>
            </div>
            <!-- Full-page lightbox for photo "slideshow" -->
            <div
              id="lightbox-container"
              v-if="showLightbox"
              @click="showLightbox = false"
            >
              <div id="lightbox">
                <img :src="currentPhoto" />
              </div>
              <div
                id="lightbox-left"
                class="lightbox-control"
                v-if="partner.images.length > 1"
              >
                <button @click.stop="slideshow('left')">
                  <font-awesome-icon icon="fa-solid fa-chevron-left" />
                </button>
              </div>
              <div
                id="lightbox-right"
                class="lightbox-control"
                v-if="partner.images.length > 1"
              >
                <button @click.stop="slideshow('right')">
                  <font-awesome-icon icon="fa-solid fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
          <!-- Placeholder for layout spacing when there is no photo information -->
          <div class="profile-photo-container" v-else></div>

          <!-- Contains sets of information to show based on selection from "links" -->
          <div id="profile-info-container">
            <div
              v-if="setShowingInfo === 'description'"
              v-html="text.description"
              :dir="rightToLeft ? 'rtl' : 'ltr'"
            ></div>
            <div v-if="setShowingInfo === 'contact'">
              <p id="address-header">Address(es)</p>
              <p v-html="text.address"></p>
              <p v-if="text.phone">T {{ text.phone }}</p>
              <!-- missing information from package? -->
              <!-- <p v-if="info.fax">F {{ info.fax }}</p> -->
              <!-- <p v-if="info.email">
                    <a :href="'mailto:' + info.email">{{ info.email }}</a>
                </p> -->
              <!-- <p v-if="info.title">{{ info.title }}</p> -->
              <p id="partner-url" v-if="partner.website">
                <a :href="sanitizedURL" target="_blank">{{
                  partner.website
                }}</a>
              </p>
              <div>
                <!-- Partner contact information (may be more than one person) -->
                <div class="contact-person">
                  <p
                    class="contact-title"
                    v-if="partner.contact_person_1.title"
                  >
                    {{ partner.contact_person_1.title }}
                  </p>
                  <p v-if="partner.contact_person_1.name">
                    {{ partner.contact_person_1.name }}
                  </p>
                  <!-- missing information? -->
                  <!-- <p v-if="person.phone">T {{ person.phone }}</p>
                    <p v-if="person.fax">F {{ person.fax }}</p>
                    <p v-if="person.mail">
                        <a :href="'mailto:' + person.mail">{{ person.mail }}</a>
                    </p> -->
                </div>
              </div>
            </div>
            <div id="partner-logo-container" v-if="setShowingInfo === 'logo'">
              <img
                class="logo"
                v-for="logo in partner.logos"
                :key="logo"
                :src="logo.url"
              />
            </div>
          </div>
        </div>

        <!-- Show label for map if there is map data available -->
        <!-- Actual container for map is below -->
        <!-- <p id="profile-map-label" v-if="showMap">Museum on Google Maps</p>
            <p id="profile-no-map" v-else></p> -->
      </div>
    </div>

    <!-- Contains the Google Map for Partner location -->
    <!-- <div id="partner-profile-map" v-if="showMap"></div> -->
  </div>

  <!-- Map -->
  <section v-if="mapEmbedUrl" class="content-section">
    <h2 class="content-section-heading">map placeholder</h2>
    <!-- <iframe class="map-frame" :src="mapEmbedUrl" loading="lazy" :title="$t('partner.map.onTheMap')" /> -->
    <iframe class="map-frame" :src="mapEmbedUrl" loading="lazy" />
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
// import { useI18n } from '@metanull/viewer-core'
import { useInventoryData } from "../composables/data.js";

const route = useRoute();
const router = useRouter();
// const { locale, t } = useI18n()
const {
  availableLangs,
  countryLabel,
  defaultLang,
  items,
  translations,
  translationsCache,
  loadTranslations,
  getTranslation,
  partners,
} = useInventoryData();

const partner = computed(
  () =>
    partners.value.find((p) => p.id === decodeURIComponent(route.params.id)) ??
    null,
);

// ── Content language (partner translations are loaded on demand, per-lang) ──
// Follows the global site locale; falls back to the dataset default when the
// locale has no partner translations.

const activeLang = defaultLang.value;
// watch(activeLang, lang => loadTranslations('partners', lang), { immediate: true })

// The partner's own curatorial text, in the active content language. Kept
// clear of `t`, which is this website's interface texts.
// const text = computed(() => tr('partners', partner.value?.id, activeLang.value))
const text = computed(() =>
  getTranslation(defaultLang, "partners", decodeURIComponent(route.params.id)),
);

const setShowingInfo = ref("description");
const currentPhoto = ref("");
const showLightbox = ref(false);
const rightToLeft = ref(false);
// const showMap = ref(true)

// ── Related items (View Objects / View Monuments) ────────────────────────

const relatedItems = computed(() => {
  if (!partner.value) return [];
  return items.value.filter((i) => i.partner_id === partner.value.id);
});

// const viewItemsLabel = computed(() =>
//   partner.value?.type === 'institution'
//     ? t('islamicart.action.viewMonuments')
//     : t('islamicart.action.viewObjects')
// )

// const partnerTypeLabel = computed(() =>
//   partner.value?.type === 'institution'
//     ? t('partner.info.typeInstitution')
//     : t('partner.info.typeMuseum')
// )

function viewItemsLink() {
  return {
    path: "/permanent-collection/results",
    query: { partner: partner.value.id },
  };
}

function setRightToLeft(lang) {
  if (activeLang === "ar") {
    this.rightToLeft = true;
  } else {
    this.rightToLeft = false;
  }
}

function slideshow(clicked) {
  let ssUrls = [];
  for (let i = 0; i < this.info.pictures.length; i++) {
    ssUrls.push(this.info.pictures[i].L);
  }
  let index = ssUrls.indexOf(this.currentPhoto);
  let newIndex;
  if (clicked === "right") {
    if (index === ssUrls.length - 1) {
      newIndex = 0;
    } else {
      newIndex = index + 1;
    }
  } else if (clicked === "left") {
    if (index === 0) {
      newIndex = ssUrls.length - 1;
    } else {
      newIndex = index - 1;
    }
  }
  this.currentPhoto = ssUrls[newIndex];
}

// ── Contact ────────────────────────────────────────────────────────────

const hasContactInfo = computed(
  () =>
    !!(
      text.value.address ||
      text.value.phone ||
      text.value.email ||
      text.value.website ||
      partner.value?.additional_urls?.length
    ),
);

function normalizeUrl(url) {
  return url.startsWith("http") ? url : `http://${url}`;
}

const contactPersons = computed(() => {
  if (!partner.value) return [];
  return [
    partner.value.contact_person_1,
    partner.value.contact_person_2,
  ].filter((cp) => cp && (cp.name || cp.title));
});

// ── Map (OpenStreetMap embed — no API key required) ───────────────────────

const mapEmbedUrl = computed(() => {
  if (partner.value?.type !== "museum") return null;
  const { latitude: lat, longitude: lon } = partner.value;
  if (lat == null || lon == null) return null;
  const delta = 0.01;
  const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
});

function imageCredit(img) {
  const parts = [];
  if (img.copyright) parts.push(`© ${img.copyright}`);
  if (img.photographer) parts.push(img.photographer);
  return parts.join(" — ");
}

function back() {
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push("/partners");
  }
}
</script>

<style>
@import "../assets/classes.css";
</style>

<style scoped>
#partner-profile-wrapper {
  width: 100%;
  background-color: white;
}

#profile-languages {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: var(--nav-alt-bg);
}
.profile-languages-button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: var(--text-light);
  font-size: 95%;
  padding: 4px 8px;
}
.profile-language-selected {
  background-color: var(--nav-bg);
}

#partner-profile-container {
  width: 100%;
  background-color: white;
  padding: 0 50px;
}

#back {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  padding: 30px 50px 0 0;
}
#back .fas {
  font-size: 75%;
  padding-right: 4px;
}
#back button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 2px;
  font-weight: bold;
}

.loader-container {
  min-height: 500px;
}

#partner-profile {
  padding-top: 20px;
}
#partner-name {
  font-size: 110%;
}
#partner-location {
  font-style: italic;
  font-weight: bold;
}

#partner-links-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 20px 0;
  font-size: 95%;
  color: var(--text-dark);
}
#partner-links-container a {
  text-decoration: none;
  color: var(--text-dark);
}
#partner-links-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 40%;
}
#partner-links {
  display: flex;
  align-items: center;
  justify-content: center;
}
.partner-links-background {
  background-color: var(--nav-bg);
  border-radius: 50px;
  padding: 2px 12px;
}
#partner-links button {
  border: none;
  background-color: var(--nav-bg);
  cursor: pointer;
  color: var(--text-dark);
}
.partner-links-divider {
  margin: 0 10px;
}
#partner-links .fas {
  font-size: 85%;
  padding-right: 5px;
}
#partner-objects {
  width: 60%;
  padding-left: 50px;
}
#partner-objects a {
  font-weight: bold;
  letter-spacing: 0.5px;
}

#profile-photo-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-photo-container {
  width: 40%;
}
.profile-photo {
  width: 100%;
  cursor: zoom-in;
}
.profile-photo :deep(.zoom-on-hover .normal) {
  object-fit: cover;
}
#profile-thumbnail-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.profile-thumbnail {
  height: 60px;
  width: 60px;
  position: relative;
  margin: 10px 10px 0 0;
  cursor: pointer;
}
.profile-thumbnail:hover .tooltip-text {
  visibility: visible;
}
.profile-thumbnail img {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.tooltip-text {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 60px;
  position: absolute;
  bottom: 0;
  left: 110%;
  background-color: rgba(var(--nav-alt-bg), 0.95);
  color: var(--text-light);
  font-size: 90%;
  text-align: center;
  white-space: nowrap;
  padding: 5px 10px;
  border-radius: 6px;
  visibility: hidden;
  pointer-events: none;
  z-index: 60;
}
.tooltip-text::after {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 100%;
  border-width: 5px;
  border-style: solid;
  border-color: transparent rgba(var(--nav-alt-bg), 0.95) transparent
    transparent;
}
#lightbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  background-color: rgba(black, 0.9);
}
#lightbox {
  height: 90%;
  width: 90%;
}
#lightbox img {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: contain;
}
.lightbox-control {
  position: absolute;
  font-size: 30px;
}
.lightbox-control button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
  height: 45px;
  width: 45px;
  border: 2px solid white;
  border-radius: 100%;
  color: white;
}
#lightbox-left {
  left: 10px;
}
#lightbox-right {
  right: 10px;
}

#profile-info-container {
  width: 60%;
  padding-left: 50px;
}
#profile-info-container a {
  color: var(--text-dark);
  text-decoration: none;
}
#profile-info-container a:hover {
  text-decoration: underline;
}
#address-header {
  font-weight: bold;
}
#partner-url {
  padding-top: 10px;
}
.contact-person {
  padding-top: 10px;
}
.contact-title {
  font-weight: bold;
}
#partner-logo-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
}
.logo {
  max-width: 100%;
  padding-bottom: 10px;
}

#profile-map-label {
  font-size: 110%;
  padding: 30px 0 20px 0;
}
#profile-no-map {
  margin-bottom: 100px;
}

#partner-profile-map {
  height: 50vh;
  max-height: 400px;
}

.map-frame {
  width: 100%;
  height: 380px;
  border: 1px solid var(--border);
}

/* IE-only */
@media only screen and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  #lightbox {
    position: relative;
  }
  #lightbox img {
    max-height: 100%;
    max-width: 100%;
    height: auto;
    width: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}

@media only screen and (max-width: 1199px) {
  #partner-name {
    font-size: 105%;
  }
  #partner-links {
    flex-direction: column;
    padding: 2px 20px;
  }
  #profile-map-label {
    font-size: 105%;
  }
}

@media only screen and (max-width: 974px) {
  .lightbox-control {
    font-size: 25px;
  }
  .lightbox-control button {
    height: 40px;
    width: 40px;
  }
}

@media only screen and (max-width: 724px) {
  #partner-links-container {
    flex-direction: column;
    align-items: flex-start;
  }
  #partner-links-wrapper {
    width: 100%;
  }
  #partner-links {
    flex-direction: row;
    padding: 2px 12px;
    margin-bottom: 20px;
  }
  #partner-objects {
    width: 100%;
    padding-left: 0;
  }
  #profile-photo-wrapper {
    flex-direction: column;
  }
  .profile-photo-container {
    width: 100%;
    margin-bottom: 30px;
  }
  #profile-info-container {
    width: 100%;
    padding-left: 0;
    margin-bottom: 30px;
  }
}

@media only screen and (max-width: 599px) {
  #partner-profile-container {
    padding: 0 30px;
  }
  .partner-links-background {
    border-radius: 5px;
  }
  #partner-links {
    flex-direction: column;
    padding: 5px 20px;
  }
  #partner-links div:first-child {
    margin-bottom: 10px;
  }
  #partner-objects a {
    padding: 2px 20px;
  }
}

@media only screen and (max-width: 399px) {
  #partner-links {
    padding: 5px 10px;
  }
  #partner-objects a {
    padding: 2px 10px;
  }
}
</style>
