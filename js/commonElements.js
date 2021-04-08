"use strict";

// ==============
// HEAD STUFF
// Here's where you add the <link>s that are common to all pages in the website:
// the link for style.css and those to get the font from Google

// FYLL_I_HÄR_RÄTT_KOD
let cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", "css/style.css");

let fontLink = document.createElement("link");
fontLink.setAttribute("rel", "stylesheet");
fontLink.setAttribute("href", "https://fonts.googleapis.com/css2?family=Abel&display=swap");
document.head.append(cssLink, fontLink);
// Header
// So it looks like in the video
// FYLL_I_HÄR_RÄTT_KOD
let DOMheader = document.createElement("header");
DOMheader.innerHTML = "<h3 id='header-title'>MLADOK - FRIA UNIVERSITETET - IN VINO VERITAS</h3>";
// Nav
// So it looks like in the video
// You MUST use the code here, you are not allowed to create the nav-items one by one
// or to use other methods thann the one created here (isThisTheCurrentPage())
const NAV_HELPER = {
  items: [
    {
      title: "Home",
      href: "index.html",
    },
    {
      title: "Students",
      href: "students.html",
    },
    {
      title: "Courses",
      href: "courses.html",
    },
  ],
  isThisItemForCurrentPage(href) {
    let url = window.location.href;
    return url.includes(href);
  },
};
let DOMnav = document.createElement("nav");
NAV_HELPER.items.forEach((item) => {
  let navItem = document.createElement("a");
  navItem.setAttribute("href", item.href);
  navItem.textContent = item.title;
  NAV_HELPER.isThisItemForCurrentPage(item.href)
    ? navItem.classList.add("selected")
    : navItem.classList.remove("selected");
  // Current page?
  // FYLL_I_HÄR_RÄTT_KOD.

  //OBS: Notera att navItem som representerar
  // sidan som användaren är på ser annorlunda ut och har ingen href (se video).

  DOMnav.append(navItem);
});

// Main
// Empty for the time being. Will be filled by other js-files
let DOMmain = document.createElement("main");

// Footer
// As in the video
let DOMfooter = document.createElement("footer");
DOMfooter.innerHTML = `
<h4 class="footer-text">Democratic Republic of PFW21</h4>
<h4 class="footer-text">Niagara Malmö</h4>
`;

// Använd denna instruktion för att lägga till alla element till body
document.querySelector("body").append(DOMheader, DOMnav, DOMmain, DOMfooter);

// ======
// FILTER
/*

Tänk på det: Båda flikar (Students och Courses) är i princip exakt likadana:
1) De innehåller ett input fält som bestämmer vad som ska filtreras
2) De söker igenom en array av objekt med utgångspunkt i en av objektens nycklar
        array COURSES (nyckel: "title")
        array STUDENTS (nyckel: "lastName")
3) De presenterar ett DOM-element för varje element i den filtrerade arrayen

Vi skapar därför:
1) En funktion DOMFilter som:
    1) Tar emot dessa argument:
        a) Arrayen som ska filteras
        b) Stringar som berättar:
            b1) vilken nyckel som ska filtreras efter (title eller lastName)
            b2) Vad som ska stå så att användaren förstår hur det fungerar (se video)
        c) Funktionen som ska anropas för att skapa DOM-elementen. Det kommer att
           vara en funktion för Students och en anna för Courses

    2) Returnerar DOM-elementet för filtret så att course.js och student.js kan appenda det i main.
       DOM-elementet har följande element inuti:
        a) <label>, som informerar för användaren hur filtret fungerar
        b) <input>, där användaren skriver strängen vi använder för att filtrera Arrayen  
            b1) <input> ska ha en eventListener för "keyup" så att listan
                av Students eller Courses uppdateras vid varje tangent-tryckning


*/

function DOMFilter(data) {
  let { baseArray, filterKey, filterLabelName, filterLabelKey, DOMCreator } = data;
  let container = document.createElement("div");
  container.classList.add("filter");
  container.innerHTML = `
        <label>${data.filterLabelName}</label>
        <input type="text" placeholder="case insensitive">
    `;

  // Event Keyup on input
  let input = container.querySelector("input");
  input.addEventListener("keyup", function () {
    clear();
    data.filterLabelKey = this.value.toUpperCase();
    if (this.value) data.DOMCreator();
  });

  return container;
}
function clear() {
  document.querySelector(".listContainer").innerHTML = " ";
}
