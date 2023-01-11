import {useEffect, useState} from "react";
import axios from "axios";
import Swal from 'sweetalert2';

export const Home = () => {

    const [emID, setemID] = useState('');
    const [emName, setemName] = useState('');
    const [emDesg, setemDesg] = useState('');
    const [emDept, setemDept] = useState('');
    const [emSal, setemSal] = useState('');
    const [emLoc, setemLoc] = useState('');
    const [data, setData] = useState([]);

    const [newName, setNewName] = useState('');
    const [newDesg, setnewDesg] = useState('');
    const [newDept, setnewDept] = useState('');
    const [newSal, setnewSal] = useState('');
    const [newLoc, setnewLoc] = useState('');

    const [addName, setAddName] = useState('');
    const [addDesg, setaddDesg] = useState('');
    const [addDept, setaddDept] = useState('');
    const [addSal, setaddSal] = useState('');
    const [addLoc, setaddLoc] = useState('');

    const [search, setSearch] = useState('');

    function searchData() {
        axios.get(`http://localhost:3000/search?search=${search}`)
            .then((res)=>{
                console.log('search: '+ res.data);
                setData(res.data);
            })
    }

    function edit() {
        axios.post('http://localhost:3000/editUser', {
            newName,
            newDesg,
            newDept,
            newSal,
            newLoc,
            emID
        }).then((res) => {
            console.log(res.data);
            if (res.data === 'success') {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'User Details Updated!',
                    showConfirmButton: false,
                    timer: 1500
                })
                showAll();
            }
        })
    }

    function fetchUser(userId) {
        axios.get(`http://localhost:3000/getUser?id=${userId}`)
            .then((res) => {
                console.log("User Data: " + res.data);
                let data = res.data;
                setemID(userId);
                setemName(data[0].name);
                setemDesg(data[0].designation);
                setemDept(data[0].department);
                setemSal(data[0].salary);
                setemLoc(data[0].location);
            })
    }

    function deleteCat(userId) {
        Swal.fire({
            title: 'Do you want to delete this user?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't Delete`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                console.log('Confirmed')
                axios.get(`http://localhost:3000/deleteCat?id=${userId}`)
                    .then((res) => {
                        console.log(res.data);
                        if (res.data === 'Deleted') {
                            Swal.fire('Deleted', '', 'success')
                            showAll();
                        }
                    });

            } else if (result.isDenied) {
                console.log('Denied')
                Swal.fire('Delete Cancelled', '', 'info');
                showAll();
            }
        })
    }
    
    function addUser() {
        axios.post('http://localhost:3000/addUser', {
            addName,
            addDesg,
            addDept,
            addSal,
            addLoc
        }).then(res => {
            console.log(res.data);
            if(res.data==='Added'){
                Swal.fire('User Added', '','success')
            }
            showAll();
        });
    }

    function showAll(){
        axios.get('http://localhost:3000/getData')
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
    }

    useEffect(() => {
        showAll();
    }, []);

    return (
        <>
            <div className="main-cont">
                <div className="top-sect d-flex justify-content-center align-items-center">
                    <div className="nav-title text-light text-uppercase font-weight-bolder">
                        <h2>INFOSYS SPRING</h2>
                    </div>
                </div>
                <div className="mid-sect w-75">
                    <div className="table_cont d-flex justify-content-center align-items-center w-100">
                        <table className="table-hover table-bordered w-100">
                            <thead>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Department</th>
                            <th>Salary</th>
                            <th>Location</th>
                            <th colSpan={2}>Options</th>
                            </thead>
                            <tbody>
                            {
                                data.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                {value.name}
                                            </td>
                                            <td>
                                                {value.designation}
                                            </td>
                                            <td>
                                                {value.department}
                                            </td>
                                            <td>
                                                {value.salary}
                                            </td>
                                            <td>
                                                {value.location}
                                            </td>
                                            <td>
                                                <button title="Edit" onClick={() => fetchUser(value.id)} className="btn btn-outline-info" data-toggle="modal" data-target="#editModal"><i className="fa-solid fa-pen-to-square"></i></button>
                                            </td>
                                            <td>
                                                <button title="Delete" onClick={() => deleteCat(value.id)} className="btn btn-outline-danger"><i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="options mt-5">
                        <h2 className="text-light">Options</h2>
                        <div className="opCont d-flex align-items-center">
                            <div className="opBtns px-5">
                                <button className="btn btn-outline-light" data-toggle="modal" data-target="#addModal">ADD</button>
                            </div>
                            <div className="search px-5 d-flex align-items-center">
                                <input type="text" name="search" id="search" placeholder="search data..." onChange={(e)=>setSearch(e.target.value)}/>
                                <button className="btn btn-outline-light mx-2" onClick={searchData}>Search</button>
                                <button className="btn btn-outline-light mx-2" onClick={showAll}>Show All</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  Edit Modal  */}
                <div>
                    <div className="modal fade" id="editModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Edit User Details</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form className="border border-light p-5">
                                        <p className="h4 mb-4">User Details</p>
                                        <div className="d-flex flex-column">
                                            <label htmlFor="emName">Name</label>
                                            <input type="text" id="emName" className="input-group mb-2" onChange={(e) => setNewName(e.target.value)} defaultValue={emName}/>
                                            <label htmlFor="emDesg" className="mt-2">Designation</label>
                                            <input type="text" id="emDesg" className="input-group mb-2" onChange={(e) => setnewDesg(e.target.value)} defaultValue={emDesg}/>
                                            <label htmlFor="edDept" className="mt-2">Department</label>
                                            <input type="text" id="edDept" className="input-group mb-2" onChange={(e) => setnewDept(e.target.value)} defaultValue={emDept}/>
                                            <label htmlFor="edSal" className="mt-2">Salary</label>
                                            <input type="number" id="edSal" className="input-group mb-2" onChange={(e) => setnewSal(e.target.value)} defaultValue={emSal}/>
                                            <label htmlFor="edLoc" className="mt-2">Location</label>
                                            <input type="text" id="edLoc" className="input-group mb-2" onChange={(e) => setnewLoc(e.target.value)} defaultValue={emLoc}/>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={edit}>Edit Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  Edit Modal End  */}
                {/*  Add Modal  */}
                <div>
                    <div className="modal fade" id="addModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add User</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form className="border border-light p-5">
                                        <p className="h4 mb-4">Employee Details</p>
                                        <div className="d-flex flex-column">
                                            <label htmlFor="emName">Name</label>
                                            <input type="text" id="emName" className="input-group mb-2" onChange={(e) => setAddName(e.target.value)} placeholder="Name"/>
                                            <label htmlFor="emDesg" className="mt-2">Designation</label>
                                            <input type="text" id="emDesg" className="input-group mb-2" onChange={(e) => setaddDesg(e.target.value)} placeholder="designation"/>
                                            <label htmlFor="edDept" className="mt-2">Department</label>
                                            <input type="text" id="edDept" className="input-group mb-2" onChange={(e) => setaddDept(e.target.value)} placeholder="department"/>
                                            <label htmlFor="edSal" className="mt-2">Salary</label>
                                            <input type="number" id="edSal" className="input-group mb-2" onChange={(e) => setaddSal(e.target.value)} placeholder="salary"/>
                                            <label htmlFor="edLoc" className="mt-2">Location</label>
                                            <input type="text" id="edLoc" className="input-group mb-2" onChange={(e) => setaddLoc(e.target.value)} placeholder="location"/>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={addUser}>Add User</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  Add Modal End  */}
            </div>
        </>
    )
}