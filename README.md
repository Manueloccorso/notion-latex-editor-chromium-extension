# NotionMathEditor_BrowserExtension

A chromium (tested on Chrome and the new Edge) extension for advanced Notion Math Blocks editing (latex). 
The basic features for now are: 
  - Automatically load Math Blocks from any Notion page into the popup
  - Ability to edit the code of the Math Block and see the rendered result directly in the popup
    -   Ability to use tab to indent 
    -   The code is automatically copied to clipboard, in order to be pasted manually inside the real Notion Math Block
  - Possibility to create a new Math Block inside the extention popup, disconnected from the page, in order to try out some LaTex code. 

Advantages for now: 
  - Edit long and complex LaTeX formulas from Math Blocks, seeing all the code and using indentation. 
  - Quickly try out some new code, or a portion of other code. 
  

## Getting Started

Nothing in particular w.r.t. any chromium unpacked extension in developer mode. 

### Prerequisites

Developer mode activated for the extensions, in the browser. 

### Installing

Just clone the repo, and the add the NotionMathEditor_BrowserExtension/src folder as an unpacked extension in your browser.  

## Built With

* [KaTeX](https://katex.org/) - Used to render the LaTeX code in the extension popup. 

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Manuel Occorso** - *Initial SMALL work* - [Manueloccorso](https://github.com/Manueloccorso)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

...

