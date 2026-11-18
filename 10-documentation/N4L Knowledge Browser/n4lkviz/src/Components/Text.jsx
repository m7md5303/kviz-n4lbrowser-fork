import { Background } from '@xyflow/react';
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Fade } from 'react-awesome-reveal'
import Markdown from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import { prepareMarkdown, searchMarkdown } from './../searchmd.js';
export default function Text(props) {

    const [index,setIndex]=useState(0);
    const [loadedfile,setLoadedfile]=useState(1); 
    const [view,setView]=useState(1); 
    const mdViewRef = useRef(null);
    const [preparedChunks, setPreparedChunks] = useState([]);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isPreparing, setIsPreparing] = useState(true);
    const selectedFiles = JSON.parse(
    sessionStorage.getItem('selectedFiles') || '[]'
    );    

    const markdownFiles = selectedFiles.map(file =>
        `./dir_notes/${file.replace('.n4l', '.md')}`
    );

    const [markdownContent, setMarkdownContent] = useState('');

    const markdownFile = markdownFiles[index];

    useEffect(() => {
        if (!markdownFile) return;

        fetch(`${markdownFile}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Markdown file');
                }
                return response.text();
            })
            .then(text => setMarkdownContent(text) )
            .catch(error => console.error(error));
    }, [markdownFile]);

    useEffect(() => {
        if (mdViewRef.current) {
            mdViewRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [index]);



    let cancelled = false;

    async function prepare() {
        try {
            const allChunks = [];

            for (const file of markdownFiles) {
                const response = await fetch(file);

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${file}`);
                }

                const content = await response.text();
                const chunks = await prepareMarkdown(content);

                allChunks.push(...chunks);
                setLoadedfile(loadedfile+1);
            }

            if (!cancelled) {
                setPreparedChunks(allChunks);
            }
        } catch (error) {
            if (!cancelled) {
                console.error('Failed to prepare Markdown:', error);
                setPreparedChunks([]);
            }
        } finally {
            if (!cancelled) {
                setIsPreparing(false);
            }
        }
    }


useEffect(() => {

    cancelled = false;

    prepare();
    setIsPreparing(false);

    return () => {
        cancelled = true;
    };
}, []);

    async function handleSearch() {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        if (preparedChunks.length === 0) {
            console.warn('No Retrieved text from the source.');
            return;
        }

        try {
            const matches = await searchMarkdown(query, preparedChunks);
            console.log('Prepared matches:', matches.length);
            setResults(matches);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        }
    }

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);


    return (
        <div className='text'>
                <div className='textintro'>
                    <h1 className='mdh1'>Notes Markdown Viewer</h1>

                    <div className='md_nav'>
                        <button className='mdbtn0' onClick={()=>{index==0? setIndex(selectedFiles.length-1) : setIndex(index-1)}}>
                            &lt;
                        </button>
                        <span className='mdspan'>{markdownFile? selectedFiles[index] : "File not found"}</span>
                        <button className='mdbtn0' onClick={()=>{index==selectedFiles.length-1 ? setIndex(0) : setIndex(index+1)}}>
                            &gt;
                        </button>
                    </div>                                 
                </div>

                <div className='mdsearcharea'>
                    <div className='mdsearch'>
                    <input
                        type="text"
                        placeholder={
                            (markdownContent && preparedChunks.length !== 0) && (!isPreparing)
                                ? "Please enter your query"
                                : `Loading file ${loadedfile}/${selectedFiles.length}...⏳`
                        }
                        value={(markdownContent && preparedChunks.length !== 0) && (!isPreparing)
                                ? query 
                                : ""}
                        onChange={(e) => setQuery(e.target.value)}
                        className='inputmdsearch'
                    />
                        <button className='mdbtn1' onClick={()=>{setView(0) , handleSearch()}}
                        >Search
                        </button>
                    </div>
                    <button className='mdbtn2' onClick={()=>{setView(1)}}
                    >View all Notes
                    </button>
                </div>
                
                {view? 
                <div className='md_view' ref={mdViewRef}>
                    {markdownFile ? <ReactMarkdown>{markdownContent}</ReactMarkdown>
                    : <h4>No Picked Files</h4>}
                    
                </div>
                : 
                <div className='searchview'>
                    {!markdownFile ? <h4>No Data to search through</h4>
                    :
                     !query.trim() ? <h4>Please Enter a Valid Query</h4>
                    :
                    preparedChunks.length === 0 ? <h4>No Retrieved text from the source</h4>
                    :
                    results.map((result, i) => (
                        <div key={i} className="search-result">
                            <ReactMarkdown>{result}</ReactMarkdown>
                        </div>
                    ))}
                </div>

                }
                


                <div className='Navbuttons'>
                    <button className='filterbtn1' 
                    onClick={() => window.location.href = "/"}
                    >Back to Home</button>
                    <button className='filterbtn2' 
                    onClick={() => window.location.href = "graphbrowser"}
                    >Go to Graph Browser</button>
                    <button className='filterbtn2' 
                    onClick={() => window.location.href = "notesbrowser"}
                    >Go to Notes Browser</button>
                </div>
        </div>
    )
}