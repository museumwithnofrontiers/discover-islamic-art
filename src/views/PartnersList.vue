<template>
  <div id="partners-container">
    <div id="partners-options-container">
      <div id="partners-back">
        <button @click="$router.go(-1)">
          <font-awesome-icon :icon="['fas', 'reply']" />Back
        </button>
      </div>
      <!-- Link to sort in [reverse] alphabetical order -->
      <div id="partners-order">
        <button @click="changeCountryOrder()">
          Click here to sort Countries from
          <span v-if="countryOrder === 'alpha'">Z - A</span>
          <span v-else>A - Z</span>
        </button>
      </div>
    </div>

    <div id="partners-list-container">
      <div id="partners-list-description">
        <!-- <p>If you are interested in learning about the contribution from a specific institution,
        this page might be the best place to start.
        <span v-if="dxaFull !== 'Partners'">The list distinguishes between Partners that have contributed specifically to
        <span class="italic">{{ dxaFull }}</span>,
        and Partners that are represented by {{ dxaMaterial }}-related material contributed to other MWNF projects.
        For this reason, some Partners are listed twice or more.</span>
      </p> -->
        <!-- <p v-html="$i18n.t('galleryPartners')"></p> -->
        <p>
          If you are interested in learning about the contribution from a
          specific institution, this page might be the best place to start.
        </p>
      </div>

      <!-- <LoaderComponent v-if="!loaded" /> -->
      <div id="partners-list-wrapper">
        <div
          class="partners-list"
          v-for="(country, countryIndex) in groupedByCountry"
          :key="country.name"
        >
          <div class="partners-country">{{ country.name }}</div>
          <div class="partner-container">
            <div
              class="partner"
              v-for="(partner, partnerIndex) in country.main"
              :key="partner.id"
            >
              <div class="partner-text-links-container">
                <div class="partner-name">
                  <router-link
                    class="partner-profile"
                    :to="{
                      name: 'partner-profile',
                      params: {
                        id: partner.id,
                      },
                    }"
                  >
                    <p class="partner-profile">
                      {{ partnerLabel(partner.id) }}
                    </p>
                  </router-link>
                </div>
                <div
                  class="partner-project"
                  :class="setBackgroundColorByProject(partner.project_ids[0])"
                >
                  {{ projectTitle(partner.project_ids[0]) }}
                  <span class="partner-status" v-if="partner.level === 'partner'">
                    Partner
                  </span>
                  <span class="partner-status" v-else> Affiliate</span>
                </div>
                <div class="partner-links">
                  <router-link
                    class="partner-profile"
                    :to="{
                      name: 'partner-profile',
                      params: {
                        id: partner.id,
                      },
                    }">
                    Read more
                  </router-link>
                  <!-- <div class="partner-link-divider" v-if="partner.hasObjects"> -->
                  <div class="partner-link-divider">|</div>
                  <!-- <router-link
                    v-if="partner.hasObjects"
                    class="partner-objects"
                    :to="{
                      name: 'partner-objects',
                      params: {
                        database: partner.projectId,
                        country: partner.countryId,
                        id: partner.partnerId,
                        page: 1,
                      },
                    }"
                    > -->
                  View objects
                  <!-- </router-link
                  > -->
                </div>
              </div>
              <div class="partner-logo" v-if="partner.logos[0]">
                <img :src="partner.logos[0].url" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useInventoryData } from "../composables/data.js";
import { setBackgroundColorByProject } from "../composables/utilities.js";

const route = useRoute();
const { partners, countryLabel, partnerLabel } = useInventoryData();

const countryOrder = ref("alpha");
const changeCountryOrder = () => {
  countryOrder.value = countryOrder.value === "alpha" ? "reverse" : "alpha";
};

const groupedByCountry = computed(() => {
  const countries = new Map();
  for (const p of partners.value) {
    const key = p.country_id ?? "";
    if (!countries.has(key)) countries.set(key, { main: [], associated: [] });
    const bucket = countries.get(key);
    bucket.main.push(p);
  }

  return [...countries.entries()]
    .map(([countryId, group]) => ({
      countryId,
      name: countryId ? countryLabel(countryId) : "Other",
      main: group.main.sort((a, b) =>
        partnerLabel(a.id).localeCompare(partnerLabel(b.id)),
      ),
      associated: group.associated.sort((a, b) =>
        partnerLabel(a.id).localeCompare(partnerLabel(b.id)),
      ),
    }))
    .sort((a, b) => {
      if (countryOrder.value === "alpha") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
});

// reusable?
function projectTitle(code) {
  switch (code) {
    case "ISL":
      return "Discover Islamic Art";
    case "EPM":
      return "Explore Islamic Art Collections";
    default:
      return "";
  }
}
</script>

<style>
@import "../assets/classes.css";
</style>

<style scoped>
#partners-container {
  width: 100%;
  background-color: white;
  padding: 0 50px;
}

#partners-options-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
#partners-back,
#partners-order {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  padding-top: 30px;
}
#partners-back .fas {
  font-size: 75%;
  padding-right: 4px;
}
#partners-back button,
#partners-order button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 2px;
  font-weight: bold;
}

#partners-list-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

#partners-list-description {
  width: 50%;
  padding-top: 30px;
}
.italic {
  font-style: italic;
}

.loader-container {
  min-height: 400px;
}

#partners-list-wrapper {
  width: 50%;
  padding: 30px 0 50px 0;
}
.partners-list {
  width: 100%;
  margin-bottom: 30px;
}
.partners-country {
  font-size: 160%;
  font-weight: bold;
  background-color: var(--page-bg);
  padding: 5px 10px;
}
.partner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.partner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border);
  padding: 30px 10px;
}
/*.partnerBorder {
  border-bottom: 1px solid var(--border);
}*/
.partner-container .partner:nth-last-child(1 of .partner) {
  border-bottom: none;
}
.partner a {
  text-decoration: none;
  color: black;
  cursor: pointer;
}
.partner-text-links-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100px;
  width: 100%;
}
.partner-name {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: flex-start;
  width: 100%;
}
.partner-name:hover {
  text-decoration: underline;
}
.partner-name p {
  font-size: 120%;
  font-weight: bold;
}
.partner-name p span {
  font-weight: normal;
}
.partner-project {
  font-size: 90%;
  font-weight: bold;
  font-style: italic;
  border-radius: 10px;
  padding: 0 10px;
}
.partner-status {
  font-style: normal;
}
.partner-links {
  display: flex;
  align-items: center;
  justify-content: center;
}
.partner-link-divider {
  padding: 0 8px;
}
.partner-logo {
  height: 100px;
  min-width: 100px;
  max-width: 150px;
}
.partner-logo img {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: contain;
}

/* IE-only */
@media only screen and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .partner-logo {
    position: relative;
    height: 100px;
    width: 400px;
  }
  .partner-logo img {
    max-height: 100%;
    max-width: 100%;
    height: auto;
    width: auto;
    position: absolute;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}

@media only screen and (max-width: 1199px) {
  #partners-list-description {
    width: 70%;
  }
  #partners-list-wrapper {
    width: 70%;
  }
  .partners-country {
    font-size: 150%;
  }
  .partner-name p {
    font-size: 110%;
  }
}

@media only screen and (max-width: 974px) {
  #partners-list-description {
    width: 80%;
  }
  #partners-list-wrapper {
    width: 80%;
  }
  .partners-list {
    margin-bottom: 15px;
  }
}

@media only screen and (max-width: 849px) {
  #partners-list-description {
    width: 88%;
  }
  #partners-list-wrapper {
    width: 88%;
  }
  .partners-country {
    font-size: 130%;
  }
  .partner-name p {
    font-size: 105%;
  }
}

@media only screen and (max-width: 724px) {
  #partners-list-description {
    width: 100%;
  }
  #partners-list-wrapper {
    width: 100%;
  }
  .partners-country {
    font-size: 120%;
  }
  .partner-name p {
    font-size: 100%;
  }
}

@media only screen and (max-width: 599px) {
  #partners-container {
    padding: 0 30px;
  }
  #partners-list-wrapper {
    padding-bottom: 30px;
  }
}

@media only screen and (max-width: 499px) {
  .partner {
    padding: 18px 10px;
  }
  .partner-text-links-container {
    height: 125px;
  }
  .partner-project {
    border-radius: 0;
    padding: 5px;
  }
  .partner-logo {
    height: 125px;
    max-width: 100px;
    margin-left: 5px;
  }
}

/* IE-only */
@media only screen and (-ms-high-contrast: none) and (max-width: 499px),
  (-ms-high-contrast: active) and (max-width: 499px) {
  .partner-logo {
    height: 125px;
    width: 80px;
  }
}

@media only screen and (max-width: 399px) {
  #partners-options-container {
    flex-direction: column;
    align-items: flex-start;
  }
  #partners-order {
    height: auto;
    padding-top: 20px;
  }
  #partners-order button {
    text-align: left;
  }
  #partners-list-description {
    padding-top: 20px;
  }
  .partner {
    flex-direction: column-reverse;
    width: 100%;
  }
  .partner-text-links-container {
    margin-top: 10px;
    height: auto;
  }
  .partner-text-links-container > div {
    margin-bottom: 8px;
  }
  .partner-logo {
    height: 90px;
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    border: 1px solid var(--page-bg);
  }
}

/* IE-only */
@media only screen and (-ms-high-contrast: none) and (max-width: 399px),
  (-ms-high-contrast: active) and (max-width: 399px) {
  .partner-logo {
    height: 90px;
    border: 1px solid var(--page-bg);
  }
  .partner-logo img {
    top: 0;
    left: 0;
  }
}
</style>
