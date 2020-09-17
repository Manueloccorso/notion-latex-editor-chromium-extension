

function internal_download(zip) {
  zip.generateAsync({type: "blob"}).then(function(content) {
    saveAs(content, "NotionMathEditor_backup_"+ Math.random().toString(36) +".zip");
  });
}

function download(codes){
  let zip = new JSZip();
  for(let i = 0; i < codes.length; i++){
    let code = codes[i];
    zip.file(code.tag + " - " + code.name + " - " + code.id,
            code.code);

  }
  internal_download(zip);
}
