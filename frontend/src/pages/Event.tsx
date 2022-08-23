import { useCallback, useEffect, useMemo, useState } from "react";
import LateralInfo from "../components/LateralInfo";
import { v4 as uuidv4 } from 'uuid';
import { Link, useParams } from "react-router-dom";
import InputOBS from "../components/InputOBS";
import Clock from "../components/Clock";
import Header from "../components/Header";
import Overview from "../components/Overview";
import RunesInfo from "../components/RunesInfo";
import GoldInfo from "../components/GoldInfo";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

declare type dispatchWS = {
    type: string
    body: { [key: string]: any }
}

export interface displayInfo {
    lateral: boolean
    clock: boolean
    header: boolean
    overview: boolean
    runes: boolean
    gold: boolean
}

const Event: React.FC = () => {
    let params = useParams();
    const [ws, setWS] = useState<WebSocket | null>(null)
    const [game, setGame] = useState("")
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [chornoInterval, setChronoInterval] = useState<number | null>(null);
    const [frames, setFrames] = useState(new Map())
    const [event, setEvent] = useState<any>(null);
    const [displayInfo, setDisplayInfo] = useState<displayInfo>({
        lateral: false,
        clock: true,
        header: false,
        overview: false,
        runes: false,
        gold: false
    });
    const [fetching, setFetching] = useState(false);
    const [frame, setFrame] = useState<any>({});
    const [showLinks, setShowLinks] = useState(true);

    useEffect(() => {
        setFrame((prevState: any) => {
            return frames.has(time) ? { ...prevState, ...frames.get(time) } : prevState;
        })

        if (ws == null || !ws.OPEN) {
            return
        }

        let newMessage: dispatchWS = {
            type: "frame",
            body: {
                ...frame,
                time: time
            }
        }
        ws.send(JSON.stringify(newMessage))
    }, [ws, time, frames])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`https://api.lolhub.gg/lolesports/event/${params.eventId}`);
            const data = await res.json();
            setEvent(data);
            if (data?.event?.state == "ended") {
                clearInterval(interval)
            }
        }
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 10000)

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:34920`);
        ws.onopen = function () {
            console.log("Connected to websocket");
            setWS(ws)
        };

        ws.onerror = function (error) {
            console.log('WebSocket Error ' + JSON.stringify(error));
        }

        ws.onclose = function (event) {
            console.log('WebSocket closed ' + JSON.stringify(event));
            setWS(null)
        }
    }, []);

    useEffect(() => {
        if (ws == null || !ws.OPEN) {
            return
        }

        let newMessage: dispatchWS = {
            type: "display",
            body: {
                "event": params.eventId,
                "game": game,
                ...displayInfo
            }
        }
        ws.send(JSON.stringify(newMessage))
    }, [ws, params.eventId, game, displayInfo])

    useEffect(() => {
        if (fetching || frames.has(time) && frames.has(time + 5) || game == "") return
        setFetching(true)
        fetch(`https:/api.lolhub.gg/lolesports/frames/${game}/${time}`).
            then(res => res.json()).
            then(frames => {
                setFetching(false)
                if (!Array.isArray(frames)) return
                setFrames((prev) => {
                    let newMap = new Map(prev)
                    frames.forEach((frame: any) => {
                        newMap.set(frame.second, frame)
                    })
                    newMap.forEach((frame: any, key: number) => {
                        if (key < time - 5) {
                            newMap.delete(key)
                        }
                    })
                    return newMap
                })
            }).catch(err => {
                console.error(err)
                setFetching(false)
            });
    }, [game, time])

    const startChrono = useCallback(() => {
        if (running) return
        setRunning(true)
        let chronoInterval = setInterval(() => {
            setTime(time => time + 1)
        }, 1000)
        setChronoInterval(chronoInterval)
    }, [running, setRunning, setTime, setChronoInterval]);

    const stopChrono = useCallback(() => {
        if (!running) return

        setRunning(false)
        if (chornoInterval) {
            clearInterval(chornoInterval)
        }
        setChronoInterval(null)
    }, [running]);

    let horas: string | number = Math.floor(time / 3600)
    let minutos: string | number = Math.floor((time / 60) % 60)
    let segundos: string | number = Math.floor(time % 60)
    segundos = segundos < 10 ? "0" + segundos : segundos
    minutos = horas > 0 && minutos < 10 ? "0" + minutos : minutos

    const blueSide = event?.games != undefined ? event?.games[game]?.game_metadata?.blueTeamMetadata : undefined
    const redSide = event?.games != undefined ? event?.games[game]?.game_metadata?.redTeamMetadata : undefined

    const pancarta = <Pancarta event={event} setGame={setGame} />

    return (
        <div className="bg-dark-bg h-screen overflow-auto">
            <div className="flex space-x-2 justify-center my-1 font-semibold">
                <Link className="rounded-md bg-palette-teal p-1" to={`/`}>
                    Home
                </Link>
                <button className="rounded-md bg-palette-teal p-1" onClick={() => setShowLinks(!showLinks)}> {showLinks ? "Hide" : "Show"} Links </button>
            </div>
            <main className="flex flex-col justify-center space-y-2">
                <>
                    <div className="flex flex-col justify-start md:hidden">
                        {pancarta}
                    </div>
                    <div className="flex justify-around">
                        <div className="flex flex-col lg:w-64 text-xl">
                            <p className="text-2xl font-bold">Control Panel</p>
                            <div className="sm:grid sm:grid-cols-2 gap-x-6 flex flex-col justify-center">
                                {Object.entries(displayInfo).map(([key, value]) => (
                                    <div className="flex space-x-2 self-center">
                                        <p className="text-left w-20">{key}</p>
                                        <button className="self-center" onClick={() => {
                                            setDisplayInfo((displayInfo: any) => {
                                                displayInfo[key] = !value
                                                return { ...displayInfo }
                                            })
                                        }}>
                                            {value ?
                                                <EyeIcon className="h-5 w-5 text-palette-teal self-center" /> :
                                                <EyeOffIcon className="h-5 w-5 text-palette-teal self-center" />
                                            }
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:flex flex-col justify-start hidden">
                            {pancarta}
                        </div>

                        <div className="flex flex-col lg:w-64">
                            <Clock horas={horas} minutos={minutos} segundos={segundos} setTime={setTime} startChrono={startChrono} stopChrono={stopChrono} />
                            <InputOBS showLink={showLinks} link={`header`} hidden={displayInfo["clock"]} id={"clock"} setDisplayInfo={setDisplayInfo} />
                        </div>

                    </div>
                    <div className="xl:flex justify-center">
                        {game != "" &&
                            <>
                                <div className="border-2 border-white p-1 flex flex-col">
                                    <InputOBS showLink={showLinks} link={`lateral`} hidden={displayInfo["lateral"]} id={"lateral"} setDisplayInfo={setDisplayInfo} />
                                    <div className="flex flex-col xl:flex-row self-center w-full">
                                        <LateralInfo side={"Blue Side"} team={blueSide} game={event?.games[game]} teams={event.event.match.teams} />
                                        <LateralInfo side={"Red Side"} team={redSide} game={event?.games[game]} teams={event.event.match.teams} />
                                    </div>
                                </div>
                                {frame != {} &&
                                    <>
                                        <div className="flex flex-col">
                                            <div className="h-fit border-2 border-white p-1">
                                                <Header showLinks={showLinks} window_frame={frame?.window_frame} teams={event?.event?.match?.teams} blue_side_id={blueSide?.esportsTeamId} red_side_id={redSide?.esportsTeamId}
                                                    displayInfo={displayInfo} setDisplayInfo={setDisplayInfo} />
                                            </div>
                                            <div className="flex flex-col h-fit border-2 border-white p-1">
                                                <InputOBS showLink={showLinks} link={`overview`} hidden={displayInfo["overview"]} id={"overview"} setDisplayInfo={setDisplayInfo} />
                                                <Overview second={time} frame={frame?.frame || {}} game={event?.games[game] || {}} />
                                            </div>

                                            <div className="flex flex-col border-2 border-white p-1">
                                                <InputOBS showLink={showLinks} link={`runes`} hidden={displayInfo["runes"]} id={"runes"} setDisplayInfo={setDisplayInfo} />
                                                <RunesInfo team={blueSide} game={event?.games[game]} />
                                                <RunesInfo team={redSide} game={event?.games[game]} />
                                            </div>
                                        </div>
                                        <div className="border-2 border-white p-1 flex flex-col">
                                            <InputOBS showLink={showLinks} link={`gold`} hidden={displayInfo["gold"]} id={"gold"} setDisplayInfo={setDisplayInfo} />
                                            <div className="flex self-center w-full">
                                                <GoldInfo frame={frame?.frame || {}} game={event?.games[game] || {}} />
                                            </div>
                                        </div>
                                    </>
                                }
                            </>
                        }
                    </div>
                </>
            </main >
        </div >
    );
};

const Pancarta: React.FC<{ event: any, setGame: any }> = ({ event, setGame }) => {
    if (!event) return <></>

    return <>
        <div className="flex justify-center">
            <div className="w-14 h-14 relative self-center">
                {event.event?.league?.image &&
                    <img src={event.event.league.image} />
                }
            </div>
        </div>
        {
            event.event?.match ?
                <div className="flex justify-around space-x-0.5 self-center space-y-1">
                    {event.event.match?.teams?.length > 0 &&
                        <>
                            <div className="h-12 w-12 relative  self-center">
                                <img src={event.event.match.teams[0]?.image} />
                            </div>
                            <div className="self-center">{event.event.match.teams[0]?.code}</div>
                        </>
                    }

                    <div className='self-center h-full'>vs</div>
                    {event.event.match?.teams?.length > 1 &&
                        <>
                            <div className="self-center">{event.event.match.teams[1]?.code}</div>
                            <div className="h-12 w-12 relative">
                                <img src={event.event.match.teams[1]?.image} />
                            </div>
                        </>
                    }
                </div> :
                <div>"No match"</div>
        }

        {
            event.event?.match?.games &&
            <div className="flex justify-center space-x-1">
                {event.event.match.games.map((game: any, index: number) => {
                    if (event.games != null && event.games[game.id]?.game_metadata) {
                        return (
                            <button onClick={() => setGame(game.id)} key={index} className="bg-palette-teal p-1 rounded-sm font-semibold">Match {game.number}</button>
                        )
                    }
                })}
            </div>
        }
    </>
}


export default Event;
