

function internal_download(zip) {
  zip.generateAsync({type: "blob"}).then(function(content) {
    saveAs(content, "NotionMathEditor_backup_"+ Math.random().toString(36) +".zip");
  });
}



function download(codes){
  let zip = new JSZip();
  for(let i = 0; i < codes.length; i++){
    let code = codes[i];
    let filename = code.tag + " - " + code.name + " - " + code.id + ".txt";
    const windows_rejected = /[^a-zA-Z0-9\\.\\-]/g;
    filename = filename.replace(windows_rejected, " - ");
    console.log(filename);
    zip.file(filename,
            code.code);
  }
  internal_download(zip);
}
