import React, { useState } from 'react'
function App() {
  // Load the module
  var to_json = require('xmljson').to_json;
  const [XML, setXML] = useState([]);
  let myJson = [];
  function myExport(data){
    to_json(data, function (error, data2) {
      console.log(data2);
      myJson = data2;
    });
    let csvArray = [];
    console.log(myJson)
    for(let i = 0; i<myJson.SoundBanksInfo.StreamedFiles.File.length; i++){
      console.log(myJson["SoundBanksInfo"]["StreamedFiles"]["File"][i].$.ID);
      console.log(myJson["SoundBanksInfo"]["StreamedFiles"]["File"][i].ShortName);
      console.log(myJson["SoundBanksInfo"]["StreamedFiles"]["File"][i].Path);
      csvArray.push(
        {
          ID: myJson["SoundBanksInfo"]["StreamedFiles"]["File"][i].$.ID,
          ShortName: myJson["SoundBanksInfo"]["StreamedFiles"]["File"][i].ShortName,
          Path: myJson["SoundBanksInfo"]["StreamedFiles"]["File"][i].Path
        }
      )
    }
    console.log(csvArray);
  //   let myCSV = 
  //       "ID,ShortName,Path";
  //       flatMapDeep (
  //               dia.map((item) => {
  //                   const line = `${item.AudioFile}\t${item.ObjectPath}\t${item.ObjectType}\t`;
  //                   return [line];
  //                   }) 
  //           ).join("\n");
   }
  function handleXML(){
    if (XML.length === 0) {
      alert("No files selected");
      return;
    }

    const file = XML[0];
        let reader = new FileReader();
        reader.onload = function (e) {
        const data = e.target.result;
        myExport(data);
    };
    reader.readAsText(file);
    
  }

  
  return (
    <div className="App">
      <h1>原始征途xmlToExcel</h1>
      请选择XML文件: <input id="fileInput" type="file" multiple onChange={(e) => setXML(e.target.files)}/>
      <br/>
      <br/>
      <button type="button" onClick={handleXML}>导出Excel</button>
    </div>
  )
}

export default App