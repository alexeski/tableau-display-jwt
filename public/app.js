// Import Tableau components from the API
import {
  TableauViz,
  TableauEventType,
} from "https://dub01.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js";

// Initialize variables
let jwt;

document.addEventListener("DOMContentLoaded", go);

async function go() {
  let pod = "10ax"; // default value
  let site = "eskibeta2dev674998"; // default value
  let workbook = "SuperstoreDashboard"; // default value
  let view = "SuperstoreDashboard"; // default value

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("pod")) pod = urlParams.get("pod");
  if (urlParams.has("site")) site = urlParams.get("site");
  if (urlParams.has("workbook")) workbook = urlParams.get("workbook");
  if (urlParams.has("view")) view = urlParams.get("view");

  const wurl = `https://${pod}.online.tableau.com/t/${site}/views/${workbook}/${view}`;
  // Fetch JWT token from server
  try {
    const response = await fetch("/gimmeJWT");
    const data = await response.json();
    if (data.error) {
      document.getElementById("tableauViz").innerHTML = `<br><br>${data.error}`;
    } else {
      jwt = data.token;
      loadTableauViz(wurl, jwt);
    }
  } catch (error) {
    console.error("Error fetching JWT: ", error);
  }
}

function loadTableauViz(wurl, token) {
  // Create the TableauViz instance
  const tableauViz = new TableauViz();
  tableauViz.src = wurl;
  tableauViz.token = token;
  tableauViz.toolbar = "hidden";
  tableauViz.hideTabs = true;
  //   tableauViz.width = "100%";
  //   tableauViz.height = "100%";

  // Add event listeners for interactions
  tableauViz.addEventListener(TableauEventType.FirstInteractive, (event) => {
    const sheet = tableauViz.workbook.activeSheet;
    console.log("Sheet Name: ", sheet.name);
    console.log("Viz URL: ", tableauViz.src);
  });

  // Append the viz to the DOM
  document.getElementById("tableauViz").appendChild(tableauViz);
}
