(async function () {
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
  
  var popularity_correlation_chart = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    description: 'Bar graph visualizing what metrics best correlate with popularity -- by genre',
    title: 'What Best Correlates With Popularity?',
    data: {url:'popularity_correlation.csv'},
    width: 600,
    height: 300,
    params: [{
        name: 'genreParam',
        value: 'All',
        bind: {
          input: "select",
          name: 'Genre: ',
          options: [
            'All','dance','hip-hop','pop','reggaeton','latino','latin','alt-rock','chill',
            'reggae','indie','rock','groove','folk','piano','country','funk','edm',
            'k-pop','soul','indian','british','electro','alternative','synth-pop','emo',
            'indie-pop','techno','r-n-b','metal','house','sleep','hard-rock','blues',
            'pagode','trance','german','disco','garage','sad','singer-songwriter',
            'anime','dancehall','punk','swedish','acoustic','brazil','progressive-house',
            'power-pop','spanish','rockabilly','hardcore','pop-film','grunge','ambient',
            'french','punk-rock','psych-rock','chicago-house','j-pop','songwriter','jazz',
            'j-rock','children','turkish','electronic','salsa','deep-house','rock-n-roll',
            'industrial','show-tunes','comedy','ska','afrobeat','j-dance','dub','party',
            'death-metal','metalcore','disney','cantopop','mandopop','world-music','idm',
            'classical','dubstep','bluegrass','new-age','drum-and-bass','samba',
            'minimal-techno','opera','trip-hop','goth','mpb','club','hardstyle','happy',
            'malay','breakbeat','sertanejo','kids','heavy-metal','forro','guitar','j-idol',
            'gospel','black-metal','honky-tonk','study','detroit-techno','tango',
            'grindcore','romance','iranian'
          ]
        }
    }],
    transform: [{filter: 'datum.Genre === genreParam'}],
    mark: {type: 'bar', stroke:"black", strokeWidth: '1px'},
    encoding: {
      x: {
        field: 'Correlation',
        type: 'quantitative',
        axis: {title: 'Correlation Coefficient'},
        scale: {domain: [-1.0, 1.0]}
      },
      y: {
        field: 'Metric',
        type: 'nominal',
        sort: {op: 'mean', field: 'Correlation', order: 'descending'}
      },
      color: {
        field: "Correlation",
        type: "quantitative",
        scale: { domain: [-1, 0, 1], range: ["#b2182b", "#f7f7f7", "#2166ac"] },
      },
      tooltip: [
        {field: 'Metric'},
        {field: 'Correlation'},
        {field: 'Genre'}
      ]
    }
  };

  vegaEmbed('#popularity_correlation_chart', popularity_correlation_chart);

  const explicitSample = getSample(explicitData)
  const nonExplicitSample = getSample(nonExplicitData)
  console.log("Type of explicit sample "+typeof(explicitSample));
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
    title: 'How do Explicit and Non-Explicit Songs Compare?',
    data: {values: totalSample},
    params: [ {
        name: 'metricParam', 
        value: 'popularity',
        bind: {input: 'select', name: 'Metric: ', options: ['popularity', 'duration_ms', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']}
    } ],
    facet: {column: {field: 'explicit', title: 'Non-Explicit (Blue) vs. Explicit (Red)'}},
    spec: {
        transform: [{calculate:'datum[metricParam]', as: 'metricValue'}, 
          { bin: { maxbins: 20 }, field: "metricValue", as: ["bin_start", "bin_end"] }],
        mark: {type: 'bar', stroke:"black", strokeWidth: '1px'},
        encoding: {
        x: {field: 'metricValue', type: 'quantitative', bin: {maxbins: 20}, axis: {title: 'Metric'}},
        y: {aggregate: 'count', type: 'quantitative', axis: {title: '# of Occurrences'}},
        color: { 
            field: 'explicit', 
            type: 'nominal', 
            scale: {
                domain: ['True', 'False'], 
                range: ['red', 'blue']  
            }
        },
        tooltip: [
          {field: 'bin_start', title: 'Bin Start'},
          {field: 'bin_end', title: 'Bin End'},
          {aggregate: 'count'},
        ]
        }
    }
}
vegaEmbed('#explicit_chart',explicit_chart);

var tempo_length_plot = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  description: 'Scatterplot showing the relationship between average tempo, length, and loudness per artist',
  title: 'Average Tempo vs. Length in Popular Artists\'s Songs',
  width: 600,
  data: {url: 'artist_stats.csv'},
  "params": [{
    name: 'zoom',
    select: 'interval',
    bind: 'scales'
  }],
  mark: {type: 'circle'},
    encoding: {
      x: {
        field: 'duration',
        type: 'quantitative',
        axis: {title: 'Average Duration (Mins)'},
      },
      y: {
        field: 'tempo',
        type: 'quantitative',
        axis: {title: 'Average Tempo (BPM)'}
      },
      size: {
        field: 'loudness',
        type: 'quantitative'
      },
      color: {value: '#1db954'},
      tooltip: [
        {field: 'artist'},
        {field: 'duration'},
        {field: 'tempo'},
        {field: 'loudness'}
      ]
    }
}
vegaEmbed('#tempo_length_plot',tempo_length_plot);

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
        color: { field: "track_genre", type: "nominal", legend: { title: "Genre"} },
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
