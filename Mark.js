(async function () {
  const DEFAULT_SAMPLE_SIZE = 100;
  const prettyLabel = s => s.charAt(0).toUpperCase() + s.slice(1);

  const corrText = await fetch("corr10.csv").then(r => r.text());
  const songsText = await fetch("song.csv").then(r => r.text());

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

  const songsData = parsedSongs.data;

  const allowedGenres = new Set([
    "Acoustic / Folk",
    "African & Afro-Fusion",
    "Rock – Alternative / Indie",
    "Electronic – Ambient / Chill / Sleep",
    "Asian – Japan",
    "Metal",
    "Blues",
    "Latin – Brazil",
    "Electronic – Bass / DnB / Dub",
    "Asian – Chinese / HK / Taiwan",
    "Electronic – House",
    "Children / Kids",
    "Classical / Opera",
    "Electronic – EDM / Dance",
    "Musical Theatre / Show Tunes",
    "Latin – Dance / Caribbean",
    "Electronic – Techno / Trance",
    "Rock – Core / Punk",
    "Mood / Miscellaneous",
    "Hip-Hop / R&B",
    "Rock – Classic / Mainstream",
    "South Asia / Middle East",
    "Jazz",
    "Asian – Korea",
    "Latin – General"
  ]);

  songsData.forEach(r => {
    let g = (r.track_genre || "Other")
      .replace(/\s+/g, " ")
      .replace(/[–—]/g, "–")
      .trim();

    r.track_genre = allowedGenres.has(g) ? g : "Other";
  });

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