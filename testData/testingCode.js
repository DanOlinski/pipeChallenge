//add these console logs to the end of the sinkSystem.js file

console.log('ABG',pipeSystem('./testData/dataABG.txt'));
console.log('ABGPR',pipeSystem('./testData/dataABGPR.txt'));
console.log('ABZ',pipeSystem('./testData/dataABZ.txt'));
console.log('AG',pipeSystem('./testData/dataAG.txt'));
console.log('no source',pipeSystem('./testData/dataNoSorce.txt'));
console.log('not connected',pipeSystem('./testData/dataNotConnected.txt'));
console.log('AC',pipeSystem('./testData/dataAC.txt'));
console.log('AGM',pipeSystem('./testData/dataAGM.txt'));
console.log('B',pipeSystem('./testData/dataB.txt'));

console.log(pipeSystem('./testData/coding_qual_input.txt'));