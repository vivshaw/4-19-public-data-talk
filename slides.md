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
Ulterior motive: 'Yay, a chance to revisit my old stomping grounds & build some neat visualizations!'

----

## Where to find economic data?

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

----

## Perhaps you are...

<div class="fragment" />
...a startup, looking to avoid the high costs and market saturation of SF or NY?

<div class="fragment" />
...or, an established tech firm looking for locations for a branch office?

<div class="fragment" />
...or, a tech recruiter looking to expand your range for talent-hunting?

<div class="fragment" />
Whichever it may be, having an accurate picture of where tech-sector employment is growing is crucial to the success of this business venture. And I've got the perfect way for you to build this picture: public economic & geographic datasets!

----  ----

# 3. Sorting out our economic data

----

## BLS-OES

The Bureau of Labor Statistics maintains a comprehensive [Occupational Employment Statistics](https://www.bls.gov/oes/home.htm) (OES) program
* Employment data available broken down by occupational profiles & groups thereof
* Temporal granularity: yearly (released each Spring)
* Spatial granularity: national, state, metropolitan statistical area (MSA)
* We'll use MSAs, as we want the most granular understanding of where the job growth is at!

----

## Scrub-a-dub-dub, data cleaning time!

We'll use Pandas, because it's awesome. 

```
xl = pd.ExcelFile(filename)
df = xl.parse(xl.sheet_names[0])

# Drop non tech sector jobs
df = df.drop(df[df.OCC_CODE != "15-0000"].index)
# Drop any rows with missing data
df = df.drop(bls[(bls.A_MEAN == '*') | (bls.JOBS_1000 == '**') | (bls.TOT_EMP == '**')].index)

# Convert some columns to numeric datatypes
to_convert = ['TOT_EMP', 'JOBS_1000', 'A_MEAN']
bls[to_convert] = bls[to_convert].apply(pd.to_numeric)

# Return only chosen columns
return df['AREA', 'AREA_NAME', 'TOT_EMP', 'JOBS_1000', 'A_MEAN']
```

----

## Merge, merge, merge

We'll grab the past three years of OES data and merge 'em together. Pandas makes this as easy as a SQL join:

```
from functools import reduce

inner_join_by_area = lambda x, y: pd.merge(x, y, on='AREA', how='inner')
bls_merged = reduce(inner_join_by_area, bls_data)
```

----

## Our target indicator: average job growth

Let's just grab our total employment in the sector for each year, subtract, and do a quick average...

```
bls_merged['2016_EMP_GROWTH'] = tot_emp['2016_TOT_EMP'] - tot_emp['2015_TOT_EMP']
bls_merged['2015_EMP_GROWTH'] = tot_emp['2015_TOT_EMP'] - tot_emp['2014_TOT_EMP']
bls_merged['AVG_EMP_GROWTH'] = (tot_emp['2016_EMP_GROWTH'] + tot_emp['2015_EMP_GROWTH']) / 2

```

----

## Preliminary EDA

We can already start to see some neat stuff. Let's look at our dataframe:

```
In[1]: tot_emp[['AREA', 'AREA_NAME_x', 'AVG_EMP_GROWTH']].sort_values('AVG_EMP_GROWTH', ascending=False)
Out[1]: 
      AREA                                          AREA_NAME  AVG_EMP_GROWTH
43   41940                 San Jose-Sunnyvale-Santa Clara, CA          8605.0
227  35084                Newark, NJ-PA Metropolitan Division          8470.0
90   12060                  Atlanta-Sandy Springs-Roswell, GA          8385.0
42   41884  San Francisco-Redwood City-South San Francisco...          7940.0
30   31084  Los Angeles-Long Beach-Glendale, CA Metropolit...          5355.0
21   38060                        Phoenix-Mesa-Scottsdale, AZ          5040.0
353  42644  Seattle-Bellevue-Everett, WA Metropolitan Divi...          4595.0
205  16740                  Charlotte-Concord-Gastonia, NC-SC          4440.0
314  19124      Dallas-Plano-Irving, TX Metropolitan Division          4130.0
309  12420                              Austin-Round Rock, TX          3980.0
193  28140                                 Kansas City, MO-KS          3300.0
186  33460            Minneapolis-St. Paul-Bloomington, MN-WI          3235.0
..     ...                                                ...             ...
```

----

## Lemme throw some plots at ya

![](img/avg_emp_histo.jpg)
![](img/avg_emp_x_wage.png)

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
