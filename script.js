fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((data) => func(data.data));

const func = (dataset) => {
  const width = 800;
  const height = 400;
  const padding = 40;
  const max = d3.max(dataset, (d) => d[1]);

  // Setting up y scale this way so that i can use the same fucking scale for the y-axis
  const yScale = d3
    .scaleLinear()
    .domain([0, max])
    .range([height - 2 * padding, 0]);

  // I tried scaleLinear and scaleBand for the x-axis, and they seemed to work fine
  // but i could not pass the user stories with those
  // visualization is a shitstorm on its own right
  const xScale = d3
    .scaleTime()
    .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
    .range([0, width - 2 * padding]);

  const colorScale = d3
    .scaleLinear()
    .domain([0, dataset.length - 1])
    .range(["blue", "green"]);

  const svg = d3
    .select("#root")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("border", "1px solid black");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("height", (d) => yScale(max - d[1]))
    .attr("width", (width - 2 * padding) / dataset.length)
    .attr("x", (d, i) => padding + xScale(new Date(d[0])))
    .attr("y", (d) => height - padding - yScale(max - d[1]))
    .attr("fill", (d, i) => colorScale(i))
    .attr("class", "bar")
    .on("mouseover", (e, d) => {
      let str;
      let gdp =
        d[1] >= 1000
          ? `${(d[1] / 1000).toFixed(2)} trillions`
          : `${d[1]} billions`;
      switch (d[0].substring(5, 7)) {
        case "01":
          str = `${d[0].substring(0, 4)} Q1 \n${gdp}`;
          break;
        case "04":
          str = `${d[0].substring(0, 4)} Q2 \n${gdp}`;
          break;
        case "07":
          str = `${d[0].substring(0, 4)} Q3 \n${gdp}`;
          break;
        case "10":
          str = `${d[0].substring(0, 4)} Q4 \n${gdp}`;
      }

      d3.select("#tooltip")
        .attr("data-date", d[0])
        // transition somehow fucks shit up and the tooltip wont disapear on mouseout!
        // .transition()
        // .duration(200)
        .style("opacity", 1)
        .text(str);
    })
    .on("mouseout", () => {
      d3.select("#tooltip").style("opacity", 0);
    })
    .on("mousemove", (e, d) => {
      console.log(e);
      d3.select("#tooltip")
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + 10 + "px");
    });

  const xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(40, 360)")
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(40, 40)")
    .call(yAxis);
};
