(async function () {
  /****************************** Starting Dropdown Menu ******************************************/
    document.querySelector('.dropdown-btn').addEventListener('click', () => {
      const menu = document.querySelector('.dropdown-content');
      menu.style.display = (menu.style.display === "block") ? "none" : "block";
    });

    document.querySelectorAll('.dropdown-content a').forEach(link => {
      link.addEventListener('click', () => {
        document.querySelector('.dropdown-content').style.display = "none";
      });
    });
  /****************************** Javascript Data Munging ******************************************/
  const DEFAULT_SAMPLE_SIZE = 100;
  const prettyLabel = s => s.charAt(0).toUpperCase() + s.slice(1);

  const corrText = await fetch("corr10.csv").then(r => r.text());
  const songsText = await fetch("song.csv").then(r => r.text());
  const explicitText = await fetch("explicit.csv").then(r => r.text());
  const nonExplicitText = await fetch("non_explicit.csv").then(r => r.text());

  const corrRows = corrText.trim().split(/\r?\n/).map(r => r.split(","));
  const originalLabels = corrRows[0].slice(1);
  const prettyLabels = originalLabels.map(prettyLabel);

  const labelMap = Object.fromEntries(
    originalLabels.map((raw, i) => [prettyLabels[i], raw])
  );

  const heatData = corrRows.slice(1).flatMap((row, i) => {
    const prettyRowLabel = prettyLabel(row[0]);
    return row.slice(1).map((v, j) => ({
      col1: prettyRowLabel,
      col2: prettyLabels[j],
      correlation: v === "" ? null : Number(v)
    }));
  });

  const parsedSongs = Papa.parse(songsText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });

  const parsedExplicit = Papa.parse(explicitText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });
  console.log(parsedExplicit)

  const parsedNonExplicit = Papa.parse(nonExplicitText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });

  const songsData = parsedSongs.data;
  const explicitData = parsedExplicit.data;
  const nonExplicitData = parsedNonExplicit.data;

  /************************************** First Visualization: Popularity Correlation Bar Chart ******************************************/
  var popularity_correlation_chart = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    description: 'Bar graph visualizing what metrics best correlate with popularity -- by genre',
    title: '',
    data: { url: 'popularity_correlation.csv' },
    width: 'container',
    height: 'container',
    params: [{
      name: 'genreParam',
      value: 'All',
      bind: {
        input: "select",
        name: 'Select Genre:   ',
        options: [
          'All',
          'acoustic',
          'afrobeat',
          'alt-rock',
          'alternative', 
          'ambient',
          'anime',
          'black-metal',
          'bluegrass',
          'blues',
          'brazil',
          'breakbeat',
          'british',
          'cantopop',
          'chicago-house',
          'children',
          'chill',
          'classical',
          'club',
          'comedy',
          'country',
          'dance',
          'dancehall',
          'death-metal',
          'deep-house',
          'detroit-techno',
          'disco',
          'disney',
          'drum-and-bass',
          'dub',
          'dubstep',
          'edm',
          'electro',
          'electronic',
          'emo',
          'folk',
          'forro',
          'french',
          'funk',
          'garage',
          'german',
          'gospel',
          'goth',
          'grindcore',
          'groove',
          'grunge',
          'guitar',
          'happy',
          'hard-rock',
          'hardcore',
          'hardstyle',
          'heavy-metal',
          'hip-hop',
          'honky-tonk',
          'house',
          'idm',
          'indian',
          'indie',
          'indie-pop',
          'industrial',
          'iranian',
          'j-dance',
          'j-idol',
          'j-pop',
          'j-rock',
          'jazz',
          'k-pop',
          'kids',
          'latin',
          'latino',
          'malay',
          'mandopop',
          'metal',
          'metalcore',
          'minimal-techno',
          'mpb',
          'new-age',
          'opera',
          'pagode',
          'party',
          'piano',
          'pop',
          'pop-film',
          'power-pop',
          'progressive-house',
          'psych-rock',
          'punk',
          'punk-rock',
          'r-n-b',
          'reggae',
          'reggaeton',
          'rock',
          'rock-n-roll',
          'rockabilly',
          'romance',
          'sad',
          'salsa',
          'samba',
          'sertanejo',
          'show-tunes',
          'singer-songwriter',
          'ska',
          'sleep',
          'songwriter',
          'soul',
          'spanish',
          'study',
          'swedish',
          'synth-pop',
          'tango',
          'techno',
          'trance',
          'trip-hop',
          'turkish',
          'world-music'

        ]
      }
    }],
    transform: [{ filter: 'datum.Genre === genreParam' }],
    mark: { type: 'bar', stroke: "black", strokeWidth: '1px' },
    encoding: {
      x: {
        field: 'Correlation',
        type: 'quantitative',
        axis: { title: 'Correlation Coefficient' },
        scale: { domain: [-1.0, 1.0] }
      },
      y: {
        field: 'Metric',
        type: 'nominal',
        sort: { op: 'mean', field: 'Correlation', order: 'descending' }
      },
      color: {
        field: "Correlation",
        type: "quantitative",
        scale: { domain: [-1, 0, 1], range: ["#b2182b", "#f7f7f7", "#2166ac"] },
      },
      tooltip: [
        { field: 'Metric' },
        { field: 'Correlation' },
        { field: 'Genre' }
      ]
    }
  };

  vegaEmbed('#popularity_correlation_chart', popularity_correlation_chart);
  /************************************** Second Visualization: Radar Chart By Song/Artist ******************************************/

  const dropdownValuesTracks = ["Unholy (feat. Kim Petras)",
    "Quevedo: Bzrp Music Sessions, Vol. 52",
    "I\'m Good (Blue)",
    "La Bachata",
    "Me Porto Bonito",
    "Efecto",
    "I Ain\'t Worried",
    "Under The Influence",
    "Ojitos Lindos",
    "As It Was",
    "Moscow Mule",
    "Glimpse of Us",
    "Sweater Weather",
    "Neverita",
    "Another Love",
    "CUFF IT",
    "PROVENZA",
    "I Wanna Be Yours",
    "Left and Right (Feat. Jung Kook of BTS)",
    "Calm Down (with Selena Gomez)",
    "Super Freaky Girl",
    "LOKERA",
    "Tarot",
    "Caile",
    "Jimmy Cooks (feat. 21 Savage)",
    "Blinding Lights",
    "La Corriente",
    "Running Up That Hill (A Deal With God)",
    "Ferrari",
    "Sex, Drugs, Etc.",
    "Vegas (From the Original Motion Picture Soundtrack ELVIS)",
    "Party",
    "Te Felicito",
    "Atlantis",
    "MIDDLE OF THE NIGHT",
    "Dandelions",
    "I Was Never There",
    "Starboy",
    "Until I Found You",
    "One Kiss (with Dua Lipa)",
    "Hold Me Closer",
    "Save Your Tears",
    "LA INOCENTE",
    "Bones",
    "Something in the Orange",
    "About Damn Time",
    "BILLIE EILISH.",
    "I Love You So",
    "lovely (with Khalid)",
    "STAY (with Justin Bieber)",
    "Gangsta\'s Paradise",
    "Watermelon Sugar",
    "WAIT FOR U (feat. Drake & Tems)",
    "Call Out My Name",
    "505",
    "Heat Waves",
    "Mary On A Cross",
    "Do I Wanna Know?",
    "The Hills",
    "Happier Than Ever",
    "Where Are You Now",
    "drivers license",
    "After LIKE",
    "Believer",
    "Bad Habits",
    "La Llevo Al Cielo (Ft. Ã‘engo Flow)",
    "Evergreen (You Didnâ€™t Deserve Me At All)",
    "No Role Modelz",
    "I'm Not The Only One",
    "BABY OTAKU",
    "Without Me",
    "Die For You",
    "Ghost",
    "FEARLESS",
    "Feel Special",
    "Shake It Off"
  ];

  function autocompleteTrack(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          b.addEventListener("click", function (e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            updateChartTrack();
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });


    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) { currentFocus++; addActive(x); }
      else if (e.keyCode == 38) { currentFocus--; addActive(x); }
      else if (e.keyCode == 13) { e.preventDefault(); if (currentFocus > -1) if (x) x[currentFocus].click(); }
    });
    function addActive(x) { if (!x) return false; removeActive(x); if (currentFocus >= x.length) currentFocus = 0; if (currentFocus < 0) currentFocus = x.length - 1; x[currentFocus].classList.add("autocomplete-active"); }
    function removeActive(x) { for (var i = 0; i < x.length; i++) x[i].classList.remove("autocomplete-active"); }
    function closeAllLists(elmnt) { var x = document.getElementsByClassName("autocomplete-items"); for (var i = 0; i < x.length; i++) if (elmnt != x[i] && elmnt != inp) x[i].parentNode.removeChild(x[i]); }
    document.addEventListener("click", function (e) { closeAllLists(e.target); });
  }

  autocompleteTrack(document.getElementById("dropdownInputTrack"), dropdownValuesTracks);

  var song_radar_chart = {
    "$schema": "https://vega.github.io/schema/vega/v6.json",
    "description": "Radar chart for a specific song from CSV",
    "width": 500,
    "height": 500,
    "padding": { "top": 75, "left": 50, "right": 200, "bottom": 100 },
    "autosize": { "type": "none", "contains": "padding" },
    "signals": [
      { "name": "radius", "update": "width / 2" },
      { "name": "selectedTrack", "value": dropdownValuesTracks[0] } // default track
    ],
    "data": [
      {
        "name": "table",
        "url": "clean_dataset.csv",
        "format": { "type": "csv" },
        "transform": [
          { "type": "filter", "expr": "datum.track_name === selectedTrack" },
          { "type": "window", "sort": [{ "field": "track_name", "order": "ascending" }], "ops": ["row_number"], "as": ["row_index"] },
          { "type": "filter", "expr": "datum.row_index === 1" },
          { "type": "fold", "fields": ["danceability", "energy", "acousticness", "valence", "speechiness"], "as": ["key", "value"] },
          { "type": "formula", "as": "category", "expr": "0" }
        ]
      },
      { "name": "keys", "source": "table", "transform": [{ "type": "aggregate", "groupby": ["key"] }] },
      { "name": "trackInfo", "source": "table", "transform": [{ "type": "aggregate", "ops": ["min", "min"], "fields": ["track_name", "artists"], "as": ["track_name", "artists"] }] }
    ],
    "scales": [
      {
        "name": "angular",
        "type": "point",
        "range": { "signal": "[-PI, PI]" },
        "padding": 0.5,
        "domain": { "data": "table", "field": "key" }
      },
      {
        "name": "radial",
        "type": "linear",
        "range": { "signal": "[0,radius]" },
        "domain": [0, 1]
      },
      {
        "name": "color",
        "type": "ordinal",
        "domain": { "data": "table", "field": "category" },
        "range": { "scheme": "category10" }
      }
    ],
    "encode": {
      "enter": {
        "x": { "signal": "radius" },
        "y": { "signal": "radius" }
      }
    },
    "marks": [
      // Radar polygon
      {
        "type": "group",
        "name": "categories",
        "zindex": 1,
        "from": {
          "facet": {
            "data": "table",
            "name": "facet",
            "groupby": ["category"]
          }
        },
        "marks": [
          {
            "type": "line", "name": "category-line",
            "from": { "data": "facet" },
            "encode": {
              "enter": {
                "interpolate": { "value": "linear-closed" },
                "x": { "signal": "scale('radial',datum.value)*cos(scale('angular',datum.key))" },
                "y": { "signal": "scale('radial',datum.value)*sin(scale('angular',datum.key))" },
                "stroke": { "scale": "color", "field": "category" },
                "strokeWidth": { "value": 2 },
                "fill": { "scale": "color", "field": "category" },
                "fillOpacity": { "value": 0.2 },
                "tooltip": {
                  "signal": "datum.track_name + ' by ' +  datum.artists + ' | ' + datum.key + ': ' + format(datum.value, '.2r')"
                }
              }
            }
          }
        ]
      },
      // Outer border
      {
        "type": "line", "name": "outer-line", "from": { "data": "keys" }, "encode": {
          "enter": {
            "interpolate": { "value": "linear-closed" },
            "x": { "signal": "radius*cos(scale('angular',datum.key))" },
            "y": { "signal": "radius*sin(scale('angular',datum.key))" },
            "stroke": { "value": "black" }, "strokeWidth": { "value": 1 }
          }
        }
      },
      // Radial grid
      {
        "type": "rule", "name": "radial-grid", "from": { "data": "keys" }, "zindex": 0, "encode": {
          "enter": {
            "x": { "value": 0 }, "y": { "value": 0 },
            "x2": { "signal": "radius*cos(scale('angular',datum.key))" },
            "y2": { "signal": "radius*sin(scale('angular',datum.key))" },
            "stroke": { "value": "black" }, "strokeWidth": { "value": 1 }
          }
        }
      },
      // Axis labels
      {
        "type": "text", "name": "key-label", "from": { "data": "keys" }, "zindex": 1, "encode": {
          "enter": {
            "x": { "signal": "(radius+5)*cos(scale('angular',datum.key))" },
            "y": { "signal": "(radius+5)*sin(scale('angular',datum.key))" },
            "text": { "field": "key" },
            "align": [{ "test": "abs(scale('angular',datum.key))>PI/2", "value": "right" }, { "value": "left" }],
            "baseline": [{ "test": "scale('angular',datum.key)>0", "value": "top" }, { "test": "scale('angular',datum.key)==0", "value": "middle" }, { "value": "bottom" }],
            "fill": { "value": "black" }, "fontWeight": { "value": "bold" }
          }
        }
      },

    ]
  };

  let viewTrack;
  vegaEmbed("#song_radar_chart", song_radar_chart)
    .then(resultTrack => { viewTrack = resultTrack.view; })
    .catch(console.error);

  function updateChartTrack() {
    const val = document.getElementById("dropdownInputTrack").value;
    if (viewTrack) {
      viewTrack.signal("selectedTrack", val).run();
    }
  }

  document.getElementById("dropdownInputTrack").addEventListener("keydown", e => {
    if (e.key === 'Enter' || e.keyCode === 13) updateChartTrack();
  });




  const dropdownValuesArtist = ["Taylor Swift",
    "IVE",
    "Sam Smith;Kim Petras",
    "Bizarrap;Quevedo",
    "David Guetta;Bebe Rexha",
    "Manuel Turizo",
    "Bad Bunny",
    "Billie Eilish",
    "Arctic Monkeys",
    "Nicki Minaj",
    "Chris Brown",
    "Harry Styles",
    "Joji",
    "Lil Nas X",
    "Ruth B.",
    "Shakira",
    "The Weeknd",
    "Lizzo",
    "Imagine Dragons",
    "Ghost",
    "TWICE",
    "Olivia Rodrigo",
    "Future",
    "J. Cole",
    "Sam Smith",
    "Doja Cat",
    "One Direction",
    "Eminem",
    "Bruno Mars",
    "XXXTENTACION",
    "Ed Sheeran",
    "BTS",
    "Coldplay",
    "AC/DC",
    "Maroon 5",
    "Dua Lipa",
    "BLACKPINK",
    "Daddy Yankee",
    "James Arthur",
    "Morgan Wallen",
    "John Legend",
    "Frank Ocean",
    "Gorillaz",
    "OneRepublic",
    "Mitski",
    "50 Cent",
    "Drake",
    "Kendrick Lamar",
    "ABBA",
    "TV Girl",
    "Elton John",
    "Justin Bieber",
    "TOTO",
    "Charlie Puth",
    "Jax",
    "The Beatles"
  ];

  function autocompleteArtists(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          b.addEventListener("click", function (e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            updateChartArtist();
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });


    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) { currentFocus++; addActive(x); }
      else if (e.keyCode == 38) { currentFocus--; addActive(x); }
      else if (e.keyCode == 13) { e.preventDefault(); if (currentFocus > -1) if (x) x[currentFocus].click(); }
    });
    function addActive(x) { if (!x) return false; removeActive(x); if (currentFocus >= x.length) currentFocus = 0; if (currentFocus < 0) currentFocus = x.length - 1; x[currentFocus].classList.add("autocomplete-active"); }
    function removeActive(x) { for (var i = 0; i < x.length; i++) x[i].classList.remove("autocomplete-active"); }
    function closeAllLists(elmnt) { var x = document.getElementsByClassName("autocomplete-items"); for (var i = 0; i < x.length; i++) if (elmnt != x[i] && elmnt != inp) x[i].parentNode.removeChild(x[i]); }
    document.addEventListener("click", function (e) { closeAllLists(e.target); });
  }

  autocompleteArtists(document.getElementById("dropdownInputArtist"), dropdownValuesArtist);

  var artists_radar_chart = {
    "$schema": "https://vega.github.io/schema/vega/v6.json",
    "description": "Radar chart for a specific song from CSV",
    "width": 500,
    "height": 500,
    "padding": { "top": 75, "left": 50, "right": 200, "bottom": 100 },
    "autosize": { "type": "none", "contains": "padding" },
    "signals": [
      { "name": "radius", "update": "width / 2" },
      { "name": "selectedArtists", "value": dropdownValuesArtist[0] } // default track
    ],
    "data": [
      {
        "name": "table",
        "url": "clean_dataset.csv",
        "format": { "type": "csv" },
        "transform": [
          { "type": "filter", "expr": "datum.artists === selectedArtists" },
          {
            "type": "aggregate",
            "fields": ["danceability", "energy", "acousticness", "valence", "speechiness"],
            "ops": ["mean", "mean", "mean", "mean", "mean"],
            "as": ["danceability", "energy", "acousticness", "valence", "speechiness"]
          },
          { "type": "fold", "fields": ["danceability", "energy", "acousticness", "valence", "speechiness"], "as": ["key", "value"] }
        ]
      },
      { "name": "keys", "source": "table", "transform": [{ "type": "aggregate", "groupby": ["key"] }] },
      { "name": "trackInfo", "source": "table", "transform": [{ "type": "aggregate", "ops": ["min", "min"], "fields": ["track_name", "artists"], "as": ["track_name", "artists"] }] }
    ],
    "scales": [
      {
        "name": "angular",
        "type": "point",
        "range": { "signal": "[-PI, PI]" },
        "padding": 0.5,
        "domain": { "data": "table", "field": "key" }
      },
      {
        "name": "radial",
        "type": "linear",
        "range": { "signal": "[0,radius]" },
        "domain": [0, 1]
      },
      {
        "name": "color",
        "type": "ordinal",
        "domain": { "data": "table", "field": "track_name" },
        "range": { "scheme": "category10" }
      }
    ],
    "encode": {
      "enter": {
        "x": { "signal": "radius" },
        "y": { "signal": "radius" }
      }
    },
    "marks": [
      // Radar polygon
      {
        "type": "group",
        "name": "categories",
        "zindex": 1,
        "from": {
          "facet": {
            "data": "table",
            "name": "facet",
            "groupby": ["track_name"]
          }
        },
        "marks": [
          {
            "type": "line", "name": "category-line",
            "from": { "data": "facet" },
            "encode": {
              "enter": {
                "interpolate": { "value": "linear-closed" },
                "x": { "signal": "scale('radial',datum.value)*cos(scale('angular',datum.key))" },
                "y": { "signal": "scale('radial',datum.value)*sin(scale('angular',datum.key))" },
                "stroke": { "scale": "color", "field": "track_name" },
                "strokeWidth": { "value": 2 },
                "fill": { "scale": "color", "field": "track_name" },
                "fillOpacity": { "value": 0.2 },

                "tooltip": {
                  "signal": "'Average ' + datum.key + ': ' + format(datum.value, '.2r')"
                }
              }
            }
          }
        ]
      },

      // Outer border
      {
        "type": "line", "name": "outer-line", "from": { "data": "keys" }, "encode": {
          "enter": {
            "interpolate": { "value": "linear-closed" },
            "x": { "signal": "radius*cos(scale('angular',datum.key))" },
            "y": { "signal": "radius*sin(scale('angular',datum.key))" },
            "stroke": { "value": "black" }, "strokeWidth": { "value": 1 }
          }
        }
      },
      // Radial grid
      {
        "type": "rule", "name": "radial-grid", "from": { "data": "keys" }, "zindex": 0, "encode": {
          "enter": {
            "x": { "value": 0 }, "y": { "value": 0 },
            "x2": { "signal": "radius*cos(scale('angular',datum.key))" },
            "y2": { "signal": "radius*sin(scale('angular',datum.key))" },
            "stroke": { "value": "black" }, "strokeWidth": { "value": 1 }
          }
        }
      },
      // Axis labels
      {
        "type": "text", "name": "key-label", "from": { "data": "keys" }, "zindex": 1, "encode": {
          "enter": {
            "x": { "signal": "(radius+5)*cos(scale('angular',datum.key))" },
            "y": { "signal": "(radius+5)*sin(scale('angular',datum.key))" },
            "text": { "field": "key" },
            "align": [{ "test": "abs(scale('angular',datum.key))>PI/2", "value": "right" }, { "value": "left" }],
            "baseline": [{ "test": "scale('angular',datum.key)>0", "value": "top" }, { "test": "scale('angular',datum.key)==0", "value": "middle" }, { "value": "bottom" }],
            "fill": { "value": "black" }, "fontWeight": { "value": "bold" }
          }
        }
      },

    ]
  };

  let viewArtist;
  vegaEmbed("#artists_radar_chart", artists_radar_chart)
    .then(resultArtist => { viewArtist = resultArtist.view; })
    .catch(console.error);

  function updateChartArtist() {
    const val = document.getElementById("dropdownInputArtist").value;
    if (viewArtist) {
      viewArtist.signal("selectedArtists", val).run();
    }
  }

  document.getElementById("dropdownInputArtist").addEventListener("keydown", e => {
    if (e.key === 'Enter' || e.keyCode === 13) updateChartArtist();
  });


  /************************************** Third Visualization: Explicit vs. Non-Explicit Histograms ******************************************/
  const explicitSample = getSample(explicitData)
  const nonExplicitSample = getSample(nonExplicitData)
  console.log("Type of explicit sample " + typeof (explicitSample));
  function getSample(data) {
    for (let i = data.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [data[i], data[j]] = [data[j], data[i]];
    }

    return data.slice(0, 1000);
  }

  let totalSample = explicitSample.concat(nonExplicitSample)
  console.log(totalSample)

  var explicit_chart = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    description: 'Faceted histograms displaying various differences between explicit and non-explicit songs',
    width: 'container',
    height: 'container',
    title: '',
    data: { values: totalSample },
    params: [{
      name: 'metricParam',
      value: 'popularity',
      bind: { input: 'select', name: 'Select Metric:   ', options: ['popularity', 'duration_ms', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo'] }
    }],
    facet: { column: { field: 'explicit', title: 'Using a random sample of 1000 songs each' } },
    spec: {
    width: 500,
      transform: [{ calculate: 'datum[metricParam]', as: 'metricValue' },
      { bin: { maxbins: 20 }, field: "metricValue", as: ["bin_start", "bin_end"] }],
      mark: { type: 'bar', stroke: "black", strokeWidth: '1px' },
      encoding: {
        x: { field: 'metricValue', type: 'quantitative', bin: { maxbins: 20 }, axis: { title: 'Metric' } },
        y: { aggregate: 'count', type: 'quantitative', axis: { title: '# of Occurrences' } },
        color: {
          field: 'explicit',
          type: 'nominal',
          scale: {
            domain: ['Explicit', 'Non-Explicit'],
            range: ['#b2182b', '#2166ac']
          }
        },
        tooltip: [
          { field: 'bin_start', title: 'Bin Start' },
          { field: 'bin_end', title: 'Bin End' },
          { aggregate: 'count' },
        ]
      }
    }
  }
  vegaEmbed('#explicit_chart', explicit_chart);

  /************************************** Fourth Visualization: Tempo vs. Length Scatterplot by Artist ******************************************/
  var tempo_length_plot = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    description: 'Scatterplot showing the relationship between average tempo, length, and loudness per artist',
    width: 'container',
    title: '',
    data: { url: 'artist_stats.csv' },
    params: [{
      name: 'zoom',
      select: 'interval',
      bind: 'scales'
    }],
    mark: { type: 'circle' },
    encoding: {
      x: {
        field: 'duration',
        type: 'quantitative',
        axis: { title: 'Average Song Duration (Mins)' },
      },
      y: {
        field: 'tempo',
        type: 'quantitative',
        axis: { title: 'Average Song Tempo (BPM)' }
      },
      color: {
        field: 'loudness',
        type: 'quantitative',
        scale: { domain: [-20, -10, 0], range: ["#b2182b", "#f7f7f7", "#2166ac"] },
        legend: { title: 'Avg. Loudness (dB)' }
      },
      
      tooltip: [
        { field: 'artist' },
        { field: 'duration' },
        { field: 'tempo' },
        { field: 'loudness' }
      ]
    }
  }
  vegaEmbed('#tempo_length_plot', tempo_length_plot);

  /************************************** Fifth Visualization: Correlation Heatmap ******************************************/
  const heatSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 415,
    autosize: { type: "fit", contains: "padding" },
    config: {
      view: { stroke: "transparent" },
      axis: { grid: false, domain: false },
      mark: { cursor: "pointer" }
    },
    data: { values: heatData },
    selection: {
      clicked: {
        type: "single",
        fields: ["col1", "col2"],
        on: "click",
        toggle: true,
        clear: "dblclick",
        empty: "none"
      }
    },
    mark: { type: "rect", strokeJoin: "round", strokeAlign: "inside" },
    encoding: {
      x: {
        field: "col1",
        type: "nominal",
        sort: prettyLabels,
        axis: { labelAngle: -45, title: "" }
      },
      y: {
        field: "col2",
        type: "nominal",
        sort: prettyLabels,
        axis: { title: "" }
      },
      color: {
        field: "correlation",
        type: "quantitative",
        scale: { domain: [-1, 0, 1], range: ["#b2182b", "#f7f7f7", "#2166ac"] },
        legend: { title: "Correlation", gradientLength: 320 }
      },
      stroke: {
        condition: { selection: "clicked", value: "#111" },
        value: "#111"
      },
      strokeWidth: {
        condition: { selection: "clicked", value: 2 },
        value: 1
      },
      tooltip: [
        { field: "col1", type: "nominal", title: "Feature X" },
        { field: "col2", type: "nominal", title: "Feature Y" },
        {
          field: "correlation",
          type: "quantitative",
          format: ".3f",
          title: "Correlation"
        }
      ]
    }
  };

  const heatResult = await vegaEmbed("#vis", heatSpec, {
    actions: false,
    renderer: "svg"
  });

  const heatView = heatResult.view;

  /************************************** Sixth Visualization: Linked Scatterplot to Heatmap ******************************************/

  const setBadge = (x, y, sampleCount) => {
    const infoBox = document.getElementById("infoBox");
    if (!x || !y) {
      infoBox.textContent =
        "No pair selected, click a square on the heatmap to see the scatter plot.";
    } else {
      infoBox.textContent = `Selected pair: ${prettyLabel(x)} (X) and ${prettyLabel(y)} (Y). Showing ${sampleCount} sampled songs.`;
    }
  };

  function sampleSongsForFields(xField, yField, sampleSize) {
    const filtered = songsData.filter(
      r => Number.isFinite(r[xField]) && Number.isFinite(r[yField])
    );

    if (!filtered.length) return [];

    for (let i = filtered.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    return filtered.slice(0, sampleSize);
  }

  async function buildScatter(xField, yField, sampleSize) {
    const scatterEl = document.getElementById("scatter");

    if (!xField || !yField) {
      scatterEl.innerHTML = "";
      setBadge(null, null, sampleSize);
      return;
    }

    const sample = sampleSongsForFields(xField, yField, sampleSize);
    setBadge(xField, yField, sample.length);

    const scatterSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: "container",
      height: "container",
      params: [{
        name: 'zoom',
        select: 'interval',
        bind: 'scales'
      }],
      autosize: { type: "fit", contains: "padding" },
      data: { values: sample },
      mark: { type: "point", tooltip: true, opacity: 0.85 },
      encoding: {
        x: {
          field: xField,
          type: "quantitative",
          axis: { title: prettyLabel(xField) }
        },
        y: {
          field: yField,
          type: "quantitative",
          axis: { title: prettyLabel(yField) }
        },
        color: { field: "track_genre", type: "nominal", legend: { title: "Genre" } },
        size: { value: 60 },
        tooltip: [
          { field: "track_name", type: "nominal", title: "Song" },
          { field: "artists", type: "nominal", title: "Artist(s)" },
          {
            field: xField,
            type: "quantitative",
            format: ".3f",
            title: prettyLabel(xField)
          },
          {
            field: yField,
            type: "quantitative",
            format: ".3f",
            title: prettyLabel(yField)
          },
          { field: "track_genre", type: "nominal", title: "Genre" }
        ]
      }
    };

    await vegaEmbed("#scatter", scatterSpec, {
      actions: false,
      renderer: "canvas"
    });
  }

  await buildScatter(null, null, DEFAULT_SAMPLE_SIZE);

  heatView.addEventListener("click", (event, item) => {
    if (!item || !item.datum) return;
    const { col1, col2 } = item.datum;
    const xField = labelMap[col1];
    const yField = labelMap[col2];
    buildScatter(xField, yField, DEFAULT_SAMPLE_SIZE);
  });

  heatView.addEventListener("dblclick", () => {
    buildScatter(null, null, DEFAULT_SAMPLE_SIZE);
  });
})();

