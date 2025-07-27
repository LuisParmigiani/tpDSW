import '../../index.css'
type Props = {
    text: string;
    imgUrl: string,
};

function dashboardLi({text,imgUrl}:Props){

    return(
        <div className="flex justify-between w-full">
            <div className="flex items-center justify-center space-x-2">
                <div className='w-6 h-6'>
                    <img src={imgUrl} alt="icono" />
                </div>
                <span className="text-sm text-center ">{text}</span>
            </div>
            <div>
                <img src="/images/flechita.png" alt="flechita"></img>    
            </div>   
        </div>

    )
}

export default dashboardLi