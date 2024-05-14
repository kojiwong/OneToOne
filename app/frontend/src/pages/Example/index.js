import React, {useState, useEffect, useMemo} from 'react';

const Example_component = () => {
    const [counter, setCounter] = useState(0);

    const onClick = () => {
        setCounter(counter + 1);
    }

    return <div>
        <p>{counter}</p>
        <button onClick={onClick}>click</button>
    </div>
}

export default Example_component;