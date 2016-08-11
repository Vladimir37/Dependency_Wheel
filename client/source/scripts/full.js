var chart = d3.chart.dependencyWheel().width(1300).margin(400);

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
    var tools = [];
    for(var i in data) {
        if (Number(i)) {
            services_full.push({undefined: data[0][i - 1]});
            services.push(data[0][i - 1] + '{title}');
            data[i].forEach(function(service) {
                services_full.push(service);
                services.push(service.undefined + '{name}' + data[0][i - 1]);
            });
            services.push('  ');
        }
    };
    var canals_and_systems = data[1];

    services_full.push({undefined: 'Пробел'});
    services.push('  ');

    for(var num in canals_and_systems) {
        for(var tool in canals_and_systems[num]) {
            if(tool != 'undefined') {
                tools.push(tool);
            }
        }
    }
    tools = _.uniq(tools);

    tools.push('  ');

    var dependencyMatrix = [];
    var packages = tools.concat(services);

    for(var i in tools) {
        dependencyMatrix.push(generateEmptyArray(packages.length));
    }
    
    services_full.forEach(function(service, i) {
        var empty_part = generateEmptyArray(services_full.length);
        var tool_arr = tools.map(function(tool) {
            if (service[tool]) {
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

    bold();
}

function generateEmptyArray(num) {
    return _.times(num, _.constant(0));
}

function bold() {
    $('text').css({
        fontFamily: 'Arial'
    });
    $('text:contains("{title}")').each(function() {
        $(this).css({
            fontSize: '20px',
            fontWeight: 'bold'
        });
        var title = this.innerHTML.slice(0, -7);
        this.innerHTML = title;
        $(this).click(function() {
            var addr = window.location.pathname.split('/');
            addr = addr[addr.length - 1];
            window.location.pathname = '/list/' + addr + '#' + title;
        });
    });

    $('text:contains("{name}")').each(function() {
        var name_arr = this.innerHTML.split('{name}');
        this.innerHTML = name_arr[0];
        $(this).click(function() {
            var addr = window.location.pathname.split('/');
            addr = addr[addr.length - 1];
            window.location.pathname = '/list/' + addr + '#' + name_arr[1];
        });
    });
}