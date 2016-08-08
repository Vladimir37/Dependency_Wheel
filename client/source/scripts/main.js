if (window.location.pathname.indexOf('read') > -1) {
    var data = document.getElementById('chart-data').getAttribute('data-doc');
    data = JSON.parse(data);
    var chart_num = 0;
    for(var list in data) {
        console.log(chart_num);
        if (!chart_num) {
            chart_num++;
            continue;
        }
        chart_num++;
        $('<h2>' + list + '</h2><div id="chart-' + chart_num + '"></div>').appendTo('.charts');
        render(data[list], 'chart-' + chart_num);
    };
}

var chart = d3.chart.dependencyWheel();

function render(data, addr) {
    var services = [];
    var services_full = [];
    var tools = [];
    for(var num in data) {
        var service = data[num];
        services_full.push(service);
        services.push(service.name);
        for(var tool in service) {
            if(tool != 'undefined') {
                tools.push(tool);
            }
        }
    }
    tools = _.uniq(tools);

    var dependencyMatrix = [];
    var packages = tools.concat(services);

    for(var i in tools) {
        dependencyMatrix.push(generateEmptyArray(packages.length));
    }
    services_full.forEach(function(service) {
        var empty_part = generateEmptyArray(services_full.length);
        var tool_arr = tools.map(function(tool) {
            if(service[tool]) {
                return 1;
            }
            else {
                return 0;
            }
        });
        dependencyMatrix.push(tool_arr.concat(empty_part));
    });

    var data = {
      packageNames: packages,
      matrix: dependencyMatrix
    };

    d3.select('#' + addr)
      .datum(data)
      .call(chart);
}

function generateEmptyArray(num) {
    return _.times(num, _.constant(0));
}