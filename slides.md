<!-- .slide: data-state="no-toc-progress" --> <!-- don't show toc progress bar on this slide -->

# Data Mashups
<!-- .element: class="no-toc-progress" --> <!-- slide not in toc progress bar -->

## Remix Your Way to Interactive Visualizations

created by [vivshaw](https://vivshaw.github.io/) | 2017-04-19 | [online][1] | [src][2]


[1]: https://vivshaw.github.io/4-19-public-data-talk/
[2]: https://github.com/vivshaw/4-19-public-data-talk/

----  ----

# 1. Your humble host...

----

## ...Hannah Vivian Shaw

> "Who the heck is she?"
>
> -- <cite>You guys, probably</cite>

<div class="fragment" />

* BA in Economics & Philosophy, UVM
  * Secret identity: software engineer!
  * <!-- .element: class="fragment" --> `let interests = (econ_stats, code) => data_science`
* <!-- .element: class="fragment" -->
  __Don't be afraid to say 'Hi'!__
  * <!-- .element: class="fragment" --> [vivshaw.github.io](https://vivshaw.github.io/)
  * <!-- .element: class="fragment" --> [twitter.com/irreduce](https://vivshaw.github.io/)

----

## On the topic of public data

<div class="fragment" />
Initial thought: Public economic datasets - a natural fit for business. There's lots of comprehensive, clean data out there with direct business relevance.

<div class="fragment" />
Ulterior motive: 'Yay, a chance to revisit my old stomping grounds & build something neat!'

<div class="fragment" />
Where to find it?

* <!-- .element: class="fragment" -->Domestic data
  * [Bureau of Labor Statistics](https://www.bls.gov/home.htm) - employment, prices, compensation
  * [Federal Reserve Economic Data (Fred)](https://fred.stlouisfed.org/) -> macro, monetary, financial
  * [Bureau of Economic Analysis](https://www.bea.gov/) -> macro, trade, regional
* <!-- .element: class="fragment" -->International data
  * [World Bank](http://data.worldbank.org/) -> literally everything imaginable, from everywhere imaginable

----  ----

# 2. Posing our question

----

# Where are the hottest spots for tech-sector employment in 2016?

Perhaps you are...

<div class="fragment" />
...a startup, looking to avoid the high costs and market saturation of SF or NY?

<div class="fragment" />
...or, an established tech firm looking for locations for a branch office?

<div class="fragment" />
...or, a tech recruiter looking to expand your range for talent-hunting?

<div class="fragment" />
Whichever it may be, having an accurate picture of where tech-sector employment is growing is crucial to the success of this business venture. And I've got the perfect way for you to build this picture: public economic & geographic data.

----  ----

# 3. fab setup.revealjs

----

## A reveal.js Template

boilerplate for getting started on a nice reveal.js presentation:
* reveal.js code installed (comes with built-in plugins)
* Additional reveal.js plugins installed
* __`index.html`__ prepared accordingly
* All slides are defined in __`slides.md`__

----

## Set It Up

* install __fabsetup__:
```sh
sudo apt-get install  git  fabric              #
mkdir -p ~/repos  &&  cd ~/repos
git clone https://github.com/theno/fabsetup
```

* run fabric task __`setup.revealjs`__:
```sh
cd ~/repos/fabsetup
fab setup.revealjs  -H localhost
```

----

## fab setup.revealjs

*Asks for:*
 * Presentation base directory
 * Title
 * Sub-title
 * Short description

----

## fab setup.revealjs

*Optionally:*
 * Create github repo
 * Download npm libs

*When running again (also optional):*
 * Re-install reveal.js codebase

----

[howto](https://github.com/theno/fabsetup/blob/master/howtos/revealjs.md)

----

## Boilerplate File Structure

```sh
~/repos/my_presi> tree
.
├── .git/
├── .gitignore
│
├── README.md   <-- Short description and usage
│
├── slides.md   <-- All slides are defined here
├── index.html  <-- Configuration
├── img/
│   └── thanks.jpg  <-- good place for images
│
└── reveal.js/   <--.
    ├── css/         `-- reveal.js code "hidden" in a subdir
    ├── js/               (keeps the basedir clean)
    ├── plugin/
    ...
    ├── img -> ../img                \
    ├── reveal.js -> ../reveal.js     |_ symbolic links in order
    ├── slides.md -> ../slides.md     |   to run `npm start`
    └── index.html -> ../index.html  /
```

----

*template features*

----

## Plugins Built-In

All the built-in plugins are enabled in the __`index.html`__:
* __[marked.js, markdown.js][10]__: Markdown support
* __[highlight.js][11]__: Code syntax highlighting
* __zoom.js__: Zoom in and out with `ALT+click`
* __[notes.js][13]__: Speaker notes
* __[math.js][14]__: Formatting math expressions

[10]: https://github.com/hakimel/reveal.js/#markdown
[11]: https://github.com/hakimel/reveal.js/#code-syntax-highlighting
[13]: https://github.com/hakimel/reveal.js/#speaker-notes
[14]: https://github.com/hakimel/reveal.js/#mathjax

----

## Additional Plugins

This additional plugins will be installed and set up, too:
* __[menu.js][15]__: Slideout menu (slide index, change theme and transition)
* __[toc-progress.js][16]__: *"LaTeX Beamer-like progress indicator"*
* __[title-footer.js][17]__: *"Footer showing title of presentation"*

[15]: https://github.com/denehyg/reveal.js-menu#revealjs-menu
[16]: https://github.com/e-gor/Reveal.js-TOC-Progress
[17]: https://github.com/e-gor/Reveal.js-Title-Footer

----

## Customizations in reveal.js

* Don't Capitalize Titles (NO FULL UPPERCASE HEADINGS)
* Images are displayed without border

----

## Special Markdown Slide dividers

*Two dividers exist:*
* New horizontal slide: `\n----  ----\n`
* New vertical slide: `\n----\n`

*Win-win:*
* ["Raw"][18] `slides.md`: Easy to read and edit
* Horizontal lines in [rendered Markdown][19]: Easy to read, too

[18]: https://raw.githubusercontent.com/theno/revealjs_template/master/slides.md
[19]: https://github.com/theno/revealjs_template/blob/master/slides.md

----

## Create PDF

*cumbersome.*
* With [decktape](https://github.com/astefanutti/decktape)

```sh
cd ~/bin/decktape/active && \                                               #
./phantomjs decktape.js --size 1280x800 URL ~/repos/my_presi/my_presi.pdf
```

* Or just print the `slides.md` rendered by github into a PDF:
  https://github.com/theno/revealjs_template/blob/master/slides.md

---

* [Printing with chromium](https://github.com/hakimel/reveal.js#pdf-export)
  (or chrome) does not work well:
  https://theno.github.io/revealjs_template/?print-pdf#/

Note:
URL can be of:
* localhost:8000
* github.io page

----

## Shortcut

Checkout the template presentation repo:
```sh
git clone https://github.com/theno/revealjs_template  ~/repos/my_presi
```

Then:
* Adjust `<title>reveal.js template</title>` in __`index.html`__
* Edit __`slides.md`__
* Add symbolic link:
  ```sh
  cd ~/repos/my_presi  &&  ln -snf ../reveal.js  reveal.js/reveal.js
  ```


----  ----

# 4. Publishing at github.io


----

## Publishing as github page

A github repo (with `index.html`) can be rendered into a github.io page

1. Add remote repo at github.com <br>
   *(automated in fabsetup task setup.revealjs)*

1. [Configure][20] entry point for github.io page <br>
   *(manually, select "master branch")*


[20]: https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/
[1_]: https://theno.github.io/revealjs_template
[2_]: https://github.com/theno/revealjs_template


----  ----

# 5. Conclusion and Outlook

----

## Conclusion

* Presentations with __reveal.js__ are fancy and nice
* Writing slides in __Markdown__ is easy
* __fabric__ is a framework for powerfull setup scripts
* __fabsetup__ is a collection of fabric tasks

----

__`fab setup.revealjs`__ (one of this tasks):
  Creates the boilerplate of your presentation:
  * Clean basedir (reveal.js codebase hidden in a subdir)
  * Slides are written in a __Markdown file__
  * Usefull plugins enabled (eg. __footer, toc, menu__)
  * Versioning with __git__
  * Publishing at __github.io__

__`>>just edit the slides.md<<`__  <!-- .element: class="fragment" -->

----

## Outlook

* Publishing with own webserver
  * Implement restricted access
* Custom design
  * Create themes / corporate design
* Explore [more plugins][21]
* [Customize][23] fabsetup task `setup.revealjs`

---

Alternative:

[prez][22] -- *"Opiniated Reveal slideshow generator with nice
PDF output and ability to treat notes as first-class content."*

[21]: https://github.com/hakimel/reveal.js/wiki/Plugins,-Tools-and-Hardware
[22]: https://github.com/byteclubfr/prez
[23]: https://github.com/theno/fabsetup/blob/master/howtos/fabsetup_custom.md

----

## References

* reveal.js: [http://lab.hakim.se/reveal-js](http://lab.hakim.se/reveal-js/)
  * at github: [https://github.com/hakimel/reveal.js](https://github.com/hakimel/reveal.js)

---

* markdown: [https://daringfireball.net/projects/markdown](https://daringfireball.net/projects/markdown/)
  * cheatsheet: [https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

---

* fabric: [http://www.fabfile.org](http://www.fabfile.org/)
  * at github: [https://github.com/fabric/fabric](https://github.com/fabric/fabric)

---

* fabsetup: [https://github.com/theno/fabsetup](https://github.com/theno/fabsetup)
  * revealjs [howto](https://github.com/theno/fabsetup/blob/master/howtos/revealjs.md)


----  ----

<!-- .slide: data-state="no-toc-progress" --> <!-- don't show toc progress bar on this slide -->

### *Thank You for Your attention!*
<!-- .element: class="no-toc-progress" -->

![](img/thanks.jpg)
