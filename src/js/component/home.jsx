import React, { useState, useEffect } from "react";

const Home = () => {
	const [tarea, setTarea] = useState("")
	const [listaTareas, setListaTareas] = useState([])

	function agregarTarea(event) {
		//console.log(event);
		setTarea(event.target.value);
	}

	function agregarLista(event) {
		//console.log(event);
		if (event.keyCode === 13 && event.target.value != "") {

			

			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const raw = JSON.stringify({
				"label": tarea,
				"is_done": false
			});

			const requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow"
			};

			fetch("https://playground.4geeks.com/todo/todos/lmezza", requestOptions)
				.then((response) => response.json())
				.then((result) => {
					//console.log(result)
					let newArray = listaTareas.concat(result)
					setListaTareas(newArray)
					setTarea("");
				})
				.catch((error) => console.error(error));
		}
	}

	const eliminarTarea = (id) => {
		//console.log(id);

		const requestOptions = {
			method: "DELETE",
			redirect: "follow"
		};

		fetch(`https://playground.4geeks.com/todo/todos/${id}`, requestOptions)
			.then((response) => response.text())
			.then((result) => consultaListaTareas(result))
			.catch((error) => console.error(error));

	}

	
	function consultaListaTareas() {
		const requestOptions = {
			method: "GET",
			redirect: "follow"
		};

		fetch("https://playground.4geeks.com/todo/users/lmezza", requestOptions)
			.then((response) => {
				//console.log(response); 
				if (response.status === 404) {
					createUser();
				}
				return response.json()
			})
			.then((result) => setListaTareas(result.todos))
			.catch((error) => console.error(error));
	}
	
	function createUser() {
		const raw = "";

		const requestOptions = {
			method: "POST",
			body: raw,
			redirect: "follow"
		};

		fetch("https://playground.4geeks.com/todo/users/lmezza", requestOptions)
			.then((response) => {
				//console.log(response); 
				if (response.status === 201) {
					consultaListaTareas();
				}
				return response.json()
			})
			.then((result) => console.log(result))
			.catch((error) => console.error(error));
	}


	useEffect(() => {
		consultaListaTareas()
	}, [])
	
	return (
		<div className="container mt-5 w-50">
			<div className="d-flex justify-content-center fs-2 mb-2"><input className="w-75 border-2 rounded-pill text-center" type="text" placeholder="What do you need to do?" onKeyDown={agregarLista} value={tarea} onChange={agregarTarea} /></div>
			<ul className="my-2 p-0 d-flex justify-content-between">
				{/* Crear con map lista */}
				<div className="list-group">
					{listaTareas.length > 0 ? listaTareas.map((item) => <li className="list-group-item list-group-item-dark" key={item.id}>{item.label}<button type="button" className="btn btn-light position end-0" onClick={() => eliminarTarea(item.id)}>x</button></li>) : null}
				</div>
			</ul>
			{listaTareas.length + ` Task left`}
		</div>
	);
};

export default Home;