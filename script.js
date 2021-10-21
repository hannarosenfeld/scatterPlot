document.addEventListener('DOMContentLoaded',function(){
    let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
    // import our json data
    let req = new XMLHttpRequest()
    let values
    // will be used to create our x-asis as well as placing elements horizontally on the canvas
    let xScale
    // will be used to create the yasis along the left as well as placing dots vertically on the canvas
    let yScale

    //dimensions for canvas
    let width = 800
    let height = 600
    let padding = 40

    let svg = d3.select('svg')
    let tooltip = d3.select('#tooltip')

    // function that draws our canvas with the variables that we set
    let drawCanvas = () => {
        svg.attr('width', width)
        svg.attr('height', height)
    }


    // generate our x and y scales. will set these to some linear and time scales 
    let generateScales = () => {
        xScale = d3.scaleLinear()
                   .domain([d3.min(values, (item) => {
                       return item['Year']
                       // taking away a year so the points don't start on the x axis
                   })- 1, d3.max(values, (item) => {
                       return item['Year']
                       // adding a year so the points don't end on the last tick
                   })+ 1])
        //padding: start x axis, (width-padding) end of x axis
                   .range([padding, width - padding])

        yScale = d3.scaleTime()
                   .domain([d3.min(values, (item) => {
                       return new Date(item['Seconds'] * 1000)
                   }), d3.max(values, (item) => {
                       return new Date(item['Seconds'] * 1000)
                   })])
                   .range([padding, height - padding])
    }


    // will be used to plot the actual points onto our graph
    let drawPoints = () => {
        svg.selectAll('circle')
           .data(values)
           .enter()
           .append('circle')
           .attr('class', 'dot')
           .attr('r', '5')
           .attr('data-xvalue', (item) => {
               return item['Year']
           })
           .attr('data-yvalue', (item) => {
               return new Date(item['Seconds'] * 1000)
           })
        // spreading points out on xaxis
           .attr('cx', (item) => {
               return xScale(item['Year'])
           })
        // placing points on y scale
           .attr('cy', (item) => {
               return yScale(new Date(item['Seconds'] * 1000))
           })
        // change colors of circles, depending on doping or not
           .attr('fill', (item) => {
               if (item['Doping'] != '') {
                   return 'orange'
               } else {
                   return 'chartreuse'
               }
           })
        // make tooltip visible on mouseover
           .on('mouseover', (item) => {
               tooltip.transition()
                      .style('visibility', 'visible')
               if (item['Doping'] != '') {
                   tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + item['Doping'])
               } else{
                   tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + 'No Allegations')
               }
               tooltip.attr('data-year', item['Year'])
           })
                      .on('mouseout', (item) => {
                          tooltip.transition()
                                 .style('visibility', 'hidden')
                      })
    }


    // will draw the x and y axes onto our graph
    let generateAxes = () => {
        //we want the ticks to be at the bottom
        //returns a set of svg elements
        let xAxis = d3.axisBottom(xScale)
        // d for decimal. years won't have a comma in them anymore
                      .tickFormat(d3.format('d'))
        let yAxis = d3.axisLeft(yScale)
        //want to put them into this group element
        // render the minutes, then seconds
                      .tickFormat(d3.timeFormat('%M:%S'))
        svg.append('g')
                      .call(xAxis)
                      .attr('id', 'x-axis')
        // moving the xaxis (translating) down. height - padding to push it down.
                      .attr('transform', 'translate(0, ' + (height - padding) + ')')

        svg.append('g')
                      .call(yAxis)
                      .attr('id','y-axis')
                      .attr('transform', 'translate(' + padding + ', 0 )')
        
    }

    // true means we tun it asynchronisly
    req.open('GET', url, true)



    req.onload = () => {
        values = JSON.parse(req.responseText)
        console.log(values)
        drawCanvas()
        generateScales()
        drawPoints()
        generateAxes()
    }

    req.send()

})
