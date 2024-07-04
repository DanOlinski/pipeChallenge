//this app works with nde v16 or higher
//the logic of this app consists of 5 steps
//Step1: determine what the app considers to be a pipe, by storing all options for pipes in the mappedPipes object
//Step2: determine the coordinates for all of the openings of each pipe. The way this is done is by determining coordinates for each opening of each pipe as if the pipe were located at coordinates 0,0 this information is stored in the mappedPipes object. Next, compare each pipe to the elements passed in through the function argument (named matrix). Finally the coordinates of the pipe opening (located in the mappedPipes) are added to the coordinates of the pipe that is located in the matrix. That way the coordinates of each opening will coincide with the coordinates of any item(from the matrix argument) that is directly next to the pipe opening, making it possible for the app to identify what is connected to the system
//Step3: checking the provided matrix for what is connected to the source.
//trigger a recursion passing in the item that is connected to the source as the current source argument (named sourceInfo in the getConnectedPipe function)
//Step4: at each recursion of the getConnectedPipe function, when a sink (represented by a letter) is determined to be connected to the pipe system source, add that letter to the final answer
const sinkSystem = (filePath) => {
  //letters for the final answer will be added to this variable
  let finalAnswer = '';

  //this object contains the index of all items checked, the items are added to this object at every iteration getConnectedPipe function, in order to avoid the pipe system from adding duplicate letters to the final answer especially for a case where the pipe system is in a loop
  let checkedItems = {
    //index<index of item>: checked
  };

  //the content of this object determines what this app considers to be a pipe
  let mappedPipes = {
    '╠': { 'opening1': [1, 0], 'opening2': [0, 1], 'opening3': [0, -1] },
    '╣': { 'opening1': [-1, 0], 'opening2': [0, 1], 'opening3': [0, -1] },
    '╗': { 'opening1': [-1, 0], 'opening2': [0, -1] },
    '╚': { 'opening1': [1, 0], 'opening2': [0, 1] },
    '╔': { 'opening1': [1, 0], 'opening2': [0, -1] },
    '╝': { 'opening1': [-1, 0], 'opening2': [0, 1] },
    '═': { 'opening1': [-1, 0], 'opening2': [1, 0] },
    '║': { 'opening1': [0, +1], 'opening2': [0, -1] },
    '╦': { 'opening1': [-1, 0], 'opening2': [1, 0], 'opening3': [0, -1] },
    '╩': { 'opening1': [-1, 0], 'opening2': [1, 0], 'opening3': [0, 1] }
  };

  //convert incoming data into a matrix array data format
  let matrix = [];
  let checkedCount = 0;
  const convertRawData = (index, rawData) => {
    let row = [];

    for (let i = index; i < rawData.length; i++) {
      checkedCount += 1;
      if (checkedCount > rawData.length) {
        return;
      }

      let letterBoolean = checkIfIconIsALetter(rawData[i]);
      let sourceBoolean = (rawData[i] === '*');
      let numberBoolean = (Number(rawData[i]) || rawData[i] === '0');
      let pipeBoolean = false;

      for (let pipe of Object.keys(mappedPipes)) {
        if (pipe === rawData[i]) {
          pipeBoolean = true;
        }
      }

      if (pipeBoolean || letterBoolean || sourceBoolean || numberBoolean) {

        if (row.length < 3) {
          if (numberBoolean) {
            row.push(Number(rawData[i]));
          } else {
            row.push(rawData[i]);
          }
        }

        if (row.length === 3) {
          matrix.push(row);
          convertRawData(checkedCount, rawData);
        }
      }
    }
  };

  //check if matrix has a starting point by checking if there is an "*"
  const getInitialSource = (matrix) => {

    //use a C loop in order to access the index where the "*" is located
    for (let row = 0; row < matrix.length; row++) {
      if (matrix[row][0] === "*") {

        //store all important information of the source to be used by other functions
        const initialSource = {
          'index': row,
          'icon': matrix[row][0],
          'matrixCoordinates': [matrix[row][1], matrix[row][2]]
        };
        return initialSource;
      }
    }
    return "there is no * in the matrix";
  };

  //find all pipes in the matrix coming in through the argument. 
  //In order to find the coordinates of all pipe openings in the provided matrix this function will first identify all pipes in the matrix. 
  const compareMapAndMatrixIcons = (matrix, mappedPipes) => {
    let final = [];

    //loop through matrix rows with a C loop in order to easily access the index
    for (let pipeInMatrix = 0; pipeInMatrix < matrix.length; pipeInMatrix++) {
      let matrixIcons = matrix[pipeInMatrix][0];
      let matrixIconIndex = pipeInMatrix;

      //loop through pipe map to compare items from the matrix with items in the mappedPipes(what is in the mappedPipes is what this app considers to be a pipe)
      for (const mappedPipeIconMatrix in mappedPipes) {

        //check if there are pipe icons in the matrix, add important info to the final answer that will ba accessed by the function getPipeInfo, the getPipeInfo will hold important information that will be accessed many times during the app's runtime
        if (matrixIcons === mappedPipeIconMatrix) {
          final.push({
            'matrixIndex': matrixIconIndex,
          });
        }
      }
    }

    //if there are pipes in the matrix, return an array with all of those pipes
    if (final.length > 0) {
      return final;
    }
    //if there are no pipes in the matrix return a notice
    return 'there are no pipes in the matrix';
  };

  //store all necessary info in an object
  const getPipeInfo = (pipesInMatrix, mappedPipes) => {

    //the object below demonstrates the structure of the object that will be returned in the final answer
    const pipeInfo = {
      // pipe<index>: {
      // 'index': ,
      // 'icon': ,
      // 'matrixCoordinates': ,
      // 'mapCoordinates': {opening1: , opening2:, opening3: },
      // 'openingCoordinatesInMatrix': {opening1: , opening2:, opening3: }
      // }
    };

    //loop through pipes in the matrix to retrieve necessary information
    //the loop is a C loop in order to remove the 1st item of the array since the 1st value is the "*", and we are not using the info from the "*" for this function
    for (let pipeInMatrix = 0; pipeInMatrix < pipesInMatrix.length; pipeInMatrix++) {

      let pipeIndex = pipesInMatrix[pipeInMatrix]['matrixIndex'];
      let pipeIconMatrix = matrix[pipesInMatrix[pipeInMatrix]['matrixIndex']][0];
      let pipeCoordinatesInMatrix = [matrix[pipesInMatrix[pipeInMatrix]['matrixIndex']][1], matrix[pipesInMatrix[pipeInMatrix]['matrixIndex']][2]];

      //some pipes have 2 openings other pipes have 3 openings, below some variables are defined to then be places in the final object
      let pipeOpeningCoordinatesInMap = {
        opening1: mappedPipes[pipeIconMatrix]['opening1'],
        opening2: mappedPipes[pipeIconMatrix]['opening2'],
      };
      if (Object.keys(mappedPipes[pipeIconMatrix]).length > 2) {
        pipeOpeningCoordinatesInMap.opening3 = mappedPipes[pipeIconMatrix]['opening3'];
      }

      //setting variables for the coordinates(in the matrix) of the openings of all pipes 
      let matrixOpeningXCoordinates1 = pipeOpeningCoordinatesInMap.opening1[0] + pipeCoordinatesInMatrix[0];
      let matrixOpeningYCoordinates1 = pipeOpeningCoordinatesInMap.opening1[1] + pipeCoordinatesInMatrix[1];

      let matrixOpeningXCoordinates2 = pipeOpeningCoordinatesInMap.opening2[0] + pipeCoordinatesInMatrix[0];
      let matrixOpeningYCoordinates2 = pipeOpeningCoordinatesInMap.opening2[1] + pipeCoordinatesInMatrix[1];

      let pipeMatrixOpeningCoordinates = {
        opening1: [matrixOpeningXCoordinates1, matrixOpeningYCoordinates1],
        opening2: [matrixOpeningXCoordinates2, matrixOpeningYCoordinates2],
      };
      if (Object.keys(mappedPipes[pipeIconMatrix]).length > 2) {
        let matrixOpeningXCoordinates3 = pipeOpeningCoordinatesInMap.opening3[0] + pipeCoordinatesInMatrix[0];
        let matrixOpeningYCoordinates3 = pipeOpeningCoordinatesInMap.opening3[1] + pipeCoordinatesInMatrix[1];

        pipeMatrixOpeningCoordinates.opening3 = [matrixOpeningXCoordinates3, matrixOpeningYCoordinates3];
      }

      let newPipeTittle = 'pipe' + (Number(pipeIndex));



      pipeInfo[newPipeTittle] = {
        'index': pipeIndex,
        'icon': pipeIconMatrix,
        'matrixCoordinates': pipeCoordinatesInMatrix,
        'mapCoordinates': pipeOpeningCoordinatesInMap,
        'openingCoordinatesInMatrix': pipeMatrixOpeningCoordinates
      };


    }

    //return something different if there are no pipes in the matrix
    return pipeInfo;
  };

  //return true or false if coordinates are the same or not
  const compareCoordinates = (arr1, arr2) => {
    if (arr1[0] === arr2[0] && arr1[1] === arr2[1]) {
      return true;
    }
    return false;
  };

  //return true or false if the provided icon is an alphabetic letter or not
  const checkIfIconIsALetter = (icon) => {
    let regex = /^[a-zA-Z]+$/;

    //if icon is a letter return true
    if (regex.test(icon)) {
      return true;
    }

    //if icon is not a letter return false
    return false;
  };

  //this function looks at all coordinates around a given element and returns all elements that are adjacent to it
  const checkAllAdjacentElements = (matrix, mainElementIndex, previousSource) => {
    let finalArray = [
      // {index: ,
      // icon: ,
      // matrixCoordinates:} 
    ];

    const north = [matrix[mainElementIndex][1], matrix[mainElementIndex][2] + 1];
    const south = [matrix[mainElementIndex][1], matrix[mainElementIndex][2] - 1];
    const east = [matrix[mainElementIndex][1] + 1, matrix[mainElementIndex][2]];
    const west = [matrix[mainElementIndex][1] - 1, matrix[mainElementIndex][2]];

    const adjacentCoordinates = [north, south, east, west];

    //loop through matrix to find all coordinates adjacent to the mainElement
    //this first loop goes through all coordinates of elements in the matrix
    for (let elementIndex = 0; elementIndex < matrix.length; elementIndex++) {
      const row = matrix[elementIndex];
      const coordinate = [row[1], row[2]];

      //this second loop goes through all of the coordinates that are adjacent to the mainElement
      for (const adjacentOption of adjacentCoordinates) {

        //if any element in the matrix has coordinates that match one of the coordinate pairs that is adjacent to the source, place that icon in the finalArray
        if (compareCoordinates(adjacentOption, coordinate)) {

          //there might be a case where a sink is connected to another sink, in that case the function getAllConnections will enter a infinite loop, since it will loop for an adjacent sink, find the previous sink it already processed trigger a recursion and find the same adjacent sink infinitely.
          //to prevent this, the conditional below checks if the previousSource has the same index as an adjacent element and skips adding the info for that element into the finalArray 
          if (previousSource) {
            if (previousSource['index'] === elementIndex) {

              //skip adding info to the finalArray
            } else {
              finalArray.push({
                index: elementIndex,
                icon: row[0],
                matrixCoordinates: coordinate
              });
            }
          } else {
            finalArray.push({
              index: elementIndex,
              icon: row[0],
              matrixCoordinates: coordinate
            });
          }
        }
      }
    }
    return finalArray;
  };

  //based on a pipe that is connected to a source of flow, return an array with all openings where the flow exits. 
  //the return array will not contain the opening that is connected to the given source.
  const getOutflowOpenings = (sourceCoordinates, connectedPipe) => {
    let finalArr = [];

    //determine the coordinates of the opening of the provided pipe
    const opening1 = connectedPipe['openingCoordinatesInMatrix']['opening1'];
    const opening2 = connectedPipe['openingCoordinatesInMatrix']['opening2'];

    //before adding the coordinates of an opening to finalArr the 3 conditionals below check that the opening is not connected to the source, since this function is designed to only provide the openings that are not connected to the source 
    if (!compareCoordinates(sourceCoordinates, opening1)) {
      finalArr.push(opening1);
    }

    if (!compareCoordinates(sourceCoordinates, opening2)) {
      finalArr.push(opening2);
    }

    //not all pipes contain 3 openings so before running a conditional for the third opening, check if there is a 3rd opening for the pipe that is passed in through function argument
    if (connectedPipe['openingCoordinatesInMatrix']['opening3']) {

      const opening3 = connectedPipe['openingCoordinatesInMatrix']['opening3'];

      if (!compareCoordinates(sourceCoordinates, opening3)) {
        finalArr.push(opening3);
      }
    }
    return finalArr;
  };

  //check if a given character is a pipe (the object mappedPipes contains a list of characters for what this application considers to be a pipe)
  const checkIfItsAPipe = (icon) => {

    //loop through pipe map, to compare icon with the list of what this app considers to be a pipe
    for (const pipe in mappedPipes) {

      //check if icon is equal to one of the pipes in the mappedPipes return true
      if (icon === pipe) {
        return true;
      }
    }
    return false;
  };

  const getConnectedPipe = (matrix, pipeInfo, sourceInfo, previousSource) => {
    let sourceRow = matrix[sourceInfo['index']];
    let sourceCoordinates = sourceInfo['matrixCoordinates'];
    let sourceIcon = sourceRow[0];
    let checkedItem = 'index' + sourceInfo['index'];

    //at every iteration of this recursion function add the index of elements that have already been processed to the checkedItems object, this is done to prevent sinks from being added to the final answer more than once
    checkedItems[`${checkedItem}`] = 'checked';

    //check if source argument is "*" or a sink(letter)
    //if source argument is the starting point (defined by "*") or a sink (defined by a capital letter), find all elements adjacent to the source argument
    if (sourceInfo['icon'] === "*" || checkIfIconIsALetter(sourceIcon)) {

      const adjacentElements = checkAllAdjacentElements(matrix, sourceInfo['index'], previousSource);

      //if there is nothing connected to the source, terminate the application from continuing to run, then return the message below
      if (sourceInfo['icon'] === "*" && adjacentElements.length === 0) {
        finalAnswer = 'there is nothing connected to the source';
        return 'there is nothing connected to the source';
      }

      //loop through all adjacent elements to check if adjacent icon is either a letter or a pipe
      for (const adjacentElement of adjacentElements) {
        const adjacentElementIcon = adjacentElement['icon'];

        //if adjacent icon is a letter add that letter to the final answer, and run the getConnectedPipe function as a recursion with a new source passed in through the argument

        //here we are also checking if the adjacent element has already ben added to the final answer. At every iteration of this recursion function the index of processed elements are added to an object called checkedItems
        if (checkIfIconIsALetter(adjacentElementIcon) &&
          !(checkedItems['index' + `${adjacentElement['index']}`])
        ) {

          finalAnswer += adjacentElementIcon;
          getConnectedPipe(matrix, pipeInfo, adjacentElement, sourceInfo);
        }

        //if icon adjacent to the source is not a letter, check if it's a pipe
        if (checkIfItsAPipe(adjacentElementIcon)) {

          //loop through pipeInfo in order to compare source coordinates with the coordinates of one of the openings of any pipe inside pipeInfo in order to determine if the adjacent pipe is indeed connected to the source. 
          for (const pipe in pipeInfo) {
            let objectLength = Object.keys(pipeInfo[pipe]['openingCoordinatesInMatrix']).length;
            let opening1 = pipeInfo[pipe]['openingCoordinatesInMatrix']['opening1'];
            let opening2 = pipeInfo[pipe]['openingCoordinatesInMatrix']['opening2'];

            //If there is a pipe with an opening facing the source, trigger a recursion for getConnectedPipe function, to check for any subsequent sink or pipe that might be connected to the pipe that is connected to the source

            //if the pipe found has the same index of the previously processed pipe, skip this pipe in order to avoid processing data that has already been analyzed
            if (previousSource['index'] === pipeInfo[pipe]['index']) {
              //do nothing if conditional above is true
            }

            else if (compareCoordinates(sourceCoordinates, opening1)) {
              getConnectedPipe(matrix, pipeInfo, pipeInfo[pipe], sourceInfo);
            }

            else if (compareCoordinates(sourceCoordinates, opening2)) {
              getConnectedPipe(matrix, pipeInfo, pipeInfo[pipe], sourceInfo);
            }

            //not all pipes have 3 openings, only check if the 3rd opening is connected to the source if there is in fact a 3rd opening in the pipe
            else if (objectLength === 3) {
              const opening3 = pipeInfo[pipe]['openingCoordinatesInMatrix']['opening3'];
              if (compareCoordinates(sourceCoordinates, opening3)) {

                getConnectedPipe(matrix, pipeInfo, pipeInfo[pipe], sourceInfo);
              }
            }
          }
        }
      }
    }

    //if source is a pipe
    if (checkIfItsAPipe(sourceIcon)) {

      //find all openings of that pipe (excluding the opening that is facing the source)
      const previousSourceCoordinates = previousSource['matrixCoordinates'];
      const connectedPipeKey = 'pipe' + sourceInfo['index'];
      const connectedPipe = pipeInfo[connectedPipeKey];
      //get an array with all exit openings of source pipe
      const outflowArr = getOutflowOpenings(previousSourceCoordinates, connectedPipe);

      //loop through all openings found in outflowArr to check what is located next to each exit opening
      for (let outflow of outflowArr) {

        //loop through matrix to find what is located next to the pipe openings
        for (let index = 0; index < matrix.length; index++) {
          const coordinatesOfMatrixItems = [matrix[index][1], matrix[index][2]];

          //this conditional checks if there is an item located in front of the pipe opening
          if (compareCoordinates(outflow, coordinatesOfMatrixItems)) {
            const adjacentIcon = matrix[index][0];

            //if what is next to the opening is a letter, add that letter to the final answer and trigger a recursion of getConnectedPipe

            //here we are also checking if the adjacent element has already ben added to the final answer. At every iteration of this recursion function the index of processed elements are added to an object called checkedItems
            if (checkIfIconIsALetter(adjacentIcon) && !(checkedItems['index' + `${index}`])) {
              const adjacentElement = {
                index: index,
                icon: adjacentIcon,
                matrixCoordinates: [matrix[index][1], matrix[index][2]]
              };

              finalAnswer += adjacentIcon;
              getConnectedPipe(matrix, pipeInfo, adjacentElement, sourceInfo);
            }

            //if icon connected to the source pipe is also a pipe run getConnectedPipe function as a recursion, with updated arguments
            if (checkIfItsAPipe(adjacentIcon)) {
              const adjacentPipe = pipeInfo['pipe' + index];
              getConnectedPipe(matrix, pipeInfo, adjacentPipe, sourceInfo);
            }
          }
        }
      }
    }
  };

  //----------below is the code that executes the declared functions above--------

  //this app is designed to take in data from a .txt file. The code below reads the file passed in as an argument containing data in the form of a matrix structure
  let rawData;
  const fs = require('node:fs');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    rawData = data;
    //if there is an error, return the error and interrupt the rest of the application from running
  } catch (error) {
    return error;
  }

  //convert incoming data into a matrix array data format
  convertRawData(0, rawData);

  //check if there is a source in the provided matrix characterized by the "*" symbol
  const startingSource = getInitialSource(matrix);
  if (startingSource === 'there is no * in the matrix') {
    //don't proceed with further data processing if there is no provided source in the matrix
    return 'there is no source in the provided matrix';
    //if there is a source in the matrix set a variable containing important info about the source location in the matrix
  }

  //declare an object to act like a previous source data. this variable is necessary in order to pass in as an argument for the getConnectedPipe function. It is initiated as empty data for the first iteration of the recursion function getConnectedPipe
  const initialPreviousSource = {
    index: 'empty',
    icon: 'empty',
    matrixCoordinates: 'empty'
  };

  //check if there are pipes in the provided matrix
  const pipesInMatrix = compareMapAndMatrixIcons(matrix, mappedPipes);

  //if there are pipes in the matrix 
  if (pipesInMatrix !== 'there are no pipes in the matrix') {

    //declare a variable containing important information regarding the pipe's location and the location of the pipe's openings, this information will enable the app to identify what is connected at the ends of each pipe
    const pipeInfo = getPipeInfo(pipesInMatrix, mappedPipes);
    //run the getConnectedPipe with the pipeInfo
    getConnectedPipe(matrix, pipeInfo, startingSource, initialPreviousSource);

    //if there are no pipes in the matrix
  } else if (pipesInMatrix === 'there are no pipes in the matrix') {
    const pipeInfo = 'there are no pipes in the matrix';
    //run the getConnectedPipe with the pipeInfo argument set to a string with a notice
    getConnectedPipe(matrix, pipeInfo, startingSource, initialPreviousSource);
  }

  if (finalAnswer === 'there is nothing connected to the source') {
    return finalAnswer;
  } else {
    //reorder final answer to alphabetical order
    return finalAnswer.split('').sort().join('');
  }
};

