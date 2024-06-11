interface Props {

    params: {details:string}

}

export default function({params}:Props){
    return(
        <>
        <h1>Perfil : {params.details}</h1>
        </>
    )
}