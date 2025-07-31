import React from 'react';
import "../../index.css";
import LogoName from '../../components/LogoName/LogoName.tsx'
import DashboardLi from '../DashboardLi/DashboardLi.tsx'

function DashNav(){
    return(
        <>
            <div className="w-1/5 flex-col justify-center place-items-center  bg-amber-400 pb-10 pt-10 h-screen">
                <div className="w-80 bg-fuchsia-500 ">
                    <div className="">
                        <LogoName/>
                    </div>
                    <div className="w-80" >
                        <DashboardLi text='Perfil' imgUrl='/images/tuerca.png'/>
                    </div>
                </div>
            </div>
            
        </>
    )

}


export default DashNav