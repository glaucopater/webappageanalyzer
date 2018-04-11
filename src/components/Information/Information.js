import React from 'react';

import './Information.css';

const information = (props) => (
    <tr className="Information" id={props.id}>
        <td>{props.name}</td>
		<td>{props.value}</td>
    </tr>
);

export default information;