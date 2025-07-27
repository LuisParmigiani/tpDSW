import '../../index.css';
import { Link } from 'react-router-dom';


function LogoName(){

    return(
        <>
            <Link to="/">
                <div className="flex items-center space-x-2 justify-center ">
                    <div className="min-w-10 w-14  " >
                        <img src="/images/logo.png" alt="Logo" className=" " />
                    </div>
                    <b className="text-(--color-naranja-1) text-xl">
                        NombreEmpresa
                    </b>
                </div>
            </Link>
        </>
    )

}

export default LogoName