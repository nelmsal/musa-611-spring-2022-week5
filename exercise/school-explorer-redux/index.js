/* global schools */

const schoolMap = L.map('school-map').setView([39.95303901388685, -75.16341794003617], 13);
const schoolLayer = L.layerGroup().addTo(schoolMap);

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png',
}).addTo(schoolMap);

const schoolList = document.querySelector('#school-list');
const gradeLevelSelect = document.querySelector('#grade-level-select');
const zipCodeSelect = document.querySelector('#zip-code-select');

/* ====================

# Exercise: School Explorer (redux)

==================== */

let showSchoolInfo = (school, marker) => {
  const ulcs = school['UCLS Code'];
  const response = fetch('../../data/demographics/${ulcs}.json');
}

/* PASTE YOUR WEEK4 EXERCISE CODE HERE */

let showPopup = (marker, school) => {
  let dataFileName = `../../data/demographics/${school['ULCS Code']}.json`;

  let schoolDemographics = fetch(dataFileName)
    .then(response => response.json())
    .then(
      data => {data}
    );


  let schoolPub = school['Publication Name'];
  let pctm = schoolDemographics['MalePCT'];
  let pctf = schoolDemographics['FemalePCT'];

  let popInfo = `<h3>${schoolPub}</h3>
    <ul>
      <li>Percent Male: ${pctm}</li>
      <li>Percent Female: ${pctf}</li>
    </ul>`;
  marker.bindPopup(popInfo).openPopup();
};

let updateSchoolMarkers = (schoolsToShow) => {
  schoolLayer.clearLayers();
  schoolsToShow.forEach(function (school) {
      const name = school['Publication Name'];
      const [lat, lng] = school['GPS Location'].split(',');
      const marker = L.marker([parseFloat(lat), parseFloat(lng)]).bindTooltip(name);

      schoolLayer.addLayer(marker);

      marker.addEventListener('click', () => {
        showPopup(marker, school);
      });

    });
};

let updateSchoolList = (schoolsToShow) => {
  let school_arr = []
  schoolsToShow.forEach(school => {
    school_arr.push(school['Publication Name']);
  })

  school_arr.sort();
  let schoolList_container = document.getElementById('school-list');
  school_arr.forEach(name => {
    schoolList_container.appendChild(htmlToElement(`<li>${name}</li>`));
  });
};

let initializeZipCodeChoices = () => {
  let zip_arr = []
  schools.forEach(school => {
    let zip = school['Zip Code'].split('-',1)[0];
    if (!zip_arr.includes(zip)) {
      zip_arr.push(zip)
    };
  })
  zip_arr.sort();
  let zipContainer = document.getElementById('zip-code-select');
  zip_arr.forEach(zip => {
    zipContainer.appendChild(htmlToElement(`<option>${zip}</option>`));
  });
};

let filteredSchools = () => {
  let current_zip = zipCodeSelect.value
  let current_grade = gradeLevelSelect.value
  console.log(current_grade)


  let isGrade = (school) => {
    if (current_grade === '') {
      return school
    }
    else if ( school[current_grade] === '1') {
      return school
    }
  };
  let isZip = (school) => {
    if (current_zip === '') {
      return school
    } else if (school['Zip Code'].split('-')[0] === current_zip) {
      return school
    }
  };

  return schools.filter(isZip).filter(isGrade);
};


/*

No need to edit anything below this line ... though feel free.

*/

// The handleSelectChange function is an event listener that will be used to
// update the displayed schools when one of the select filters is changed.
let handleSelectChange = () => {
  const schoolsToShow = filteredSchools() || [];
  updateSchoolMarkers(schoolsToShow);
  updateSchoolList(schoolsToShow);
};

gradeLevelSelect.addEventListener('change', handleSelectChange);
zipCodeSelect.addEventListener('change', handleSelectChange);

// The code below will be run when this script first loads. Think of it as the
// initialization step for the web page.
initializeZipCodeChoices();
updateSchoolMarkers(schools);
updateSchoolList(schools);
