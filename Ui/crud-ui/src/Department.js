import React, { useState, useEffect } from 'react';
import { variables } from './Variables.js';
import { v4 as uuidv4 } from 'uuid';

const Department = () => {
    
    const [ departments, setDepartments ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ modalState, setModalState ] = useState({
    modalTitle: "",
    DepartmentName: "",
    DepartmentId: 0 });
    const [ filterState, setFilterState ] = useState({ 
    DepartmentIdFilter:"",
    DepartmentNameFilter:"",
    departmentsWithoutFilter:[] });

    useEffect(() => {
        fetch(variables.API_URL+'department')
            .then(response => response.json())
            .then(data => {
                setDepartments(data);
                setFilterState({...filterState, departmentsWithoutFilter:data});
                setIsLoading(false);
            });

        }, []);


    const callFetch = () => {
        
        fetch(variables.API_URL+'department')
            .then(response => response.json())
            .then(data => {
                setDepartments(data);
                setFilterState({...filterState, departmentsWithoutFilter:data});
                setIsLoading(false);
            });
    }

    const changeDepartmentName = (e) => {
        setModalState({...modalState, DepartmentName:e.target.value});
    }

    const changeDepartmentIdFilter = (e) => {
        setFilterState({ ...filterState, DepartmentIdFilter:e.target.value });
        filterFn();
    }

    const changeDepartmentNameFilter = (e) => {
        setFilterState({ ...filterState, DepartmentNameFilter:e.target.value });
        filterFn();
    }

    const addClick = () => {
        setModalState({modalTitle:"Add Department", DepartmentId:0, DepartmentName:""});
    }
    const editClick = (dep) => {
        setModalState({modalTitle:"Edit Department", DepartmentId:dep.DepartmentId, DepartmentName:dep.DepartmentName});
    }
    const createClick = () => {
        fetch(variables.API_URL+'department',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                DepartmentName:modalState.DepartmentName
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            setIsLoading(true);
            callFetch();
        },(error)=>{
            alert('Failed');
        })

    }
    
    const updateClick = () => {
        fetch(variables.API_URL+'department',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                DepartmentId:modalState.DepartmentId,
                DepartmentName:modalState.DepartmentName
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            setIsLoading(true);
            callFetch();
        },(error)=>{
            alert('Failed');
        })

    }

    const deleteClick = (id) => {
        console.log("DEPARTMENTID", id);
        if(window.confirm('Are you sure about that?')){
        fetch(variables.API_URL+'department/'+id,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            setIsLoading(true);
            callFetch();
        },(error)=>{
            alert('Failed');
        })
      }
    }
    
    const filterFn = () => {

        let filteredData = filterState.departmentsWithoutFilter.filter(
            function(el){
                return el.DepartmentId.toString().toLowerCase().includes(
                filterState.DepartmentIdFilter.toString().trim().toLowerCase()
            )&&
        el.DepartmentName.toString().toLowerCase().includes(
            filterState.DepartmentNameFilter.toString().trim().toLowerCase()
            )
          }
        );

        console.log("FILTRO DE DATOS",filterState);
        
        setDepartments(filteredData);
    }
    
    const sortResult = (prop,asc) => {
        let sortedData = filterState.departmentsWithoutFilter.sort((a,b) => {
            if(asc){
                console.log("AQUI ESTA LA A",a[prop]);
                return (a[prop] > b[prop]) ? 1:((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1:((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        console.log("SORTED DATA",sortedData);

        setDepartments(sortedData);

        console.log("DEPARTAMENTOS",departments);
    }

    return (
      <div>
          <button type="button"
          className="btn btn-primary m-2 float-end"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={()=>addClick}>
              Add Department
          </button>

          <table className="table table-striped">
          <thead>
          <tr>
              <th>
                  <div className="d-flex flex-row">

                  <input className="form-control m-2"
                  onChange={changeDepartmentIdFilter}
                  placeholder="Filter"
                  />

                  <button type="button" className="btn btn-light"
                  onClick={()=>sortResult('DepartmentId',true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-numeric-down" viewBox="0 0 16 16">
                      <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z"/>
                      <path fillRule="evenodd" d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
                      <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                      </svg>
                  </button>

                  <button type="button" className="btn btn-light"
                  onClick={()=>sortResult('DepartmentId',false)}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-numeric-down-alt" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.36 7.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.836 1.973-1.836 1.09 0 2.063.637 2.063 2.688 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
                     <path d="M12.438 8.668V14H11.39V9.684h-.051l-1.211.859v-.969l1.262-.906h1.046zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                     </svg>
                  </button>

                  </div>
                  DepartmentID
              </th>
              <th>
                <div className="d-flex flex-row">
                  <input className="form-control m-2"
                  onChange={changeDepartmentNameFilter}
                  placeholder="Filter"
                  />
                  
                  <button type="button" className="btn btn-light"
                  onClick={()=>sortResult('DepartmentName',true)}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                     <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                     <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                     </svg>
                  </button>

                  <button type="button" className="btn btn-light"
                  onClick={()=>sortResult('DepartmentName',false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down-alt" viewBox="0 0 16 16">
                        <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"/>
                        <path fillRule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"/>
                        <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                        </svg>
                  </button>

                  </div>

                  DepartmentName
              </th>
              <th>
                  Options
              </th>
          </tr>
          </thead>
          <tbody>
              {departments.map((dep) => {
                  if(isLoading) {
                      return <h3 key={uuidv4()}>Cargando...</h3>
                  }
                  return (
                  <tr key={uuidv4()}>
                      <td>{dep.DepartmentId}</td>
                      <td>{dep.DepartmentName}</td>
                      <td>
                          <button type="button" className="btn btn-light mr-1" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>editClick(dep)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                  </svg>

                          </button>
                          <button type="button" className="btn btn-light mr-1" onClick={() => deleteClick(dep.DepartmentId)}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                             <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                             </svg>
                          </button>
                      </td>
                  </tr>)
              })}
          </tbody>
          </table>
          
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modla-lg modal-dialog-centered">
          <div className="modal-content">
             <div className="modal-header">
                <h5 className="modal-title">{modalState.modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
             </div>
             
             <div className="modal-body">
                <div className="input-group mb-3">
                    <span className="input-group-text">DepartmentName</span>
                    <input type="text" className="form-control" value={modalState.DepartmentName} onChange={changeDepartmentName}/>
                </div>
                
                {modalState.DepartmentId==0?
                <button type="button"
                className="btn btn-primary float-start"
                onClick={createClick}
                >Create</button>
                :null}

                {modalState.DepartmentId!==0?
                <button type="button"
                className="btn btn-primary float-start"
                onClick={updateClick}
                >Update</button>
                :null}


             </div>

          </div>
          </div>
          </div>


      </div>
    )
}

export default Department;
