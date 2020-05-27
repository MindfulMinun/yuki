// ---
import Yuki from './yuki.js';
const script = new Yuki(`\
Yuki "0.1.0"

# This is a comment
#* Start of chapter 1 *#
define ch1:
    > 0 "I'm printed out immediately\\n with a newline"
    > 3 "I'm printed 3 seconds later"

    select: "What do you want to do?"
        option: "Say hi"
            > 0 "Hellooo!"
        option: "Recursion"
            @ch1

    > 3 "This is printed regardless."

#*
 * End of chapter 1
 * TODO: write chapter 2
 *#
`);
console.log(script);
let out = '',
    i = 0;

for (; i < script.tokens.length; i++) {
  const token = script.tokens[i];
  let content = token.content;
  let classList = token.type;

  if (token.type === 'whitespace') {
    content = content.replace(/\s{2,}/g, match => ''.padStart(match.length, '·'));
  }

  if (token.type === 'newline') {
    content = content.replace(/\n/g, '¬\n');
  }

  if (token.type === 'identifier') {
    if (-1 < Yuki.KEYWORDS.indexOf(token.content)) {
      classList += ' keyword';
    }
  }

  out += `<span class="${classList}">${content}</span>`;
}

document.body.innerHTML = `<pre>${out}</pre>`;