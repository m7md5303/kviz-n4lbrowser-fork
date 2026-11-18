import React from 'react'

export default function Error(props) {
    

    return (
        <div className='err'>
            <h1>Page Does not exist</h1>
            <button className='filterbtn1' 
            onClick={() => window.location.href = "/"}
            >Back to Home</button>
        </div>
    )
}