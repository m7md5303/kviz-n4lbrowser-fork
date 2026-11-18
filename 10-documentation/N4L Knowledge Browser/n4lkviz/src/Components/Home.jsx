import React from 'react'
import { Fade } from "react-awesome-reveal";
import mainimg from '../Images/Neon Knowledge Network Logo.png'
export default function Home(props) {
    
  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

    return (
         <Fade delay={150}>
            <div className='home'>
                <img className = 'homeimg' src={mainimg}/>
                <div className='homebtns'>
                    <button className='homebtn' 
                    onClick={() => window.location.href = "./datapick"}
                    >Start Graph Browsing</button>
                    <button className='homebtn' 
                    onClick={() => window.open('https://github.com/regymm/PCIe-DMA-DDR3-Accelerator/blob/main/10-documentation/N4L%20for%20Documentation/n4l4doc.md', '_blank')}
                    >N4L4Doc Article</button>
                    <button className='homebtn' 
                    onClick={() => window.open('https://github.com/regymm/PCIe-DMA-DDR3-Accelerator/blob/main/10-documentation/N4L%20for%20Documentation/n4l2doc.md', '_blank')}
                    >N4L2Doc Article</button>
                    <button className='homebtn' 
                    onClick={() => window.open('https://github.com/regymm/PCIe-DMA-DDR3-Accelerator/blob/main/10-documentation/AIN4L%20Documentation/README.md', '_blank')}
                    >Auto N4L2Doc Tool</button>
                </div>
            </div>
        </Fade>

    )
}