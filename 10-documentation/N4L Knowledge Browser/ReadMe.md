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

For running the compiler, one shall run:
```bash
python3 n4l_bcompiler.py {directory to arrows files} {directory to the N4L source file}
```
The way of running the compiler script may differ in OS other than the Ubuntu 22.04 way mentioned here.

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
This section is concerned about the GUI start, specifically at the homepage. The browser is running locally on PC allowing for full privacy for the data. As the image shows, the homepage provides link references for:
- The N4L4Doc Article
- The N4L2Doc Article
- The Auto N4L2Doc Tool
These three can be already found in this repository.

For proceeding directly to the browser, one shall click on `Start Graph Browsing` button.
<img width="631" height="414" alt="image" src="https://github.com/user-attachments/assets/d83a61b5-ae61-4f23-b48c-d035b557f975" />
## Picking Files
In this window, one shall choose which N4L files he would like to include in his search. As shown, there is a drop list having all the compiled N4L files viewed where the user can easily choose among them using the checkboxes.
<img width="1600" height="1024" alt="image" src="https://github.com/user-attachments/assets/7c521210-aaf1-4c16-bdbf-0b5e81ff8ecd" />

Additionally, the input bar allows for doing alphabetical search for any of the files in the list as shown in the following figure.

<img width="1600" height="1024" alt="image" src="https://github.com/user-attachments/assets/e4bca161-5d4f-4313-b821-03f6fd51c6c1" />

## Search Toolbox
After proceeding to the browser, you will be directed into the Graph viewer which is the default view. However, this section is concerned about the Search toolbox which lies in the bottom of the screen as shown

<img width="1600" height="948" alt="image" src="https://github.com/user-attachments/assets/1da189b8-f480-4832-96b2-eb64f565eef4" />
This toolbox allows the user to search among 7 different search filters. If one of them is left empty, this tells the backend search engine to retrieve the results without filtering this very category. The toolbox is responsible for the search for both the Graph view and the Notes view. It retrieves the matching results from the generated JSON file from the python compiler that is storing all the N4L relations inside the N4L source file. The 7 search filters can be discussed as follows:

- Source entry: for searching for specific source
  
- Destination entry: for searching for specific destination
  
- Chapter entry: for specifying the search to be only in certain chapter(s)
  
- Context entry: for specifying the search to be only in certain context(s)
  
- Arrow Group Drop list: for choosing which arrow group(s) the search should be concerned about
  
<img width="1600" height="422" alt="image" src="https://github.com/user-attachments/assets/129efa34-8263-4f6d-9daa-6d4085768fe3" />

- Arrow Direction Drop list: for choosing the arrow direction the search should be concerned about (forward (in) or backward (out)).

<img width="1600" height="281" alt="image" src="https://github.com/user-attachments/assets/91c48e4b-8823-4f3a-9673-e6f608e4a72a" />

- Node entry: This one is used when the user is concerned about a certain node in general and wants to retrieves its relations whether when it comes as a source or destination.

As mentioned before, when any entry is left without modification, this category is not filtered in the search. The Search toolbox controls simultaneously the Graph view and the Notes View.  

## Graph and Notes Browsers
KViz supports browsing through N4L relations whether in graph setting or textual lines. For handling large files without resulting in a messy graph, the browser internally performs paging when the number of retrieved relations is more than 25. Thus each page views 25 relations at most, and if exceeds, you will find in the navigation panel the total number of pages you can navigate through using the small right and left arrows.
<img width="1600" height="1024" alt="image" src="https://github.com/user-attachments/assets/68c25f83-9c71-4495-a0eb-30c20e4bbc91" />
The fit view shows all relations at once. However, through the usage of React Flow library, the browser supports:-

- Zooming in and Out

<img width="1600" height="1024" alt="image" src="https://github.com/user-attachments/assets/738f439c-88f8-4ca1-9258-246a0114c72f" />

- Dragging a single or a group of nodes helps in creating custom Knowledge trees:

<img width="1600" height="1024" alt="image" src="https://github.com/user-attachments/assets/23e31628-13b1-4ddd-b3d4-7a4a78c07918" />

- Selecting certain area in the graph:

<img width="1600" height="1024" alt="image" src="https://github.com/user-attachments/assets/b9f73ebc-2e80-4805-abd2-d1fdda0264bb" />

- Small navigation map at the bottom right of the graph to avoid getting lost in the graph:

<img width="752" height="243" alt="image" src="https://github.com/user-attachments/assets/1c48741b-d595-44ed-8f9b-0cbdcb6f8666" />

Additionally, the arrows rendering follow the following convention:

- NR group has greenish color

- LT group has reddish color

- CN group has bluish color

- EP group has yellowish color

This palette helps the user to differentiate among different relations in the graph 

<img width="1600" height="1024" alt="image" src="https://github.com/user-attachments/assets/766c0391-2543-4c21-992f-e51ff6b523da" />

