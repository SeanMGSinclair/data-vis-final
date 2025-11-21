There were a few minor differences between what our sketch outlined and what we ultimately implemented on our dashboard. Each of the differences is listed below: 

On the visualization at the top of the page, we decided that a search function was unnecessary for filtering the chart by the genre, since there were few enough unique genres that a dropdown was feasible (and easier for users to interact with, since they won’t have to try and think of genres on their own).  

Similarly, we also put the filtering/select by genre input for the first visualization underneath the chart itself, instead of placing it to the right of the chart. This was less because we felt it looked better that way and more because it was not trivial to move the selection to the right of the chart, and we figured the placement of the selection input wasn’t a big enough deal to warrant spending a significant amount of time on figuring out how to put it to the right of the chart—at least for a rough draft. We may move it to the right of the chart (as in our sketch) before submitting the final draft of this project.  

The same goes for the ‘Select Metric’ input in the explicit vs. non-explicit chart. We had this input to the right of the chart in our sketches, but since it wasn’t trivial to move it there, we kept it below the chart for this rough draft.  

The format of this ‘Select Metric’ input was radio buttons in our sketch; however, since radio buttons seem to appear horizontally next to each other by default, we felt the dropdown looked cleaner. In the final draft, we may spend more time trying to figure out how to make radio buttons stack on top of each other—and how to put the whole selection to the right of the chart—but again for this rough draft we didn’t feel that these were significant enough issues to spend a lot of time on. We focused more on spending our time making the charts themselves appear like our sketches. 

In the tempo vs. length scatterplot, we changed the title of the plot, since we felt that the title in our sketch was a little bit clunky and didn’t communicate the information in our chart well.  

We also changed the x-axis to be minutes instead of milliseconds, since minutes are typically the metric that people use to measure song length.  

Lastly for this chart, we also added the ability to pan and zoom (and labeled it) since our sketch didn’t include much interactivity for the chart other than having a tooltip. 

As of right now, we have the song and artist radar charts stacked on top of each other, as opposed to horizontal (as was the case in our sketches). There is no real reason for this: we are going to look into making them horizontal to see how difficult it is, but we didn’t have time before this deadline so we just did vertical stacking for the rough draft. 

We hardcoded a few songs and artists for the autocomplete search, but for the final draft we are going to try to parse the file in JavaScript to include a greater variety of songs and artists. 

For the correlation heatmap chart attributes we choose them because they are numeric values. Instead of using just 7 of the attributes we choose in the drawing, we decided to use just all the numeric columns. We thought this would show a better view of the correlation. We also adjusted the scatter plot that is connected to the correlation heatmap chart to have the legend as a generalized genre instead of a gradient of popularity. We thought this would give more insight to the user than popularity would. Lastly, we decided to move the scatter plot next to the heatmap chart rather than below it like in our visual to make the interaction better for the user. 

 
