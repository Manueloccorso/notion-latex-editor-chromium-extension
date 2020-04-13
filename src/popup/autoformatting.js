function af_new_lines(code){
  let nl_code = code;
  nl_code = nl_code.replace(/{/g, "\n{");
  nl_code = nl_code.replace(/}/g, "\n}");
  nl_code = nl_code.replace(/ = /g, "\n = ");
  nl_code = nl_code.replace(/\\Big/g, "\n\\Big");
  return nl_code; }

function af_de_new_lines(code){
  let nl_code = code;
  nl_code = nl_code.replace(/\n/g, "");
  return nl_code;
}

function af_spacing(code){
    let nl_code = code;

    nl_code = nl_code.replace(/ /g, "");

    nl_code = nl_code.replace(/{/g, " { ");
    nl_code = nl_code.replace(/}/g, " } ");
    nl_code = nl_code.replace(/\[/g, " [ ");
    nl_code = nl_code.replace(/\[/g, " ] ");
    nl_code = nl_code.replace(/\(/g, " ( ");
    nl_code = nl_code.replace(/\)/g, " ) ");

    nl_code = nl_code.replace(/\\/g, " \\");
    nl_code = nl_code.replace(/=/g, " = ");
    return nl_code;

}

function autoformatting(code){
  //code = af_spacing(code);
  return code;
}

function auto_de_formatting(code){
  return code;
}

code = autoformatting("a\\Bigg() x\\Bigg()");
