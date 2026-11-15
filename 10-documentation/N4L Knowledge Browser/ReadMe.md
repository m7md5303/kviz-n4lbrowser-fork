# KViz N4L Knowledge Browser
## Table of Contents:-
- Introduction
-	System Architecture
-	Compiler Role
-	Home Page
-	Picking Files 
-	Search Toolbox
-	Graph and Notes Browsers
-	Markdown Browser
-	Conclusion
-	Author
## Introduction
KViz Knowledge Browser is an open-source knowledge browser dedicated for visualizing and surfing N4L relations and N4L-documents for Hardware and Software Projects. It is aiming for providing easiness in knowledge exploring and contributing to the portability of projects documentation written in N4L.
<img width="1600" height="1024" alt="image" src="https://github.com/user-attachments/assets/dc231746-16b7-4880-a6dd-ed237c0b0621" />
## System Architecture
The following figure demonstrates the project architecture. The user is only requested to provide the source N4L file and the 4 arrows files already discussed in the N4L4Doc article. This group of files are fed into the python compiler where its responsibility is to generate two files: JSON and Markdown file for each given N4L file. The compiler output represents the React JS-based browser database. As the figure shows, the application is composed mainly of 3 main views: Graph View, Notes View and Markdown View.
<img width="808" height="499" alt="image" src="https://github.com/user-attachments/assets/68df41ff-da91-4f72-af59-70940ed2a1b5" />

