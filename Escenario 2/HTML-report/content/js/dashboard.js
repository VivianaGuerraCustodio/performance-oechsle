/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 82.3076923076923, "KoPercent": 17.692307692307693};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "checkout order placed"], "isController": false}, {"data": [0.75, 500, 1500, "metodo de entrega"], "isController": false}, {"data": [0.4, 500, 1500, "datos de despacho o entrega"], "isController": false}, {"data": [0.6, 500, 1500, "https://www.oechsle.pe/checkout"], "isController": false}, {"data": [0.0, 500, 1500, "abrir pestaña del producto"], "isController": false}, {"data": [0.45, 500, 1500, "refresh data outdated"], "isController": false}, {"data": [0.3, 500, 1500, "check legal email"], "isController": false}, {"data": [0.0, 500, 1500, "buscar producto iphone"], "isController": false}, {"data": [0.0, 500, 1500, "success"], "isController": false}, {"data": [0.0, 500, 1500, "simulacion de datos de entrega"], "isController": false}, {"data": [0.35, 500, 1500, "first form"], "isController": false}, {"data": [0.5, 500, 1500, "data of amount to pay"], "isController": false}, {"data": [0.05, 500, 1500, "agregar producto al carrito"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 130, 23, 17.692307692307693, 18266.93076923079, 151, 161710, 950.0, 70297.90000000001, 155852.59999999998, 161258.63999999998, 0.5338611714556751, 30.373833237426545, 0.7513037249136583], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["checkout order placed", 10, 0, 0.0, 673.0, 542, 1018, 595.5, 1000.2, 1018.0, 1018.0, 1.751006828926633, 38.006424006303625, 1.831375306426195], "isController": false}, {"data": ["metodo de entrega", 10, 0, 0.0, 1307.9, 379, 7508, 447.5, 6950.700000000002, 7508.0, 7508.0, 0.2381235861412073, 0.16789573163471844, 0.21812492558637933], "isController": false}, {"data": ["datos de despacho o entrega", 10, 0, 0.0, 3180.9, 607, 22535, 1132.0, 20456.200000000008, 22535.0, 22535.0, 0.2803554907622866, 1.6617359874821276, 0.8988350353247919], "isController": false}, {"data": ["https://www.oechsle.pe/checkout", 10, 0, 0.0, 4982.4, 151, 37081, 772.5, 34052.100000000006, 37081.0, 37081.0, 0.14625656326327646, 4.829665950009506, 0.09755198506720489], "isController": false}, {"data": ["abrir pestaña del producto", 10, 0, 0.0, 129394.5, 12592, 161710, 157362.5, 161564.4, 161710.0, 161710.0, 0.05976786162544676, 17.77942129020883, 0.025389667780341157], "isController": false}, {"data": ["refresh data outdated", 10, 0, 0.0, 946.5, 508, 2520, 822.0, 2377.6000000000004, 2520.0, 2520.0, 1.0344470880314471, 6.137483675131892, 1.4647932398882797], "isController": false}, {"data": ["check legal email", 10, 2, 20.0, 4660.700000000001, 476, 26458, 1388.5, 24926.900000000005, 26458.0, 26458.0, 0.1618227717004337, 0.11654716223541976, 0.07711866463848793], "isController": false}, {"data": ["buscar producto iphone", 10, 1, 10.0, 82021.8, 51134, 154580, 69769.5, 152253.0, 154580.0, 154580.0, 0.045312429199329374, 16.10298417746613, 0.04818870644342743], "isController": false}, {"data": ["success", 10, 10, 100.0, 670.1, 438, 1635, 607.5, 1538.1000000000004, 1635.0, 1635.0, 1.4823599169878448, 1.4505123406463087, 1.5619788578416838], "isController": false}, {"data": ["simulacion de datos de entrega", 10, 10, 100.0, 967.4, 435, 4910, 493.5, 4491.300000000001, 4910.0, 4910.0, 0.7233273056057866, 0.4485476943942134, 1.9446485081374323], "isController": false}, {"data": ["first form", 10, 0, 0.0, 2203.1999999999994, 619, 10421, 1224.0, 9621.100000000002, 10421.0, 10421.0, 0.19238908769094618, 1.1019723789391664, 0.35152342096656275], "isController": false}, {"data": ["data of amount to pay", 10, 0, 0.0, 716.5, 487, 1624, 640.5, 1535.5000000000005, 1624.0, 1624.0, 1.2980269989615785, 7.712105724299065, 2.8622509410695742], "isController": false}, {"data": ["agregar producto al carrito", 10, 0, 0.0, 5745.2, 1464, 21536, 2485.0, 21205.2, 21536.0, 21536.0, 0.11604024275618784, 0.6379833620049432, 0.1513962542209638], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 10, 43.47826086956522, 7.6923076923076925], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: busca.oechsle.pe:443 failed to respond", 1, 4.3478260869565215, 0.7692307692307693], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: Host desconocido (api.oechsleonline.pe)", 1, 4.3478260869565215, 0.7692307692307693], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.oechsleonline.pe:443 failed to respond", 1, 4.3478260869565215, 0.7692307692307693], "isController": false}, {"data": ["500/Internal Server Error", 10, 43.47826086956522, 7.6923076923076925], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 130, 23, "400/Bad Request", 10, "500/Internal Server Error", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: busca.oechsle.pe:443 failed to respond", 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: Host desconocido (api.oechsleonline.pe)", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.oechsleonline.pe:443 failed to respond", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["check legal email", 10, 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: Host desconocido (api.oechsleonline.pe)", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.oechsleonline.pe:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["buscar producto iphone", 10, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: busca.oechsle.pe:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["success", 10, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["simulacion de datos de entrega", 10, 10, "400/Bad Request", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
