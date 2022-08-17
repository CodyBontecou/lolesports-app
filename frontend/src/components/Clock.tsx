
declare type Props = {
    horas: number | string
    minutos: number | string
    segundos: number | string
    setTime: React.Dispatch<React.SetStateAction<number>>
    startChrono: () => void
    stopChrono: () => void
}

const Clock: React.FC<Props> = ({ horas, minutos, segundos, setTime, startChrono, stopChrono }) => {

    return (
        <div className="flex flex-col self-center bg-dark-block py-2 rounded-sm">
            <div className="flex justify-center text-6xl h-20">
                <input className="w-20 text-right bg-dark-block" onChange={(e) => { if (!isNaN(Number(e.target.value))) setTime(Number(e.target.value) * 3600 + Number(minutos) * 60 + Number(segundos)) }} value={horas} />
                :
                <input className="w-20 text-right bg-dark-block" onChange={(e) => { if (!isNaN(Number(e.target.value))) setTime(Number(horas) * 3600 + Number(e.target.value) * 60 + Number(segundos)) }}
                    value={minutos} />
                :
                <input className="w-20 text-right bg-dark-block" onChange={(e) => { if (!isNaN(Number(e.target.value))) setTime(Number(horas) * 3600 + Number(minutos) * 60 + Number(e.target.value)) }}
                    value={segundos} />
            </div>
            <div className="flex self-center space-x-2">
                <button className="self-center bg-dark-block font-bold border-2 rounded-sm p-1 mt-2" onClick={startChrono}>Start</button>
                <button className="self-center bg-dark-block font-bold border-2 rounded-sm p-1 mt-2" onClick={stopChrono}>Stop</button>
                <button className="self-center bg-dark-block font-bold border-2 rounded-sm p-1 mt-2" onClick={() => setTime(0)}>Reset</button>
            </div>
        </div>
    )
}

export default Clock;