Census Queries Simplified 
Project Requirements Document submitted by Promit Chatterjee (CPLN692)


Purpose
-[] To make US Census data more accessible to users who would like to bypass the process of programming API requests on R, Python. 

Premise
A sizeable few among my colleagues in school and at work have often told me about the difficulty they face when it comes to sourcing US Census. This difficulty is due to the discomfort associated with programming languages in general. Furthermore, when accessing this data on data.census.gov, users are unable to get certain cross-tables which are harder to access because their keys are less known (and get buried in the search results). Additionally, even if the desired cross-tables are accessible, getting time series data for the same is a tedious task. The user has to go back to the same table and access the same for all the years to create a continuous range of time-series data. 
My project is to create a one-stop-app for planners and planners-to-be that combines the best components of both API-based and queries and web-surfing-sourced data. This functionality would be layered on top of a map view to allow users to visualize the results of their query live. 

Target Audience
•	City Planners
•	City Planning students
•	Urban Studies students / enthusiasts
•	Engaged and enthusiastic citizens (particularly without coding/planning background)

Functionality
	Map with census tract polygons 
o	User ability to draw polygons to select multiple census geographies (tracts).
o	Summary of requested data table for years requested in a tooltip 
o	Comparative summary feature to compare same data points with either another user selection, the whole county, or any other selection of sibling (other census tract) or parent geographies (county, state, national).
o	Export selection image and DOWNLOAD
o	Arrange collected data from user query and DOWNLOAD
	Data Query without Map
o	Summary of requested data table for years requested in a tooltip 
o	Arrange collected data from user query and DOWNLOAD

