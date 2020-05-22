console.log('home script called');
let input = $('#search-box');
let allData = [];
let noOfPages = 0;

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
                allData = data.data;
                noOfPages = Math.floor(allData.length/100); 
                console.log(noOfPages);
                createTable(0);

            }, error: function(err) {
                console.log(err.responseText);
            }
        });
    });
});

let createHeadersRow = (singleRow)=>{
    let headers = [];
    Object.keys(singleRow).forEach((key)=>{
        headers.push(key);
    })
    let tableRowTrBeg = '<tr id="table-headers">';
    let thRows = '';
    for(let header of headers){
        thRows += '<th>' + header + '</th>';
    }
    let tableRowTrEnd = '</tr>';
    let headerRow = tableRowTrBeg + thRows + tableRowTrEnd;
    return headerRow;
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

let createTable = (index)=>{
    let tableStringBeg = '<table id="file-table" style="width:100%">';
    let tableStringEnd = '</table>';
    let headerString = createHeadersRow(allData[0]);
    let hundredRowData = pagination(index);
    let valuesString = createValuesRows(hundredRowData);
    let tableString = tableStringBeg + headerString + valuesString + tableStringEnd;

    let fileContentContainer = $('#file-content-container');
    $(fileContentContainer).empty();
    fileContentContainer.append(tableString);
    createPaginationLinks(noOfPages);
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
    let text = input.val().toLowerCase();
    let allRows = $('.single-row');
    allRows.each((index, row)=>{
        let isContains = false;
        $('td', row).each(function() {
            let tdContent = $(this).html().toLowerCase();
            if(tdContent.includes(text)){
                isContains = true;
            }
        });
        if(isContains){
            $(row).show();
        }
        else{
            $(row).hide();
        }
    });
})


//For returning the 100 rows of data for a specified index
let pagination = (index) =>{
    let si = index*100;
    let paginatedData = [];
    for(let i=si; i<(si+100); i++){
        paginatedData.push(allData[i]);
    }
    return paginatedData;
}