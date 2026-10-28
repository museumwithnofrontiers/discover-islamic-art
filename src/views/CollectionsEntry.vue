<template>
  <div id="collection-search-container">
    <!-- Show loader if axios request has not completed yet -->
    <!-- <LoaderComponent v-if="!loaded" /> -->
    <!-- Once axios request is successful, display dropdowns -->
    <div id="dropdowns">
      <div id="dropdown-label">Filter by:</div>
      <!-- All select fields execute filtering upon selection -->
      <div id="select-container">
        <!-- Country options -->
        <!-- <select
          id="country-option"
          class="search-option"
          v-model="country"
          @change="goToResults('country', country)"
        >
          <option selected disabled value="">Select Country</option>
          <option
            v-for="country in countries"
            :key="country[0]"
            :value="country[0]"
          >
            {{ country[1] }}
          </option>
        </select> -->
        <!-- Dynasty options -->
         <select
          v-if="dynastiesList"
          id="dynasty-option"
          class="search-option"
          v-model="dynasty"
          @change="goToResults('dynasty', dynasty)"
        >
          <option selected disabled value="">Period / Dynasty</option>
          <option
            v-for="dynasty in dynastiesList"
            :key="dynasty.id"
            :value="dynasty.id"
            v-html="dynasty.name"
          ></option>
        </select>
        <!-- Partner options -->
        <select
          id="partner-option"
          class="search-option"
          v-model="partner"
          @change="goToResults('partner', partner)"
        >
          <option selected disabled value="">Partner</option>
          <option
            v-for="partner in partnersList"
            :key="partner.id"
            :value="partner.id"
            v-html="partner.name"
          ></option>
        </select>
        <!-- Date options -->
        <!-- Nested due to formatting side by side -->
        <!-- <div id="dates-container"> -->
          <!-- Start date options -->
          <!-- <select
            id="start-date-option"
            class="search-option"
            v-model="start"
            @change="goToResults('start', start)"
          >
            <option selected disabled value="">Start Date</option>
            <option v-for="date in years" :key="date[0]" :value="date[0]">
              {{ date[1] }}
            </option>
          </select> -->
          <!-- End date options -->
          <!-- <select
            id="end-date-option"
            class="search-option"
            v-model="end"
            @change="goToResults('end', end)"
          >
            <option selected disabled value="">End Date</option>
            <option v-for="date in years" :key="date[0]" :value="date[0]">
              {{ date[1] }}
            </option>
          </select> -->
        <!-- </div> -->
      </div>
    </div>

     <div id="description">
      <p>
        As a first approach, this might be the best choice to start exploring
        the <span class="italic">Discover Islamic Art</span> database. A range of
        filters allows you to choose what you want to see.
      </p>
      <div class="break"></div>

      <p>
        For research, you can use the <span class="bold">Search*</span> bar,
        located on the top right of the page. If you are interested in learning
        about contributions from a specific institution, the
        <router-link :to="{ path: '/partners' }" class="bold">Partner</router-link>
        section would be the best place to start. On the
        <router-link :to="{ path: '/timeline' }" class="bold">Timeline</router-link>
        you will find countries’ historical context information, while
        <a href="https://www.museumwnf.org/mycollection/my_welcome.php" class="bold">My Collection</a>
        lets you add any item from this project to your personal collection.
      </p>
      <div class="break"></div>

      <p>
        * Please be aware that the Search tool covers only the artefacts in this
        Gallery. If you wish to carry out a search in the overall MWNF Database,
        please click
        <a href="https://www.museumwnf.org/database_searchform.php" target="_blank">here</a>
        or go to the above-mentioned projects to search their databases.
      </p>
    </div>
  </div>
</template>



<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useInventoryData } from "../composables/data.js";
import LoaderComponent from "../components/LoaderComponent.vue";
// Contains functions for handling data for select fields
// import collection from "../mixins/collection.js";

const route = useRoute();
const {
  countries,
  partners,
  dynasties,
  projects,
  countryLabel,
  partnerLabel,
  dynastyLabel,
  defaultLang,
  translations,
  translationsCache,
  loadTranslations,
  getTranslation,
} = useInventoryData();

const partner = ref("");
const dynasty = ref("");

const partnersList = computed(() => {
  return partners.value
    .map(p => ({ id: p.id, name: partnerLabel(p.id) }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const dynastiesList = computed(() => {
  return dynasties.value
    .map(p => ({ id: p.id, name: dynastyLabel(p.id) }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

// export default {
//   name: "CollectionSearch",
//   components: {
//     LoaderComponent: LoaderComponent,
//   },
//   mixins: [collection],
//   data() {
//     return {
//       dxaFull: process.env.VUE_APP_DXA_FULL,
//       loaded: false,
//       countries: {},
//       types: {},
//       dynasties: {},
//       subjects: {},
//       materials: {},
//       years: {},
//       country: "",
//       type: "",
//       dynasty: "",
//       subject: "",
//       material: "",
//       start: "",
//       end: "",
//       urls: {
//         portal: process.env.VUE_APP_PORTAL_URL,
//         baroqueArt: process.env.VUE_APP_BAROQUE_ART_URL,
//         islamicArt: process.env.VUE_APP_ISLAMIC_ART_URL,
//         sharingHistory: process.env.VUE_APP_SHARING_HISTORY_URL,
//         galleries: process.env.VUE_APP_GALLERIES_URL,
//         images: process.env.VUE_APP_IMAGES_URL,
//       },
//       emails: {
//         contactUs: process.env.VUE_APP_CONTACT_US_EMAIL,
//       },
//     };
//   },
//   methods: {
//     // Use selected field to initiate "search", navigate to Results page
//     // Passes information to Collection Results for axios request
//     goToResults: function (type, selection) {
//       let query = { [`${type}`]: selection };
//       this.$router.push({ name: "collection-results", query: query });
//     },
//   },
//   mounted() {
//     this.loadCountries("").then(() => {
//       this.loaded = true;
//     });
//     this.loadTags("");
//     this.loadYears("");
//   },
// };
</script>

<style>
@import "../assets/classes.css";
</style>

<style scoped>
.break {
  padding-bottom: 15px;
}
.bold {
  font-weight: bold;
}
.italic {
  font-style: italic;
}

#collection-search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
}

.loader-container {
  width: 40%;
}

#dropdowns {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 40%;
  padding: 50px;
}
#dropdown-label {
  height: 35px;
  width: 100%;
  max-width: 300px;
  padding-bottom: 10px;
  font-size: 125%;
  font-weight: bold;
}
#select-container {
  width: 100%;
  max-width: 300px;
}
.search-option {
  height: 35px;
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
  padding: 5px;
}
#dates-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 300px;
}
#start-date-option {
  margin-right: 5px;
}
#end-date-option {
  margin-left: 5px;
}

#description {
  align-self: flex-start;
  width: 60%;
  padding: 50px 75px 50px 0;
  /*Align text with first drop-down filter*/
  margin-top: calc(35px + 10px);
}
#description a {
  color: var(--link);
  text-decoration: none;
}
#description a:hover {
  text-decoration: underline;
}

@media only screen and (max-width: 1199px) {
  #dropdowns {
    font-size: 96%;
  }
}

@media only screen and (max-width: 849px) {
  #collection-search-container {
    flex-direction: column;
  }
  .loader-container {
    min-height: 250px;
    width: 100%;
  }
  #dropdowns {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 50px;
  }
  #dropdown-label {
    max-width: 100%;
  }
  #select-container {
    max-width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 5px;
  }
  #description {
    align-self: center;
    width: 100%;
    padding: 0 50px 50px 50px;
    margin-top: 0;
  }
}

@media only screen and (max-width: 599px) {
  #dropdowns {
    padding: 30px;
  }
  #dropdown-label {
    font-size: 115%;
  }
  #description {
    padding: 0 30px 50px 30px;
  }
}

@media only screen and (max-width: 499px) {
  #select-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .search-option,
  #dates-container {
    max-width: none;
    width: 100%;
  }
}
</style>
