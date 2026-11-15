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
The following figure demonstrates the project architecture. The user is only requested to provide the source N4L file and the 4 arrows files already discussed in the N4L4Doc article. This group of files are fed into the python compiler where its responsibility is to generate two files: JSON and Markdown files for each given N4L file. The compiler output represents the React JS-based browser database. As the figure shows, the application is composed mainly of 3 main views: Graph View, Notes View and Markdown View.
<img width="808" height="499" alt="image" src="https://github.com/user-attachments/assets/68df41ff-da91-4f72-af59-70940ed2a1b5" />
## Compiler Role
As mentioned earlier, the compiler is built with Python and responsible for the construction of the browser database. It generates 2 files per each N4L file depending on the fed arrows files: (NR, LT, CN and EP). 
### JSON File
The JSON file includes all the N4L relations that are present in the source N4L file. Each entry in the output JSON list stores the following information for each N4L relation:
- Node Source
- Node Destination
- N4L Arrow (in N4L format)
- N4L Arrow meaning in English
- The arrow's group which this relation's arrow belongs to
- The arrow's direction (forward or backward)
- The context where this relation is
- The chapter where this relation is

This information is retrieved by the browser, enabling users to flexibly select from a good range of search filters.
### Markdown File
The markdown file is the output of the direct replacement of the N4L arrows with their English meaning. It acts a plain English document where each chapter title is `Header 1`, each context title is `Header 2` and everything else is the same except that:
- N4L arrows are translated
- Comments are removed

**Note: Since the browser is HTML-based, it is required to replace each dot that is not a full stop `e.g. S.Adam` and each comma that is not separating between sentences `e.g. apple, banana` with `&period;` and `&comma;`, respectively. Otherwise, they should be placed as dots and commas normally.**
## Home Page
This section is concerned about the GUI start, specifically at the homepage. As the image shows, the homepage provides link references for:
- The N4L4Doc Article
- The N4L2Doc Article
- The Auto N4L2Doc Tool
These three can be already found in this repository.

For proceeding directly to the browser, one shall click on `Start Graph Browsing` button.
<img width="631" height="414" alt="image" src="https://github.com/user-attachments/assets/d83a61b5-ae61-4f23-b48c-d035b557f975" />

