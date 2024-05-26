import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import Dashboard from '../components/Dashboard';
import AddProperty from '../components/AddProperty';

const SellerDash = () => {

    const location = useLocation();
    const [tab, setTab] = React.useState('');

    useEffect(()=> {
       const urlParams = new URLSearchParams(location.search);
       const tabFormUrl = urlParams.get('tab');
       if(tabFormUrl) {
        setTab(tabFormUrl);
       }
    },[location.search])

  return (
    <div className='flex'>
       <div className='w-[15%] pt-10'>
          <DashSidebar  />
       </div>
       <div className='bg-gray-400 w-[85%] min-h-screen'>
         {(tab === 'dash' || !tab) && <Dashboard />}
         {tab === 'add' && <AddProperty />}
       </div>
    </div>
  )
}

export default SellerDash;