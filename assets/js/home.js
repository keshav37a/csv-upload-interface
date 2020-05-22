console.log('home script called');

//add click listener to all single-file-container objects
$(' .single-file-container').each((index, object)=>{
    console.log($(object));
    $(object).click(function (e) { 
        e.preventDefault();
        let sNoDivJQ = $('.sno', object);
        let fileName = sNoDivJQ.attr('id');
        console.log(fileName);
        $.ajax({
            type: "post",
            url: `/load-content`,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({'name': fileName}),          
            success: function(data) {
                let tableStringBeg = '<table style="width:100%">';
                let tableStringEnd = '</table>';

                let headerString = createHeadersRow(data.data[0]);
                let valuesString = createValuesRows(data.data);

                let tableString = tableStringBeg + headerString + valuesString + tableStringEnd;

                let fileContentContainer = $('#file-content-container');
                $(fileContentContainer).empty();
                fileContentContainer.append(tableString);

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
    console.log(allRowsStr);
    return allRowsStr;
}