import React from 'react'
import { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal'
import filterimg from '../Images/Gemini_Generated_Image_filter.jpeg'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function Filter(props) {
    
    const [options, setOptions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        fetch('/json_list/list.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load N4L file list');
                }
                return response.json();
            })
            .then((data) => setOptions(data))
            .catch((error) => console.error(error));
    }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

    return (
        
        <div className='filter'>
            <Fade delay={150}>
                <div className='filterintro'>
                    <h1>N4L Picker</h1>
                    <img className = 'filterimg' src={filterimg}/>
                    <h3>Notes Picking Dashboard. Please select which N4L files you want to pass to the knowledge browser</h3>
                
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={options}
                    value={selectedFiles}
                    onChange={(event, newValue) => {
                        setSelectedFiles(newValue);
                    }}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
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
                                {option.replace(/\.json$/, '')}
                            </li>
                        );
                    }}
                    style={{ width: '40vw', marginBottom: '17vh' }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="N4L files"
                            placeholder="Select files"
                        />
                    )}
                />
                <div className='filterbtns'>
                    <button className='filterbtn1' 
                    onClick={() => window.location.href = "./"}
                    >Back to Home</button>
                    <button
                        className='filterbtn2'
                        onClick={() => {
                            sessionStorage.setItem(
                                'selectedFiles',
                                JSON.stringify(selectedFiles)
                            );

                        window.location.href = "graphbrowser";
                        }}
                    >
                        Proceed to Browser
                    </button>
                </div>
                </div>
            </Fade>
        </div>
    )

}