import React, { useState, useReducer } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { test } from 'actions/dashboard';

export default function Elements (props) {
	const dispatch = useDispatch();

	const initialState = {};

	const [username, setUserName] = useState("");

	const uname = (e) => setUserName(e.target.value)

	const show = () => {
		console.log(dispatch)
		// dispatch(test())
	}

  return (
    <div>
    	Elements

    	<br />

    	<input onChange={(e) => uname(e)} />
    	<button onClick={show}>show</button>
    </div>
  )
}