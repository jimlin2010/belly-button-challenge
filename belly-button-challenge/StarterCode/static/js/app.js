// Load the data

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(data) {

  // Create the dropdown menu
  const dropdownMenu = d3.select("#selDataset");
  dropdownMenu.on("change", updatePage);

  const ids = data.names;
  ids.forEach(id => {
    const option = dropdownMenu.append("option");
    option.text(id);
    option.property("value", id);
  });

  // Display the sample metadata
  function showMetadata(sample) {
    const metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");
    const metadata = data.metadata.filter(obj => obj.id == sample)[0];
    Object.entries(metadata).forEach(([key, value]) => {
      const row = metadataPanel.append("p");
      row.text(`${key}: ${value}`);
    });
  }

  // Display the bar chart and bubble chart
  function showCharts(sample) {
    const selectedSample = data.samples.filter(obj => obj.id == sample)[0];
    const sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    const otuIds = selectedSample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    const otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

    const trace1 = {
      x: sampleValues,
      y: otuIds,
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };

    const data1 = [trace1];

    const layout1 = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", data1, layout1);

    const trace2 = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      mode: "markers",
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: "Earth"
      },
      text: selectedSample.otu_labels
    };

    const data2 = [trace2];

    const layout2 = {
      title: "OTU ID vs. Sample Values",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", data2, layout2);
  }

  // Update the page when a new sample is selected
  function updatePage() {
    const selectedSample = dropdownMenu.property("value");
    showMetadata(selectedSample);
    showCharts(selectedSample);
  }

  // Display the initial data
  const initialSample = ids[0];
  showMetadata(initialSample);
  showCharts(initialSample);

}).catch(function(error) {
  console.log(error);
});
