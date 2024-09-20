// Initialize variables
let jwt;
let tableauViz1, tableauViz2;
let refreshSeconds = 10; // Default refresh time in seconds

document.addEventListener("DOMContentLoaded", go);

async function go() {
  let pod = "10ax.online.tableau.com"; // default value
  let site = "eskibeta2dev674998"; // default value
  let workbook = "Real-timerefresh"; // default value
  let view = "dash"; // default value

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("pod")) pod = urlParams.get("pod");
  if (urlParams.has("site")) site = urlParams.get("site");
  if (urlParams.has("workbook")) workbook = urlParams.get("workbook");
  if (urlParams.has("view")) view = urlParams.get("view");

  // Check for the refreshTime parameter and validate it
  if (urlParams.has("refreshSeconds")) {
    const refreshTimeParam = parseInt(urlParams.get("refreshSeconds"), 10);
    // Ensure that refreshTime is a number and at least 5 seconds
    if (!isNaN(refreshTimeParam) && refreshTimeParam >= 5) {
      refreshSeconds = refreshTimeParam;
    } else {
      console.warn(
        "Invalid refreshTime parameter. Using default value of 10 seconds."
      );
    }
  }

  // Dynamically construct the URL for Tableau API based on the 'pod'
  const tableauApiUrl = `https://${pod}/javascripts/api/tableau.embedding.3.latest.min.js`;

  try {
    // Dynamically import the Tableau API
    const { TableauViz, TableauEventType } = await import(tableauApiUrl);

    const wurl = `https://${pod}/t/${site}/views/${workbook}/${view}`;
    const wurl2 = `https://${pod}/t/${site}/views/${workbook}/${view}`; // Second view URL (if needed, can be customized)

    // Fetch JWT token from server
    try {
      const response = await fetch("/gimmeJWT");
      const data = await response.json();
      if (data.error) {
        document.getElementById(
          "tableauViz1"
        ).innerHTML = `<br><br>${data.error}`;
        document.getElementById(
          "tableauViz2"
        ).innerHTML = `<br><br>${data.error}`;
      } else {
        jwt = data.token;
        loadTableauViz(TableauViz, TableauEventType, wurl, wurl2, jwt);
      }
    } catch (error) {
      console.error("Error fetching JWT: ", error);
    }
  } catch (error) {
    console.error("Failed to load Tableau API:", error);
  }
}

function loadTableauViz(TableauViz, TableauEventType, wurl, wurl2, token) {
  // Create the first TableauViz instance
  tableauViz1 = new TableauViz();
  tableauViz1.src = wurl;
  tableauViz1.token = token;
  tableauViz1.toolbar = "hidden";
  tableauViz1.hideTabs = true;
  document.getElementById("tableauViz1").appendChild(tableauViz1);

  // Listen for the first interactive event to start the timer
  tableauViz1.addEventListener(
    TableauEventType.FirstInteractive,
    handleFirstInteractive
  );

  // Create the second TableauViz instance (but don’t start the timer yet)
  tableauViz2 = new TableauViz();
  tableauViz2.src = wurl2;
  tableauViz2.token = token;
  tableauViz2.toolbar = "hidden";
  tableauViz2.hideTabs = true;
  document.getElementById("tableauViz2").appendChild(tableauViz2);

  // Set initial visibility
  document.getElementById("tableauViz1").style.zIndex = 1;
  document.getElementById("tableauViz2").style.zIndex = -1;
}

// Function to handle the FirstInteractive event
function handleFirstInteractive() {
  console.log(
    `First viz is fully interactive, starting the ${refreshSeconds} sec timer...`
  );
  // Start the timed switch after the first viz is fully interactive
  let intervalSeconds = refreshSeconds * 1000;
  setTimeout(function () {
    switchViz(2);
  }, intervalSeconds);
}

async function switchViz(which) {
  let nextViz = which === 1 ? 2 : 1;
  let intervalSeconds = refreshSeconds * 1000;

  // Get the TableauViz instance currently in the background
  const hiddenViz = nextViz === 1 ? tableauViz1 : tableauViz2;

  // Refresh the hidden viz data before switching
  try {
    console.log(`Refreshing viz ${nextViz} in the background`);
    await hiddenViz.refreshDataAsync(); // Await the completion of the refreshDataAsync method
    console.log(`Refresh completed for viz ${nextViz}`);

    // Hide the current viz
    document.getElementById(`tableauViz${nextViz}`).style.zIndex = -1;

    // Show the new viz
    document.getElementById(`tableauViz${which}`).style.zIndex = 1;

    console.log(`Switched to viz ${which}`);

    // Schedule the next switch
    setTimeout(function () {
      switchViz(nextViz);
    }, intervalSeconds);
  } catch (error) {
    console.error(`Error during refresh of viz ${nextViz}:`, error);
  }
}
