document.addEventListener("DOMContentLoaded", function() {
    // Load the JSON data
    d3.json("attendence.json").then(function(data) {
        // Define SVG dimensions
        const svgWidth = 800;
        const svgHeight = 600;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const chartWidth = svgWidth - margin.left - margin.right;
        const chartHeight = svgHeight - margin.top - margin.bottom;

        // Create SVG element
        const svg = d3.select("#chartContainer")
                      .append("svg")
                      .attr("width", svgWidth)
                      .attr("height", svgHeight);

        // Extract brands and sales data
        const brands = data.map(d => d.brand);
        const salesData = data.map(d => d.sales);

        // Parse dates and format sales data for line charts
        const parseDate = d3.timeParse("%Y-%m-%d");

        // Configure x and y scales
        const xScale = d3.scaleTime()
                         .domain(d3.extent(salesData[0], d => parseDate(d.date)))
                         .range([margin.left, chartWidth + margin.left]);

        const yScale = d3.scaleLinear()
                         .domain([0, d3.max(salesData.flat(), d => d.units_sold)])
                         .nice()
                         .range([chartHeight + margin.top, margin.top]);

        // Define line function
        const line = d3.line()
                       .x(d => xScale(parseDate(d.date)))
                       .y(d => yScale(d.units_sold));

        // Draw single line chart (e.g., for Apple)
        svg.append("path")
           .datum(salesData[0])
           .attr("fill", "none")
           .attr("stroke", "steelblue")
           .attr("stroke-width", 2)
           .attr("d", line);

        // Draw fewer lines chart (e.g., for Apple and Samsung)
        const fewerLineColors = ["steelblue", "orange"];
        salesData.slice(0, 2).forEach((lineData, index) => {
            svg.append("path")
               .datum(lineData)
               .attr("fill", "none")
               .attr("stroke", fewerLineColors[index])
               .attr("stroke-width", 2)
               .attr("d", line);
        });

        // Draw multiple lines chart (e.g., for all brands)
        const multipleLineColors = ["steelblue", "orange", "green", "red"];
        salesData.forEach((lineData, index) => {
            svg.append("path")
               .datum(lineData)
               .attr("fill", "none")
               .attr("stroke", multipleLineColors[index])
               .attr("stroke-width", 2)
               .attr("d", line);
        });

        // Create x-axis
        svg.append("g")
           .attr("transform", `translate(0, ${chartHeight + margin.top})`)
           .call(d3.axisBottom(xScale));

        // Create y-axis
        svg.append("g")
           .attr("transform", `translate(${margin.left}, 0)`)
           .call(d3.axisLeft(yScale));

        // Add chart title
      //   svg.append("text")
      //      .attr("x", svgWidth / 2)
      //      .attr("y", margin.top / 2)
      //      .attr("text-anchor", "middle")
      //      .style("font-size", "18px")
      //      .text("Mobile Phone Sales Line Charts");

        // Add legend for the lines
        const legend = svg.append("g")
                          .attr("transform", `translate(${chartWidth + margin.left}, ${margin.top})`);

        legend.selectAll("rect")
              .data(brands)
              .enter()
              .append("rect")
              .attr("x", 0)
              .attr("y", (d, i) => i * 20)
              .attr("width", 12)
              .attr("height", 12)
              .attr("fill", (d, i) => multipleLineColors[i]);

        legend.selectAll("text")
              .data(brands)
              .enter()
              .append("text")
              .attr("x", 20)
              .attr("y", (d, i) => i * 20 + 10)
              .style("font-size", "12px")
              .style("fill", "#fff")
              .text(d => d);

    }).catch(function(error) {
        console.log("Error loading data:", error);
    });
});
