import React from "react";
import CapitalizedText from '../CapitalizedText/CapitalizedText'

const Rank = ({ name, entries }) => {
    return (
        <div>
            <div className='f3 white'>
                <CapitalizedText text={name}/>{', your current image recognition count is...'}
            </div>
            <div className='f2 white'>
                {entries}
            </div>
        </div>
    )
};

export default Rank;