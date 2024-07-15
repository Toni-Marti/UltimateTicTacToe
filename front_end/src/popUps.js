import './popUps.css'; 

function Overlay () {
    return (<div className='Overlay' />)
}

function EmptyPopUp ({children, className}) {
    return (
        <div className={"PopUp " + className}>
            {children}
        </div>
    )
}

function MessagePopUp ({message="This is a message pop up :)", onClick=()=>null, buttonText="Accept", className=""}) {
    return (
        <EmptyPopUp className={className}>
            <p>{message}</p>
            <button onClick={onClick}>{buttonText}</button>
        </EmptyPopUp>
    )
}

function TwoButtonPopUp ({message="", negativeOnClick=()=>null, positiveOnClick=()=>null, negativeButtonText="No", positiveButtonText="Yes", className =""}) {
    return (
        <EmptyPopUp className={className}>
            <p>{message}</p>
            <div className='ButtonsContainer'>
                <button className={negativeButtonText} onClick={negativeOnClick}>
                    {negativeButtonText}
                </button>
                <div className='buttonSpacing'/>
                <button className={negativeButtonText} onClick={positiveOnClick}>
                    {positiveButtonText}
                </button>
            </div>
        </EmptyPopUp>
    )
}

export { Overlay, EmptyPopUp, MessagePopUp, TwoButtonPopUp };