var chart = d3.chart.dependencyWheel();

if (window.location.pathname.indexOf('full') > -1) {
    var data = document.getElementById('chart-data').getAttribute('data-doc');
    data = JSON.parse(data);
    data = JSON.parse(data);
    var chart_num = 0;
    var titles;
    render(data);
}

function render(data) {
    var services = [];
    var services_full = [];
    var tools = data[0];
    for(var i in data) {
        services_full.push({name: 'Пробел'});
        services.push('  ');
        if (Number(i)) {
            data[i].forEach(function(service) {
                services_full.push(service);
                services.push(service.undefined);
            });
        }
        services_full.push({name: 'Название'});
        services.push('TitleString_' + i);
        services_full.push({name: 'Пробел'});
        services.push('  ');
    };
    var canals_and_systems = data[0];

    var dependencyMatrix = [];
    var packages = tools.concat(services);

    for(var i in tools) {
        dependencyMatrix.push(generateEmptyArray(packages.length));
    }
    
    services_full.forEach(function(service, i) {
        var empty_part = generateEmptyArray(services_full.length);
        console.log(tools);
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


    d3.select('#chart')
      .datum(data)
      .call(chart);
}

function generateEmptyArray(num) {
    return _.times(num, _.constant(0));
}
