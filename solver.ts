/// <reference path="typings/jquery/jquery.d.ts" />
// /*jslint browser: true*/
/*global $, jQuery, alert*/

/**
 * Created by Stephael on 11.01.2015.
 */

var steps = [];
var currStep = 0;

function tableCreate(arr) {
    "use strict";
    var td,
        tr,
        body = document.body,
        tbl = document.createElement('table'),
        i,
        j;

    for (i = 0; i < 9; i += 1) {
        tr = tbl.insertRow();
        for (j = 0; j < 9; j += 1) {
            td = tr.insertCell();
            td.innerHTML = parseLine(arr[i][j]);
        }
    }
    body.appendChild(tbl);
}

function deleteTableAndCreateNew() {
    "use strict";
    $("#curr").text(currStep + 1);
    $("#total").text(steps.length);

    $("table").remove();
    tableCreate(steps[currStep]);
}

function getCell(row : number, col : number) {
    "use strict";
    return Math.floor(col / 3) + 3 * Math.floor(row / 3);
}

function countFree(row : number, col : number, arr): Array<Set<number>> {
    "use strict";
    var offsetCol: number,
        offsetRow: number,
        cell: number,
        values = new Array(3),
        i: number,
        j: number;

    for (i = 0; i < values.length; i += 1) {
        values[i] = new Array(10);
        for (j = 0; j < values[i].length; j += 1) {
            values[i][j] = 0;
        }
    }

    for (i = 0; i < 9; i += 1) {
        arr[row][i].forEach(
            (currentValue, index, valueSet: Set<number>) => {
                if (valueSet.size > 1) {
                    values[0][currentValue] += 1;
                }
            }
        );
        arr[i][col].forEach(
            (currentValue: number, index: number, valueSet: Set<number>) => {
                if (valueSet.size > 1) {
                    values[1][currentValue] += 1;
                }
            }
        );
    }
    for (i = 0; i < 3; i += 1) {
        for (j = 0; j < 3; j += 1) {

            cell = getCell(row, col);
            offsetRow = 3 * Math.floor(cell / 3);
            offsetCol = 3 * (cell % 3);
            arr[i + offsetRow][j + offsetCol].forEach((currentValue: number, index: number, valueSet: Set<number>) => {
                if (valueSet.size > 1) {
                    values[2][currentValue] += 1;
                }
            });
        }
    }
    return values;
}

// Validations

function validateRow(row : number) {
    "use strict";
    var fieldVal: Set<number>,
        values: Set<number> = new Set(),
        i;

    for (i = 0; i < 9; i += 1) {
        fieldVal = steps[0][row][i];

        if (fieldVal.size === 1) {
            fieldVal.forEach(value => {
                if (values.has(value)) {
                    alert("Die " + value + " ist doppelt Eingetragen in Zeile " + (row + 1));
                }
                values.add(value);
            });
        }
    }
}

function validateColumn(col : number) {
    "use strict";
    var fieldVal: Set<number>,
        values: Set<number> = new Set(),
        i;

    for (i = 0; i < 9; i += 1) {
        fieldVal = steps[0][i][col];

        if (fieldVal.size === 1) {
            fieldVal.forEach(value => {
                if (values.has(value)) {
                    alert("Die " + value + " ist doppelt Eingetragen in Spalte " + (col + 1));
                }
                values.add(value);
            });
        }
    }
}

function validateCell(cell: number) {
    "use strict";
    var values: Set<number> = new Set(),
        i: number,
        j: number,
        offsetRow: number,
        offsetCol: number,
        fieldVal: Set<number>;

    for (i = 0; i < 3; i += 1) {
        for (j = 0; j < 3; j += 1) {
            offsetRow = 3 * Math.floor(cell / 3);
            offsetCol = 3 * (cell % 3);
            fieldVal = steps[0][i + offsetRow][j + offsetCol];

            if (fieldVal.size === 1) {
                fieldVal.forEach(value => {
                    if (values.has(value)) {
                        alert("Die " + value + " ist doppelt Eingetragen in Zelle " + (cell + 1));
                    }
                    values.add(value);
                });
            }
        }
    }
}


function valuesInCell(cell : number, arr) {
    "use strict";
    var values: Set<number> = new Set<number>(),
        i: number,
        j: number,
        offsetRow: number = 3 * Math.floor(cell / 3),
        offsetCol: number = 3 * (cell % 3),
        fieldVal: Set<number>;
    
    for (i = 0; i < 3; i += 1) {
        for (j = 0; j < 3; j += 1) {
            
            fieldVal = arr[i + offsetRow][j + offsetCol];

            if (fieldVal.size === 1) {
                fieldVal.forEach(value => {
                    values.add(value);
                });
            }
        }
    }
    return values;
}

function valuesInRow(row : number, arr) {
    "use strict";
    var values: Set<number> = new Set(),
        i: number,
        fieldVal: Set<number>;

    for (i = 0; i < 9; i += 1) {
        fieldVal = arr[row][i];

        if (fieldVal.size === 1) {
            fieldVal.forEach(value => {
                values.add(value);
            });
        }
    }
    return values;
}

function valuesInCol(col : number, arr) {
    "use strict";
    var values: Set<number> = new Set(),
        i: number,
        fieldVal: Set<number>;

    for (i = 0; i < 9; i += 1) {
        fieldVal = arr[i][col];

        if (fieldVal.size === 1) {
            fieldVal.forEach(value => {
                values.add(value);
            });
        }
    }
    return values;
}

function parseLine(numberSet: Set<number>) {
    "use strict";
    var result = "",
        index: number = 0;

    numberSet.forEach(value => {
        result += value.toString(10);
        if (index % 3 === 2 && index > 0) {
            result += "<br/>";
        } else if (index < numberSet.size - 1) {
            result += ",";
        }
        index += 1;
    });
    
    return result;
}

function parseInput() {
    "use strict";
    var input = [],
        line,
        i: number;
    $("input").each(function (index) {
        if (index % 9 === 0) {
            line = [];
            input.push(line);
        }
        var entry = $(this).val(),
            valueSet: Set<number> = new Set<number>();
        if (entry !== "") {
            valueSet.add(parseInt(entry, 10));
            line.push(valueSet);
        } else {
            line.push(new Set<number>());
        }
    });
    steps[0] = input;

    for (i = 0; i < 9; i += 1) {
        validateRow(i);
        validateColumn(i);
        validateCell(i);
    }
}

function isInRow(element : number, row : number, arr) : boolean {
    "use strict";
    return valuesInRow(row, arr).has(element);
}

function isInColumn(element : number, column : number, arr) : boolean {
    "use strict";
    return valuesInCol(column, arr).has(element);
}

function isInCell(element : number, cell : number, arr) : boolean {
    "use strict";
    return valuesInCell(cell, arr).has(element);
}

function cloneArray(arr) {
    var i,
        j,
        returnArray: Array<Array<Set<number>>> = new Array(9);
        
    

    for (i = 0; i < 9; i += 1) {
        returnArray[i] = new Array(9);

        for (j = 0; j < 9; j += 1) {
            returnArray[i][j] = new Set<Number>();

            arr[i][j].forEach(value => {
                returnArray[i][j].add(value);
            });
        }
    }
    return returnArray;
}

function reducePossibleEntries() {
    var changed: boolean = false,
        i: number,
        j: number,
        length: number,
        step: number = steps.length - 1,
        tempSet: Set<number> = new Set<number>();

    for (i = 0; i < 9; i += 1) {
        for (j = 0; j < 9; j += 1) {
            length = steps[step][i][j].size;
            tempSet.clear();
            if (length > 1) {
                steps[step][i][j].forEach(
                    (element) => {
                        var inRow = isInRow(element, i, steps[step]),
                            inCol = isInColumn(element, j, steps[step]),
                            inCell = isInCell(element, getCell(i, j), steps[step]);
                        if (inRow || inCol || inCell) {
                            tempSet.add(element);
                        }
                    });

                tempSet.forEach(element => {
                    steps[step][i][j].delete(element);
                });

                if (length !== steps[step][i][j].size) {
                    changed = true;
                }
                if (steps[step][i][j].size === 1) {
                    steps[step + 1] = steps[step];
                    steps[step] = cloneArray(steps[step]);
                    step += 1;
                }
            }
        }
    }
    return changed;
}

function onlyPossibleEntry() {
    "use strict";
    var nums: Array<Set<number>>,
        i: number,
        j: number,
        changed: boolean = false,
        step: number = steps.length - 1;

    for (i = 0; i < 9; i += 1) {
        for (j = 0; j < 9; j += 1) {
            if (steps[step][i][j].length !== 1) {
                nums = countFree(i, j, steps[step]);

                nums.forEach(function (value) {
                    var innerCount = 0,
                        innerValues = new Set<Number>(); 
                    value.forEach(function (val) {

                        if (value.size === 1) {
                            if (steps[step][i][j].has(val)) {
                                innerCount += 1;
                                innerValues.add(val);
                            }
                        }
                    });
                    if (innerCount === 1) {
                        changed = true;
                        steps[step][i][j] = innerValues;
                        steps[step + 1] = steps[step];
                        steps[step] = cloneArray(steps[step]);
                        step += 1;
                    }
                });
            }
            if (changed) {
                break;
            }
        }
        if (changed) {
            break;
        }
    }
    return changed;
}

function unionInRow(row : number, setSize : number, arr) {

    var i: number,
        j: number,
        length: number,
        positionLength: number;

    for (i = 0; i < 9; i += 1) {
        length = arr[row][i].size;
        if (length <= setSize) {
            for (j = 0; j < 9; j += 1) {
                if (i !== j) {
                    positionLength = arr[row][j].size;
                    if (positionLength <= setSize) {


                    }
                }
            }
        }
    }
}


function reduceByUnion() {
    "use strict";

    var i: number,
        j: number,
        step: number = steps.length - 1;

    for (i = 0; i < 9; i += 1) {
        for (j = 2; j < 9; j += 1)
        unionInRow(i, j, steps[step]);
        //unionInColumn(i, j, steps[step]);
        //unionInCell(i, j, steps[step]);
    }

}

function solve() {
    "use strict";
    var i: number,
        j: number,
        k: number,
        changed = true;

    steps = [];
    parseInput();

    //fill with default values
    for (i = 0; i < 9; i += 1) {
        for (j = 0; j < 9; j += 1) {
            if (steps[0][i][j].size === 0) {
                var values = new Set<number>();
                
                for (k = 1; k <= 9; k += 1) {
                    values.add(k);    
                }
                
                steps[0][i][j] = values;
            }
        }
    }

    while (changed) {
        changed = reducePossibleEntries();
        if (changed === false) {
            changed = onlyPossibleEntry();
        }
        if (changed === false) {
            //changed = reduceByUnion();
        }
    }
    deleteTableAndCreateNew();
}

function reset() {
    "use strict";
    steps = [];
    currStep = 0;

    $("#curr").text(0);
    $("#total").text(0);

    $("table").remove();
    $("input").each(function () {
        $(this).val("");
    });
}

function displayFirstStep() {
    "use strict";
    if (steps.length === 0) {
        return;
    }
    currStep = 0;
    deleteTableAndCreateNew();
}

function displayNextStep() {
    "use strict";
    if (steps.length === 0) {
        return;
    }
    currStep = Math.min(currStep + 1, steps.length - 1);
    deleteTableAndCreateNew();
}

function displayPreviousStep() {
    "use strict";
    if (steps.length === 0) {
        return;
    }
    currStep = Math.max(currStep - 1, 0);
    deleteTableAndCreateNew();
}

function displayLastStep() {
    "use strict";
    if (steps.length === 0) {
        return;
    }
    currStep = steps.length - 1;
    deleteTableAndCreateNew();
}

$(document).keydown(function(evt) {
    "use strict";
    switch (evt.keyCode) {
    case 37:    // left
        displayPreviousStep();
        break;
    case 39:    // right
        displayNextStep();
        break;
    case 13:    // return
        solve();
        break;
    case 82:    // r
        reset();
        break;
    default:
        break;
    }
});