let peopleCache = {};
let speciesCache = {};
let planetsCache = {};
let filmsCache = {};
let shipsCache = {};

function savePeopleCache( url, item ) {
    peopleCache[url] = item;
}
function getPeople( url, callback ) {
    return getCache( url, peopleCache, callback );
}

function getSpecies( url, callback ) {
    return getCache( url, speciesCache, callback );
}

function getPlanet( url, callback ) {
    return getCache( url, planetsCache, callback );
}

function getFilm( url, callback ) {
    return getCache( url, filmsCache, callback );
}

function getShip( url, callback ) {
    return getCache( url, shipsCache, callback );
}

/**
 * Helper function that all get-Cache functions use.
 * Does the actual work for them.
 * @param url URL to call.
 * @param cache Array to put the cache into.
 * @param callback function to call when completed, if available. Not required.
 * @returns {*} the cached JSON.
 */
function getCache( url, cache, callback ) {
    if ( url in cache ) {
        if ( callback !== undefined ) {
            callback(cache[url]);
        }
        return cache[url];
    }
    else {
        $.getJSON( url, {}, function(data) {
            cache[url] = data;
            if ( callback !== undefined ) {
                callback(data);
            }
        })
    }
}

// preload films
$.getJSON( "https://swapi.dev/api/films/", {}, function(data) {
    for ( let film in data.results ) {
        filmsCache[data.results[film].url] = data.results[film];
    }
});
