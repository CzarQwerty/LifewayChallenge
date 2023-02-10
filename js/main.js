let selectedSpecies = {};
let selectedFilms = {};
let selectedFilm = {};
let selectedShips = {};
let selectedShip = {};

/**
 * Called from selecting item in auto-complete.
 * @param item The item that was selected.
 */
function loadCharacter( item ) {
    // clear existing
    selectedSpecies = {};
    selectedFilms = {};
    selectedFilm = {};
    selectedShips = {};
    selectedShip = {};
    resetExtendedArea();
    savePeopleCache( item.url, item );
    selectCharacter( item );
}

/**
 * Finished loading the character screen.
 * @param item Item to load.
 */
function selectCharacter( item ) {
    $("#char-species").text("Unknown").unbind().removeClass("clickable");

    // catch because humans have no species right now
    if (item.species.length > 0 ) {
        getSpecies(item.species[0], fillSpecies);
    }
    $( "#character-result" ).show("fade",{},500);
    $("#char-name").text(item.name);
    $("#birth-year").text(item.birth_year);
    $("#eye-color").text(item.eye_color);
    $("#gender").text(item.gender);
    $("#hair-color").text(item.hair_color);
    $("#char-height").text(item.height + " cm / " + convertToFeet(item.height) );
    $("#char-mass").text(item.mass + " kg / " + convertToPounds( item.mass) + " lbs");
    $("#skin-color").text(item.skin_color);
    $("#char-home-world").text("");

    // load planet
    getPlanet(item.homeworld, fillCharHomeWorld);

    // load films
    $("#char-films").empty();
    // all films cached to make this quick
    selectedFilms = item.films;
    for ( let f in item.films ) {
        let film = getFilm(item.films[f]);
        $("#char-films").append("<div id='film-" + f + "' class='clickable'>" + film.title + "</div>");
        $("#film-" + f).click( loadFilm );
    }
    // load starships
    $("#char-ships").empty();
    selectedShips = item.starships;
    for ( let s in item.starships ) {
        getShip(item.starships[s],fillStarship);
    }
}

///////////////////////////////////////////
// Screen interactions
///////////////////////////////////////////

/**
 * Starship name clicked in UI.
 */
function loadStarship() {
    let id = this.id;
    id = id.replaceAll("ship-","");
    selectedShip = getShip(selectedShips[id]);
    resetExtendedArea();
    $("#ajax-area").load("pages/starship.html", loadExtendedArea);
}

/**
 * Film name clicked in UI.
 */
function loadFilm() {
    let id = this.id;
    id = id.replaceAll("film-","");
    selectedFilm = getFilm(selectedFilms[id]);
    resetExtendedArea();
    $("#ajax-area").load("pages/film.html", loadExtendedArea);
}

/**
 * Species name clicked in UI.
 */
function loadSpecies() {
    resetExtendedArea();
    $("#ajax-area").load("pages/species.html", loadExtendedArea);
}

/**
 * Close and reset the secondary div.
 */
function resetExtendedArea() {
    if ($("#extended-result").is(":visible")) {
        $("#extended-result").hide();
    }
    $( "#ajax-area" ).empty();
}

/**
 * Shows the secondary div when ready.
 */
function loadExtendedArea() {
    $("#extended-result").show("fold", 1000);
}

/**
 * Closes the Result div and clears the character text box.
 */
function closeResult() {
    resetExtendedArea();
    $("#character-result").hide("fade",500);
    $( "#characters" ).val("");
}

///////////////////////////////////////////
// AJAX Callbacks
///////////////////////////////////////////

/**
 * Callback from getShip.
 * To load the returned ship data.
 * @param item Starship json
 */
function fillStarship( item ) {
    let index = selectedShips.indexOf(item.url);
    $("#char-ships").append("<div id='ship-" + index + "' class='clickable'>" + item.name + "</div>");
    $("#ship-" + index).click( loadStarship );
}

/**
 * Callback from getSpecies.
 * Adds species name and makes it clickable.
 * @param item Species json
 */
function fillSpecies( item ) {
    $("#char-species").text(item.name).addClass("clickable");
    selectedSpecies = item;
    $("#char-species").click( loadSpecies );
}

/**
 * Callback from getPlanet.
 * Fills in the Planet name.
 * @param item Planet json
 */
function fillCharHomeWorld( item ) {
    $("#char-home-world").text(item.name);
}

//////////////////////////////////////////////
// Helper Functions
//////////////////////////////////////////////

/**
 * Converts meters to feet and inches.
 * @param height Meters
 * @returns {string} Feet and inches
 */
function convertToFeet( height ) {
    let inches = Math.round(parseInt(height) / 2.54);
    let ft = Math.floor(inches / 12);
    inches -= ft * 12;
    let result = ft + " Ft, " + inches + " in";
    return result;
}

/**
 * Converts Kilograms to pounds.
 * @param weight Kilograms
 * @returns {number} pounds, rounded to whole number.
 */
function convertToPounds( weight ) {
    return Math.round(parseInt(weight) * 2.205 );
}

