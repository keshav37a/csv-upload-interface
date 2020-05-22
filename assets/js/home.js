console.log('home script called');
let input = $('#search-box');
let completeData = [];
let currentData = [];
let searchedData = [];
let noOfPages = 0;
let isAscending = true;

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

    // <tr id="table-headers">
    //     <div class="header-container">
    //         <th>header</th>
    //         <img class="sort-icon" src="https://image.flaticon.com/icons/svg/565/565620.svg" onclick="sort()"/>
    //     </div>        
    // </tr>

    let tableRowTrBeg = '<tr class="table-headers">';
    let thRows = '';
    let thSortRows = '';
    for(let i=0; i<headers.length; i++){
        let header = headers[i];
        thRows += '<th>' + header + '</th>' ;;
        thSortRows += '<th>' + `<i class="fa fa-sort sort-icon" id=${header} aria-hidden="true"></i>` + '</th>';
    }
    
    let tableRowTrEnd = '</tr>';
    let headerRowOne = tableRowTrBeg + thRows + tableRowTrEnd;
    let headerRowTwo = tableRowTrBeg + thSortRows + tableRowTrEnd;
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

    // console.log(hundredRowData);
    let valuesString = createValuesRows(hundredRowData);
    let tableString = tableStringBeg + headerString + valuesString + tableStringEnd;

    let fileContentContainer = $('#file-content-container');
    $(fileContentContainer).empty();
    fileContentContainer.append(tableString);
    createPaginationLinks(pageCount);

    $('.sort-icon').click((event)=>{
        sortFunction(event.target.id);
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
    // console.log('oninput called');
    let foundData = [];
    let text = input.val().toLowerCase();
    completeData.forEach((object)=>{
        // console.log(object);
        let isContains = false;
        Object.entries(object).forEach(([key, value, array])=>{
            // console.log(value);
            if(value.toLowerCase().includes(text)){
                isContains = true;
                // console.log(value);
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
    // console.log(currentData[0][header]);
    for(let i=0; i<currentData.length; i++){
        for(let j=0; j<currentData.length-1-i; j++){
            if(isAscending && currentData[j][header]>currentData[j+1][header])
                swapFunction(currentData, j, j+1);
            else if(!isAscending && currentData[j][header]<currentData[j+1][header])
                swapFunction(currentData, j+1, j);
        }
    }
    console.log(currentData);
    isAscending = !isAscending;
    createTable(0, currentData);
}

let swapFunction = (array, i, j)=>{
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

