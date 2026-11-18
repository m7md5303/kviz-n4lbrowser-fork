import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react';
import { Fade } from 'react-awesome-reveal'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    MarkerType,
    applyEdgeChanges, 
    applyNodeChanges,
    Position,
    useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function getSavedSearch() {
    try {
        return JSON.parse(
            sessionStorage.getItem('kvizSearchToolbox') || '{}'
        );
    } catch {
        return {};
    }
}

export default function Graph(props) {
    const selectedFiles = JSON.parse(
    sessionStorage.getItem('selectedFiles') || '[]'
    ); 

    const n4lFiles = selectedFiles.map(file =>
        `/json/${file.replace('.n4l', '.json')}`
    );

    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [startsearch, setStartSearch] = useState(
        () => getSavedSearch().startsearch ?? 0
    );
    const RELATIONS_PER_PAGE = 25;
    const [index, setIndex] = useState(1);

    const totalPages = Math.ceil(filteredItems.length / RELATIONS_PER_PAGE);

    const displayedItems = filteredItems.slice(
        (index - 1) * RELATIONS_PER_PAGE,
        index * RELATIONS_PER_PAGE
    );

    const [notes_direction, setNotesDirection] = useState(
        () => getSavedSearch().notes_direction ?? ["Out→", "In←"]
    );

    const [arrows_type, setArrowsType] = useState(
        () => getSavedSearch().arrows_type ?? ["NR", "LT", "CN", "EP"]
    );

    const [notes_source, set_notes_source] = useState(
        () => getSavedSearch().notes_source ?? ''
    );

    const [notes_destination, set_notes_destination] = useState(
        () => getSavedSearch().notes_destination ?? ''
    );

    const [notes_node, set_notes_node] = useState(
        () => getSavedSearch().notes_node ?? ''
    );

    const [notes_chapters, set_notes_chapters] = useState(
        () => getSavedSearch().notes_chapters ?? ''
    );

    const [notes_contexts, set_notes_contexts] = useState(
        () => getSavedSearch().notes_contexts ?? ''
    );
    useEffect(() => {
        sessionStorage.setItem(
            'kvizSearchToolbox',
            JSON.stringify({
                notes_source,
                notes_destination,
                notes_node,
                notes_chapters,
                notes_contexts,
                notes_direction,
                arrows_type,
                startsearch
            })
        );
    }, [
        notes_source,
        notes_destination,
        notes_node,
        notes_chapters,
        notes_contexts,
        notes_direction,
        arrows_type,
        startsearch
    ]);


    const graphRef = useRef(null);

    const search_func = () => {
        // 1. Normalize Source, Destination, and Node
        const source = notes_source.trim().toLowerCase();
        const destination = notes_destination.trim().toLowerCase();
        const node = notes_node.trim().toLowerCase();

        // 2. Convert comma-separated Chapters and Contexts into arrays
        const chapters = notes_chapters
            .split(',')
            .map(value => value.trim().toLowerCase())
            .filter(Boolean);

        const contexts = notes_contexts
            .split(',')
            .map(value => value.trim().toLowerCase())
            .filter(Boolean);

        // 3. Filter the relationships loaded from the JSON files
        const results = items.filter(item => {
            const itemSource = String(item.source ?? '').toLowerCase();
            const itemDestination = String(item.destination ?? '').toLowerCase();
            const itemChapter = String(item.chapter ?? '').toLowerCase();
            const itemContext = String(item.context ?? '').toLowerCase();

            // Source and Destination take priority over Node
            const matchesSourceDestination = (
                (!source || itemSource.includes(source)) &&
                (!destination || itemDestination.includes(destination))
            );

            // If Source and Destination are both empty, search Node
            // against either the Source or Destination field.
            const matchesNode =
                !source &&
                !destination &&
                (
                    !node ||
                    itemSource.includes(node) ||
                    itemDestination.includes(node)
                );

            // Source/Destination search takes priority when either is provided.
            // Otherwise, use the Node search.
            const matchesEndpoints =
                source || destination
                    ? matchesSourceDestination
                    : matchesNode;

            // Chapters: match at least one entered chapter
            const matchesChapters =
                chapters.length === 0 ||
                chapters.some(chapter => itemChapter.includes(chapter));

            // Contexts: match at least one entered context
            const matchesContexts =
                contexts.length === 0 ||
                contexts.some(context => itemContext.includes(context));

            // Direction
            const matchesDirection = notes_direction.some(direction => {
                if (direction === "Out→") {
                    return item.direction === "positive";
                }

                if (direction === "In←") {
                    return item.direction === "negative";
                }

                return false;
            });

            // Arrow Type
            const matchesType = arrows_type.includes(item.group);

            // All filter categories must match
            return (
                matchesEndpoints &&
                matchesChapters &&
                matchesContexts &&
                matchesDirection &&
                matchesType
            );
        });

        // 4. Save and display the search results
        setFilteredItems(results);
        setStartSearch(1);
        setIndex(1);
    };

    const groupColors = {
        NR: "#347135",
        LT: "#ef5350",
        CN: "#2c83ca",
        EP: "#c29607",
    };


    const nodesMap = new Map();

    displayedItems.forEach((item) => {
        const source = String(item.source ?? '').trim();
        const destination = String(item.destination ?? '').trim();

        if (source && !nodesMap.has(source)) {
            nodesMap.set(source, {
                id: source,
                data: { label: source },
                style:{
                    backgroundColor: '#f6eef8',
                },
            });
        }

        if (destination && !nodesMap.has(destination)) {
            nodesMap.set(destination, {
                id: destination,
                data: { label: destination },
                style:{
                    backgroundColor: '#f6eef8'
                },
            });
        }
    });

    const nodes = Array.from(nodesMap.values()).map((node, index) => ({
    ...node,
    // sourcePosition: Position.Bottom, // Outgoing arrows exit from the right
    // targetPosition: Position.Left,  // Incoming arrows enter from the left
    position: {
        x: (index % 5) * 250,
        y: Math.floor(index / 5) * 150,
    },
    }));

    const edges = displayedItems
        .map((item, index) => {
            const source = String(item.source ?? '').trim();
            const destination = String(item.destination ?? '').trim();
            const color = groupColors[item.group] || '#888888';

            if (!source || !destination) {
                return null;
            }

            return {
                id: `edge-${index}`,
                source,
                target: destination,
                label: item.meaning || item.arrow || '',
                style: {
                    stroke: color,
                    strokeWidth: 2,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color,
                },
            };
        })
        .filter(Boolean);

        const [actnodes, setActNodes] = useState(nodes);
        const [actedges, setActEdges] = useState(edges);

        const onNodesChange = useCallback(
        (changes) => setActNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
        );
        const onEdgesChange = useCallback(
        (changes) => setActEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
        );
        const [reactFlowInstance, setReactFlowInstance] = useState(null);

        useEffect(() => {
            setActNodes(nodes);
            setActEdges(edges);
        }, [filteredItems, index]);
    

    useEffect(() => {
        Promise.all(
            n4lFiles.map(file =>
                fetch(`${file}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load ${file}`);
                        }
                        return response.json();
                    })
            )
        )
        .then(data => setItems(data.flatMap(Object.values)))
        .catch(error => console.error('Error loading JSON files:', error));
    }, []);

    useEffect(()=>{
        if(startsearch && items.length>0){
            search_func();
        }
    }, [items])


    useEffect(() => {
        if (reactFlowInstance && actnodes.length > 0) {
            const timer = setTimeout(() => {
                reactFlowInstance.fitView({ padding: 0.2 });
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [reactFlowInstance, filteredItems, index]);

    useEffect(() => {
        if (graphRef.current) {
            graphRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [index]);

    return (
        <div className='graph'>
            {window.scrollTo(0,0)}
            <Fade delay={150}>

                <div className='graphintro'>
                    <h1 className='mdh1'>Graph Viewer</h1>
                    <div className='md_nav'>
                        <button className='mdbtn0' onClick={()=>{index == 1? setIndex(totalPages) : setIndex(index-1)}}>
                            &lt;
                        </button>
                        <span className='mdspan'>{(startsearch && totalPages > 0) ? `${index}/${totalPages}` : '1/?'} </span>
                        <button className='mdbtn0' onClick={()=>{index == totalPages? setIndex(1) : setIndex(index+1)}}>
                            &gt;
                        </button>
                    </div> 
                </div>



                <div className='graphdisp' ref={graphRef}>
                    {!selectedFiles.length? 
                    <h4 >No Chosen Files</h4>
                    :!startsearch? 
                    <h4 >Please enter your query</h4> :
                    displayedItems.length ?
                    <ReactFlow
                        nodes={actnodes}
                        edges={actedges}
                        fitView
                        nodesConnectable={false}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onInit={setReactFlowInstance}
                        minZoom={0.1}
                        deleteKeyCode={null}
                        zoomOnDoubleClick={false}
                    >
                        <Background />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>: 
                    <h4> No results found</h4>
                    }
                </div>




                <label htmlFor="form" style={{color: "#5f0537"}}>Search Toolbox ⚙️</label>
                <div className='searchtoolbox' id="form">
                    <div className='sub_searchtoolbox'>
                        <input
                            type="text"
                            placeholder= "Enter the source"
                            className='n4lsearch'
                            value={notes_source}
                            onChange={(e) => set_notes_source(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder= "Enter the destination"
                            className='n4lsearch'
                            value={notes_destination}
                            onChange={(e) => set_notes_destination(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder= "Enter the Chapter title(s) separated by comma"
                            className='n4lsearch'
                            size={39}
                            value={notes_chapters}
                            onChange={(e) => set_notes_chapters(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder= "Enter the Context(s) separated by comma"
                            className='n4lsearch'
                            size={35}
                            value={notes_contexts}
                            onChange={(e) => set_notes_contexts(e.target.value)}
                        />

                    </div>
                    <div className='sub_searchtoolbox' id="bot_box">
                        <input
                            type="text"
                            placeholder= "Enter node name (src/dest) "
                            className='n4lsearch'
                            value={notes_node}
                            onChange={(e) => set_notes_node(e.target.value)}
                        />
                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={["Out→", "In←"]}
                            value={notes_direction}
                            onChange={(event, newValue) => {
                                setNotesDirection(
                                    newValue.length === 0 ? ["Out→", "In←"] : newValue
                                );
                            }}
                            disableCloseOnSelect
                            renderOption={(props, option, { selected }) => {
                                const { key, ...otherProps } = props;

                                return (
                                    <li key={key} {...otherProps}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option}
                                    </li>
                                );
                            }}
                            style={{ width: 'auto' , backgroundColor: "white", marginRight: "6vw"}}
                            sx={{
                                width: 'auto',
                                backgroundColor: 'white',
                                fontSize: '1vw',

                                '& .MuiInputBase-input': {
                                    fontSize: '1vw',
                                },

                                '& .MuiAutocomplete-tag': {
                                    display: 'none',
                                },

                                '& .MuiInputLabel-root': {
                                    fontSize: '1vw',
                                },

                                '& .MuiAutocomplete-option': {
                                    fontSize: '1vw',
                                },

                                '& .MuiChip-label': {
                                    fontSize: '1vw',
                                },
                                '& .MuiAutocomplete-clearIndicator svg': {
                                    display: 'none',
                                },
                                '& .MuiAutocomplete-clearIndicator::after': {
                                    content: '"↺"',
                                    fontSize: '1.5vw',
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Arrows Direction"
                                    placeholder="→"
                                />
                            )}
                        />


                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={["NR", "LT", "CN", "EP"]}
                            value={arrows_type}
                            onChange={(event, newValue) => {
                                setArrowsType(
                                    newValue.length === 0 ? ["NR", "LT", "CN", "EP"] : newValue
                                );
                            }}
                            disableCloseOnSelect
                            renderOption={(props, option, { selected }) => {
                                const { key, ...otherProps } = props;

                                return (
                                    <li key={key} {...otherProps}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option}
                                    </li>
                                );
                            }}
                            style={{ width: 'auto' , backgroundColor: "white"}}
                            sx={{
                                width: 'auto',
                                backgroundColor: 'white',
                                fontSize: '1vw',

                                '& .MuiInputBase-input': {
                                    fontSize: '1vw',
                                },

                                '& .MuiAutocomplete-tag': {
                                    display: 'none',
                                },

                                '& .MuiInputLabel-root': {
                                    fontSize: '1vw',
                                },

                                '& .MuiAutocomplete-option': {
                                    fontSize: '1vw',
                                },

                                '& .MuiChip-label': {
                                    fontSize: '1vw',
                                },
                                '& .MuiAutocomplete-clearIndicator svg': {
                                    display: 'none',
                                },
                                '& .MuiAutocomplete-clearIndicator::after': {
                                    content: '"↺"',
                                    fontSize: '1.5vw',
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Arrows Type"
                                    placeholder="NR"
                                />
                            )}
                        />
                    </div>
                    <div className='sub_searchtoolbox' id="bot_box_btn"> 
                        <button className='mdbtn1' style={{fontSize: "1.23vw"}} 
                        onClick={()=>{setStartSearch(1); search_func() }}
                        >Search
                        </button>
                    </div>
                </div>

                <div className='Navbuttons'>
                    <button className='filterbtn1' 
                    onClick={() => window.location.href = "/"}
                    >Back to Home</button>
                    <button className='filterbtn2' 
                    onClick={() => window.location.href = "notesbrowser"}
                    >Go to Notes Browser</button>
                    <button className='filterbtn2' 
                    onClick={() => window.location.href = "mdbrowser"}
                    >Go to Markdown Browser</button>
                </div>
            </Fade>
        </div>
    )
}