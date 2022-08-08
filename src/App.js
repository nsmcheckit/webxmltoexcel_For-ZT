import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import React, { useState } from 'react'
import { flatMapDeep, flattenDeep, includes } from "lodash";
import { saveAs } from "file-saver";
function App() {
  // Load the module
  var to_json = require('xmljson').to_json;
  const [XML, setXML] = useState([]);
  let myJson = {};
  function myExport(data){
    to_json(data, function (error, data2) {
      //console.log(data2);
      myJson = data2;
    });
    let csvArray = [];
    for(let i = 0; i < Object.keys(myJson["SoundBanksInfo"]["StreamedFiles"]["File"]).length; i++){
      csvArray.push(
        {
          ID: myJson["SoundBanksInfo"]["StreamedFiles"]["File"][i]["$"].Id,
          ShortName: myJson["SoundBanksInfo"]["StreamedFiles"]["File"][i].ShortName,
          Path: myJson["SoundBanksInfo"]["StreamedFiles"]["File"][i].Path
        }
      )
    }
    //console.log(csvArray);
    for(let i = 0; i < Object.keys(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"]).length; i++){
      csvArray.push(
        {
          ID: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["$"].Id,
          ShortName: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i].ShortName,
          Path: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i].Path
        }
      )
        for(let i = 0; i < Object.keys(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"]).length; i++){
          //console.log(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]);
          if(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"] !== undefined){
            for(let j = 0; j < Object.keys(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"]).length; j++){
              //console.log(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]);
              if (myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"] !== undefined ){
                if (Object.keys(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"]).includes("0")){
                  for(let k = 0; k < Object.keys(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"]).length; k++){
                    //console.log(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"]);
                    csvArray.push(
                    {
                      ID: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"][k]["$"].Id,
                      ShortName: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"][k].ShortName,
                      Path: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"][k].Path
                    }
                  )
                    }
                }
                else {
                    //console.log(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"]);
                    csvArray.push(
                    {
                      ID: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"]["$"].Id,
                      ShortName: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"].ShortName,
                      Path: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["IncludedMemoryFiles"]["File"].Path
                    }
                  )
                }                  
              }
              if (myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["ReferencedStreamedFiles"] !== undefined ){
                if (Object.keys(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["ReferencedStreamedFiles"]["File"]).includes("0")){
                  for(let k = 0; k < Object.keys(myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["ReferencedStreamedFiles"]["File"]).length; k++){
                  csvArray.push(
                    {
                      ID: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["ReferencedStreamedFiles"]["File"][k]["$"].Id,
                      ShortName: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["ReferencedStreamedFiles"]["File"][k].ShortName,
                      Path: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["ReferencedStreamedFiles"]["File"][k].Path
                    }
                  )
                  }
                }
                else {
                  csvArray.push(
                  {
                    ID: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["ReferencedStreamedFiles"]["File"]["$"].Id,
                    ShortName: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["ReferencedStreamedFiles"]["File"].ShortName,
                    Path: myJson["SoundBanksInfo"]["SoundBanks"]["SoundBank"][i]["IncludedEvents"]["Event"][j]["ReferencedStreamedFiles"]["File"].Path
                  }
                )
              } 
              }
            }
          }
        }
    }
    let myCSV = 
        "ID,ShortName,Path\n"+
        flatMapDeep (
                csvArray.map((item) => {
                    const line = `${item.ID},${item.ShortName},${item.Path},`;
                    return [line];
                    }) 
            ).join("\n");
            let blob = new Blob(["\ufeff"+myCSV], { type: "text/plain;charset=utf-8" });
            saveAs(blob, `export.csv`);
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
    <div className="App" class="text-center">
      <h1 class="alert alert-primary" role="alert">原始征途xmlToExcel</h1>
      请选择XML文件: <input class="btn btn-warning" id="fileInput" type="file" multiple onChange={(e) => setXML(e.target.files)}/>
      <br/><br/>
      <button class="btn btn-success" type="button" onClick={handleXML}>导出Excel</button>
    </div>
  )
}

export default App