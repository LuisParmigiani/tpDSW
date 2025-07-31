import '../../index.css'
type Props = {
    text: string;
    imgUrl: string,
};

function dashboardLi({text,imgUrl}:Props){

    return(
        <div className="flex  justify-between px-3 hover:bg-(--color-naranja-2) hover:text-white transition-colors duration-200">
            <div className="flex items-center space-x-2">
                <div className='w-7 h-7'>
                    <img src={imgUrl} alt="icono" />
                </div>
                <span className="text-sm text-center text-(--color-naranja-1) ">{text}</span>
            </div>
            <div className="w-3 h-3 justify-self-end">
                <img src="/images/flechita.png" alt="flechita"></img>    
            </div>   
        </div>

    )
}

export default dashboardLi