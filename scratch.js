document.addEventListener('DOMContentLoaded',function(){
    let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
    let req = new XMLHttpRequest()

    let data
    let years = []
    let time = []
    
    var width = 900, height = 800

    req.open("GET", url , true);

    req.onload = () => {
        data = JSON.parse(req.responseText)
        years = data.map(x => x.Year)
        time = data.map(x => x.Time)
        console.log(years)
        console.log(time)
    }
    req.send()
    
    // Append SVG 
    var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)

    // Create linear scale, specify domain and range.
    var xscale = d3.scaleLinear()
                   .domain([d3.min(years), d3.max(years)])
                   .range([0, width])

    var yscale = d3.scaleLinear()
                   .domain([d3.min(time), d3.max(time)])
                   .range([height/2, 0])

    // Add scales to axis
    var x_axis = d3.axisBottom()
                   .scale(xscale);

    var y_axis = d3.axisLeft()
                   .scale(yscale);
    
    //Append group and insert axis
    svg.append("g")
       .attr('transform', 'translate(50, 10)')
       .call(y_axis);

    var xAxisTranslate = height/2 + 10

    svg.append('g')
       .attr('transform', 'translate(50, ' + xAxisTranslate + ')')
       .call(x_axis)
})
