var chart = d3.chart.dependencyWheel();
console.log(chart);

if (window.location.pathname.indexOf('read') > -1) {
    var data = document.getElementById('chart-data').getAttribute('data-doc');
    data = JSON.parse(data);
    var chart_num = 0;
    var titles;
    for(var list in data) {
        if (chart_num) {
            $('<h2>' + titles[list] + '</h2><div id="chart-' + chart_num + '"></div>').appendTo('.charts');
            render(data[list], 'chart-' + chart_num);
        }
        else {
            titles = data[list];
        }
        chart_num++;
    };
}

function render(data, addr) {
    var services = [];
    var services_full = [];
    var tools = [];
    for(var num in data) {
        var service = data[num];
        services_full.push(service);
        service.undefined.replace('\r\n', ' ');
        services.push(service.undefined);
        for(var tool in service) {
            if(tool != 'undefined') {
                tool.replace('\r\n', ' ');
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

    console.log(chart);

    d3.select('#' + addr)
      .datum(data)
      .call(chart);
}

function generateEmptyArray(num) {
    return _.times(num, _.constant(0));
}