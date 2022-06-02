google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Time');
    data.addColumn('number', 'Temperature');

    //MongoDB 데이터 받는것이 안됩니다.

   
    const options = {  
        width: 900,
        height: 500,   
    };
    const chart = new google.charts.Line(document.getElementById('line_top_x'));
    chart.draw(data, google.charts.Line.convertOptions(options));
}


