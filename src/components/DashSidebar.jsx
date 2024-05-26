import { Box, MenuItem, MenuList } from "@mui/material";
import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiChartPie, HiOfficeBuilding,  } from 'react-icons/hi'

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
    return () => {
      setTab("");
    };
  }, [location.search]);

  return (
    <Sidebar className="w-full">
        <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-1 ">
               <Link to='/dashboard?tab=dash'>
                 <Sidebar.Item
                   active={tab === 'dash' || !tab}
                   icon={HiChartPie}
                   as='div'
                   className="flex gap-2"
                 >
                   Dashboard
                 </Sidebar.Item>
               </Link>
               <Link to='/dashboard?tab=add'>
                 <Sidebar.Item
                   active={tab === 'add'}
                   icon={HiOfficeBuilding}
                   as='div'
                   className="flex gap-2"
                 >
                   Add Property
                 </Sidebar.Item>
               </Link>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
