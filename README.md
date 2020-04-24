# NotionMathEditor_BrowserExtension

A chromium (tested on Chrome and the new Edge) extension for advanced Notion Math Blocks editing.
# Main Features
## Now in master branch:

  - Open the extension popup with Alt + Shift + M

  - Load automatically the Notion Math Blocks of the current page into the extension popup.
  - Quickly create some new code (which is lost when the extension is closed, unless is saved).
  - Store codes permanently for later use.

  - Edit each type of code (from page, quick, or stored) in an advanced editor (integration with Code Mirror is coming).
  - After the edit, the code is copied automatically to the clipboard in order to be pasted in the real Notion block manually.
    (when the APIs will be released, it will be probably possible to automatically update the notion block).

  - Possibility to give a name to the stored codes
## Next :
  - Possibility to search for codes
  - Possibility to insert a stored code template in an other one by writing \CodeName
      (useful for example for systems equation or other long and frequently used templates )

## Getting Started

Nothing in particular w.r.t. any chromium unpacked extension in developer mode.

### Prerequisites

Developer mode activated for the extensions, in your browser.

### Installing

1. Just clone this repo (master branch for a stable version, or check the other branches for new features
2. Go to your browser extension page, and activate the developer mode.
3. Click on "Load Unpacked" or similar.
4. Select the "src" folder (inside the folder you've cloned from here).
5. Refresh a Notion page and try the extension with Alt + Shift + M or clicking the extension button.

## Built With

* [KaTeX](https://katex.org/) - Used to render the LaTeX code in the extension popup.
* [CodeMirror](https://codemirror.net/)  - Used as editor in the extension popup.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/Manueloccorso/NotionMathEditor_BrowserExtension/blob/master/CONTRIBUTING.md).

## Authors

* **Manuel Occorso** - *Initial work* - [Manuel Occorso](https://github.com/Manueloccorso)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

...
