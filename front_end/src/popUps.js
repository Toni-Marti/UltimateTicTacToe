import './popUps.css'; 

function Overlay ({onClick=null}) {
    return (<div className='Overlay' onClick={onClick}/>)
}

function EmptyPopUp ({children, className}) {
    return (
        <div className={"EmptyPopUp " + className}>
            {children}
        </div>
    )
}

function MessagePopUp ({children="This is a message pop up :)", onClick=()=>null, buttonText="Accept", className=""}) {
    return (
        <EmptyPopUp className={className}>
            <p>{children}</p>
            <button onClick={onClick}>{buttonText}</button>
        </EmptyPopUp>
    )
}

function TwoButtonPopUp ({children="This is a two button pop up :)   ", negativeOnClick=()=>null, positiveOnClick=()=>null, negativeButtonText="No", positiveButtonText="Yes", className =""}) {
    return (
        <EmptyPopUp className={className}>
            <p>{children}</p>
            <div className='TBPUButtonsContainer'>
                <button className={"NegativeButton"} onClick={negativeOnClick}>
                    {negativeButtonText}
                </button>
                <button className={"PositiveButton"} onClick={positiveOnClick}>
                    {positiveButtonText}
                </button>
            </div>
        </EmptyPopUp>
    )
}

export { Overlay, EmptyPopUp, MessagePopUp, TwoButtonPopUp };