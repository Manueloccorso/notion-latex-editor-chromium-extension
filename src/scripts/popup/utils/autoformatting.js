function autoformatting(code){
  return code;
}

function auto_de_formatting(code){
  return code;
}

function auto_clean_code(code){
  var formatter = document.createElement('textarea');
  formatter.innerHTML = code;
  return formatter.value;
}
