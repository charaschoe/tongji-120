const fs = require('fs');

function checkSyntax(file) {
  const content = fs.readFileSync(file, 'utf8');
  const scripts = [];
  let regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
      scripts.push(match[1]);
  }
  
  scripts.forEach((script, i) => {
    try {
      new Function(script);
      console.log(`Script ${i} in ${file} passed syntax check.`);
    } catch (e) {
      console.error(`Syntax error in ${file} script ${i}:`, e);
    }
  });
}

checkSyntax('/Users/admin/Downloads/files/tongji_poster_machine.html');
checkSyntax('/Users/admin/Downloads/files/tongji_fotobooth.html');
checkSyntax('/Users/admin/Downloads/files/index.html');
