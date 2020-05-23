console.log('home script called');
let input = $('#search-box');
let completeData = [];
let currentData = [];
let noOfPages = 0;
let isAscending = true;
let chartData = [];

//charts


function drawChart() {
    var data = google.visualization.arrayToDataTable(chartData);

    var options = {
        title: chartData[0][0]
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}
//add click listener to all single-file-container objects
$('.single-file-container').each((index, object)=>{
    $(object).click(function (e) { 
        e.preventDefault();
        let sNoDivJQ = $('.sno', object);
        let fileName = sNoDivJQ.attr('id');
        $.ajax({
            type: "post",
            url: `/load-content`,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({'name': fileName}),          
            success: function(data) {
                currentData = data.data;
                completeData = data.data;
                noOfPages = Math.floor(completeData.length/100); 
                createTable(0);
                
            }, error: function(err) {
                console.log(err.responseText);
            }
        });
    });
});

let createHeadersRow = (singleRow)=>{
    let headers = [];
    let headersSortText = [];
    Object.keys(singleRow).forEach((key)=>{
        headers.push(key);
    })

    let tableRowTrBeg = '<tr class="table-headers">';
    let thRows = '';
    let thSortRows = '';
    let thShowCharts = '';
    for(let i=0; i<headers.length; i++){
        let header = headers[i];
        thRows += '<th>' + header + '</th>' ;;
        thSortRows += '<th>' + `<i class="fa fa-sort sort-icon" id=${header} aria-hidden="true"></i>` + `<i class="fa fa-bar-chart chart-icon" id=${header} aria-hidden="true"></i>` +'</th>';
        thShowCharts += '<th>' +  + '</th>';
    }
    
    let tableRowTrEnd = '</tr>';
    let headerRowOne = tableRowTrBeg + thRows + tableRowTrEnd;
    let headerRowTwo = tableRowTrBeg + thSortRows + tableRowTrEnd;
    // let headerRowThree = tableRowTrBeg + thShowCharts + tableRowTrEnd;
    return headerRowOne + headerRowTwo;
}

let createValuesRows = (allRowsData)=>{
    let allRowsStr = '';
    for(let singleRow of allRowsData){
        let tableRowTrBeg = '<tr class="single-row">';
        let tableRowTrEnd = '</tr>';
        let rowValues = '';
        Object.values(singleRow).forEach((value)=>{
            rowValues+= '<td>' + value + '</td>';
        })
        let singleRowString = tableRowTrBeg + rowValues + tableRowTrEnd;          
        allRowsStr += singleRowString;
    }
    return allRowsStr;
}

let createTable = (index, data)=>{
    let tableStringBeg = '<table id="file-table" style="width:100%">';
    let tableStringEnd = '</table>';
    let headerString = createHeadersRow(completeData[0]);
    let hundredRowData = [];
    let pageCount = 0;

    if(data==undefined && (currentData.length==completeData.length)){
        hundredRowData = pagination(index, completeData);
        pageCount = Math.floor((completeData.length)/100);
    }
    else{
        hundredRowData = pagination(index, currentData);
        pageCount = Math.floor((currentData.length)/100);
    }

    let valuesString = createValuesRows(hundredRowData);
    let tableString = tableStringBeg + headerString + valuesString + tableStringEnd;

    let fileContentContainer = $('#file-content-container');
    $(fileContentContainer).empty();
    fileContentContainer.append(tableString);
    createPaginationLinks(pageCount);

    $('.sort-icon').click((event)=>{
        sortFunction(event.target.id);
    });

    $('.chart-icon').click((event)=>{
        chartFunction(event.target.id);
    })

}

//Creating paginated links
let createPaginationLinks = (noOfPages)=>{
    let paginationStringBeg = '<div id="pagination-container">';
    let paginationIndices= '';
    let paginationStringEnd = '</div>';
    for(let i=1; i<=noOfPages; i++){
        paginationIndices+= `<div class="pagination-index" onclick="createTable(${i-1})">` + i + '</div>';
    }
    let paginationString = paginationStringBeg + paginationIndices + paginationStringEnd;
    let fileContentContainer = $('#file-content-container');
    fileContentContainer.append(paginationString);
}

//Front end search - Searching all columns
input.on('input', function(){
    let foundData = [];
    let text = input.val().toLowerCase();
    completeData.forEach((object)=>{
        let isContains = false;
        Object.entries(object).forEach(([key, value, array])=>{
            if(value.toLowerCase().includes(text)){
                isContains = true;
            }
        })
        if(isContains){
            foundData.push(object);
        }
    });
    currentData = foundData;
    createTable(0, foundData);
})


//For returning the 100 rows of data for a specified index
let pagination = (index, data) =>{
    let si = index*100;
    let paginatedData = [];
    for(let i=si; i<(si+100) && i<data.length; i++){
        if(data==undefined)
            paginatedData.push(completeData[i]);
        else
            paginatedData.push(data[i]);
    }
    return paginatedData;
}

let sortFunction = (header)=>{
    console.log("sort called");
    console.log(currentData.length);
    currentData.sort(getSortOrder(header));
    console.log(currentData);
    console.log(isAscending);
    isAscending = !isAscending;
    createTable(0, currentData);
}

let getSortOrder = (prop) => {    
    return (a, b)=> {
        let data1 = a[prop];
        let data2 = b[prop];
        
        let floatData1 = parseFloat(data1);
        let floatData2 = parseFloat(data2);

        if(!isNaN(floatData1) && !isNaN(floatData2)){
            data1 = floatData1;
            data2 = floatData2;
            
        }
        if(isAscending){
            if (data1 > data2) {    
                return 1;    
            } 
            else if (data1 < data2) 
            {    
                return -1;    
            }    
        }
        else{
            if (data1 > data2) {    
                return -1;    
            } 
            else if (data1 < data2) 
            {    
                return 1;    
            }    
        }
        return 0;    
    }    
} 

let chartFunction = (prop)=>{
    console.log('chart func called on ' + prop);
    let array = [];
    let obj = {};
    for(let i=0; i<currentData.length; i++){
        let key = currentData[i][prop];
        if(obj[key]==undefined)
            obj[key] = 1;
        else
            obj[key] = obj[key]+1;
    }
    array.push([prop, 'count']);
    Object.entries(obj).forEach(([key, value, index])=>{
        let singleArr = [];
        // console.log(`${key}: ${value}`);
        singleArr.push(key);
        singleArr.push(value);
        array.push(singleArr);
    })

    console.log(array);
    chartData = array;
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}

