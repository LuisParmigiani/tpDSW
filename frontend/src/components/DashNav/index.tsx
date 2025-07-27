import React from 'react';
import "../../index.css";
import LogoName from '../../components/LogoName/LogoName.tsx'
import DashboardLi from '../DashboardLi/DashboardLi.tsx'

function DashNav(){
    return(
        <>
            <div className="w-1/5 flex-col justify-center bg-amber-400 pb-10 pt-10 ">
                <div className="">
                    <LogoName/>
                </div>
                <div className="flex-row">
                    <DashboardLi text='Perfil' imgUrl='/images/tuerca.png'/>
                </div>
            </div>
            
        </>
    )

}


export default DashNav