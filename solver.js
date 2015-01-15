/**
 * Created by Stephael on 11.01.2015.
 */

var steps = new Array();
var currStep = 0;
function solve(){
    steps = new Array();
    parseInput();

    //fill with values
    for(var i=0; i<9; i++)
    {
        for(var j=0; j<9; j++)
        {
            if(steps[0][i][j].length == 0)
            {
                steps[0][i][j] = [1,2,3,4,5,6,7,8,9];
            }
        }
    }

    var changed=true;
    var step = 0;
    while(changed)
    {
        changed = false;

        for(var i=0; i<9; i++)
        {
            for(var j=0; j<9; j++)
            {
                var length = steps[step][i][j].length;
                if(length > 1)
                {
                    steps[step][i][j] = steps[step][i][j].filter(
                        function(element)
                        {
                            var inRow = valuesInRow(i, steps[step]).indexOf(element);
                            var inCol = valuesInCol(j, steps[step]).indexOf(element);
                            var inCell = valuesInCell(Math.floor(j/3) +3*Math.floor(i/3), steps[step]).indexOf(element);
                            return inRow == -1 && inCol == -1 && inCell == -1;
                        }
                    );
                    if(length != steps[step][i][j].length)
                    {
                        changed = true;
                    }
                    if(steps[step][i][j].length == 1)
                    {
                        var copyArray = steps[step];
                        steps[step + 1] = JSON.parse(JSON.stringify(copyArray));
                        step += 1;
                    }
                }
            }
        }
    }

    tableCreation();
};

function tableCreation() {
    $("#curr").text(currStep + 1);
    $("#total").text(steps.length);

    $("table").remove();
    tableCreate(steps[currStep]);
}

function first()
{
    if(steps.length == 0)
        return;
    currStep = 0;
    tableCreation();
}

function next()
{
    if(steps.length == 0)
        return;
    currStep = Math.min(currStep + 1, steps.length - 1);
    tableCreation();
}

function prev()
{
    if(steps.length == 0)
        return;
    currStep = Math.max(currStep - 1, 0);
    tableCreation();
}

function last()
{
    if(steps.length == 0)
        return;
    currStep = steps.length-1;
    tableCreation();
}


function tableCreate(arr){
    var body = document.body;
    var tbl  = document.createElement('table');
    tbl.style.border = "1px solid black";
    tbl.style.textAlign = "center";
    tbl.style.borderCollapse = "collapse";
    for(var i = 0; i < 9; i++){
        var tr = tbl.insertRow();
        for(var j = 0; j < 9; j++){
            var td = tr.insertCell();
            td.innerHTML = parseLine(arr[i][j]);
            //td.appendChild(document.createTextNode(parseLine(arr[i][j])));
            td.style.border = "1px solid black";
            td.style.width = "60px";
            td.style.height = "60px";
        }
    }
    body.appendChild(tbl);
}

function parseLine(arr)
{
    var result = "";
    for(var i=0; i < arr.length; i++)
    {
        result += arr[i];
        if(i%3 == 2 && i>0)
        {
            result += "<br/>";
        }else if(i < arr.length-1)
        {
            result += ",";
        }


    }
    return result;
}

function isSolved(){
    var solved = false;



    solved = true;
    return solved;
}


function checkRow(row) {

    var values = new Array(10);

    for(var i = 0; i<9; i++)
    {
        var fieldVal = steps[0][row][i];

        if(fieldVal.length == 1)
        {
            if(values[fieldVal[0]] == null)
            {
                values[fieldVal[0]] = true;
            }
            else
            {
                alert("Die " + fieldVal[0] + " ist doppelt Eingetragen in Zeile " + (row + 1));
            }
        }
    }
}

function checkColumn(col) {
    var values = new Array(10);

    for(var i = 0; i<9; i++)
    {
        var fieldVal = steps[0][i][col];

        if(fieldVal.length == 1)
        {
            if(values[fieldVal[0]] == null)
            {
                values[fieldVal[0]] = true;
            }
            else
            {
                alert("Die " + fieldVal[0] + " ist doppelt Eingetragen in Spalte " + (col + 1));
            }
        }
    }
}

function checkCell(cell) {

    var values = new Array(10);

    for(var i = 0; i<3; i++)
    {
        for(var j = 0; j<3; j++)
        {
            var offsetRow = 3*Math.floor(cell/3);
            var offsetCol = 3*(cell%3);
            var fieldVal = steps[0][i + offsetRow][j + offsetCol];

            if(fieldVal.length == 1)
            {
                if(values[fieldVal[0]] == null)
                {
                    values[fieldVal[0]] = true;
                }
                else
                {
                    alert("Die " + fieldVal[0] + " ist doppelt Eingetragen in Zelle " + (cell + 1));
                }
            }
        }
    }
}

function valuesInCell(cell, arr) {
    var values = new Array(9);

    for(var i = 0; i<3; i++)
    {
        for(var j = 0; j<3; j++)
        {
            var offsetRow = 3*Math.floor(cell/3);
            var offsetCol = 3*(cell%3);
            var fieldVal = arr[i + offsetRow][j + offsetCol];

            if(fieldVal.length == 1)
            {
                values[fieldVal[0]] = fieldVal[0];
            }
        }
    }
    return values;
}

function valuesInRow(row, arr) {
    var values = new Array(9);

    for(var i = 0; i<9; i++)
    {
        var fieldVal = arr[row][i];

        if(fieldVal.length == 1)
        {
            values[fieldVal[0]] = fieldVal[0];
        }
    }
    return values;
}

function valuesInCol(col, arr) {

    var values = new Array(9);

    for(var i = 0; i<9; i++)
    {
        var fieldVal = arr[i][col];

        if(fieldVal.length == 1)
        {
            values[fieldVal[0]] = fieldVal[0];
        }
    }
    return values;
}

function parseInput(){
    var input = new Array();
    var line;
    $("input").each(function(index)
    {
        if(index % 9 == 0)
        {
            line = new Array();
            input.push(line);
        }
        var entry = $(this).val();
        if(entry != "")
        {
            line.push([parseInt(entry)]);
        }
        else
        {
            line.push([]);
        }
    });
    steps[0] = input;

    for(var i = 0; i<9; i++)
    {
        checkRow(i);
        checkColumn(i);
        checkCell(i);
    }
};



if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};