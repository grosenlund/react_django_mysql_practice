import { useState } from 'react'
import './App.css'
import {useTable,useGlobalFilter,useSortBy,usePagination} from 'react-table'
import * as React from 'react'
import axios from 'axios'

function App() {

  const [emps, setEmps]=useState([])
  const columns=React.useMemo(()=> [
    {Header:"EmpId",accessor:"id"},
    {Header:"Name",accessor:"name"},
    {Header:"Department",accessor:"department"},
    {Header:"Role",accessor:"role"},
    {Header:"Edit",id:"edit",accessor:"edit",
      Cell:props=>(<button className='editBtn' onClick={()=>populateEmpData(props.cell.row.original)} >Edit</button>)
    },
    {Header:"Delete",id:"delete",accessor:"delete",
      Cell:props=>(<button className='deleteBtn' onClick={()=>handleDelete(props.cell.row.original)} >Delete</button>)
    }
  ],[]);

  const [showCancel,setShowCancel]=useState(false);

  const data=React.useMemo(()=>emps,[]);
  const {getTableProps,getTableBodyProps,headerGroups,page,prepareRow,setGlobalFilter,state,pageCount,previousPage,nextPage,canPreviousPage,canNextPage,gotoPage}=useTable({columns,data:emps,initialState:{pageSize:4}},useGlobalFilter,useSortBy,usePagination);
  const {globalFilter,pageIndex}=state;
  const [empData,setEmpData]=useState({name:"",department:"",role:""})
  const setChangedValue=(e)=>{
    setEmpData({...empData,[e.target.name]:e.target.value});
    console.log("empData::",empData);
  }
  const populateEmpData=(emp)=>{
    setEmpData(emp);
    setShowCancel(true);
  }
  const getEmployees=()=>{
    axios.get("http://127.0.0.1:8000/api/employees/").then((rs)=>{
      console.log(rs.data);
      setEmps(rs.data);
    })
  }

  const addEditEmp=async(e)=>{
    e.preventDefault();
    if(empData.id){
      //update
      await axios.put(`http://127.0.0.1:8000/api/employees/${empData.id}/`,empData).then((rs)=>{
      console.log(rs.data);
    })
    }else{
      //add
      await axios.post("http://127.0.0.1:8000/api/employees/",empData).then((rs)=>{
      console.log(rs.data);
    })
    }
    clearAll();
  }


  const handleDelete=async(emp)=>{
    const isConfirmed=window.confirm("Are you sure you want to Delete?");
    if(isConfirmed){
      await axios.delete(`http://127.0.0.1:8000/api/employees/${emp.id}/`).then((rs)=>{
      console.log(rs.data);
      setEmpData(rs.data);
    })
    }
    window.location.reload();

  }

  const clearAll=()=>{
    setEmpData({name:"",department:"",role:""});
    getEmployees();
  }

  React.useEffect(()=>{
    getEmployees();
  },[]);

  
  const handlecancel=()=>{
    setEmpData({name:"",department:"",role:""});
  }

  return (
    <>
      <div className='empdiv'>
       <h3>Full Stack with React, Python & MySQL</h3>
       <div className='addeditpanel'>
        <div className='addeditpndiv'>
          <label htmlFor="name">Name</label><br />
          <input className='addeditpndivinput' value={empData.name} onChange={setChangedValue} type="text" name="name" id="name" />
        </div>
        <div className='addeditpndiv'>
          <label htmlFor="department">Department</label><br />
          <input className='addeditpndivinput' value={empData.department} onChange={setChangedValue} type="text" name="department" id="department" />
        </div>
        <div className='addeditpndiv'>
          <label htmlFor="role">Role</label><br />
          <input className='addeditpndivinput' value={empData.role} onChange={setChangedValue} type="text" name="role" id="role" />
        </div>
        <button className='addButton' onClick={addEditEmp}>{empData.id?"Update":"Add"}</button>
        <button className='cancelButton' disabled={!showCancel} onClick={handlecancel} >Cancel</button>
       </div>
       <input className='inputser' value={globalFilter || ""} onChange={(e)=>setGlobalFilter(e.target.value)} type="search" name="insearch" id="insearch" placeholder='Search Embployee Here' />
       <table className='emptable' {...getTableProps()}>
        <thead>
          {headerGroups.map((hdg)=>(
            <tr {...hdg.getHeaderGroupProps()} key={hdg.id}>
              {hdg.headers.map((col)=>(
                    <th {...col.getHeaderProps(col.getSortByToggleProps())} key={col.id}>{col.render('Header')}</th>
              ))}              
            </tr>
          ))}          
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row)=>{
            prepareRow(row);
            return (<tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell)=>(
                        <td {...cell.getCellProps()} key={cell.id}>{cell.render('Cell')}</td>
                      ))}                      
                    </tr>)
          })}          
        </tbody>
       </table>
       <div className='pagediv'>
        <button className='pagedivbtn' disabled={!canPreviousPage} onClick={()=>gotoPage(0)}>First</button>
        <button className='pagedivbtn' disabled={!canPreviousPage} onClick={previousPage}>Prev</button>
        <span className='idx' >{pageIndex+1} of {pageCount}</span>
        <button className='pagedivbtn' disabled={!canNextPage} onClick={nextPage}>Next</button>
        <button className='pagedivbtn' disabled={!canNextPage} onClick={()=>gotoPage(pageCount-1)}>Last</button>
       </div>
      </div>
    
    </>
  )
}

export default App
