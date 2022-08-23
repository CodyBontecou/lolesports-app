import svg from '../assets/images/git-tower-icon.svg'
import { displayInfo } from '../pages/Event'
import { Gold } from './GoldSVG'
import InputOBS from './InputOBS'

interface Props {
    teams: any
    window_frame?: any
    blue_side_id?: any
    red_side_id?: any
    displayInfo: displayInfo
    setDisplayInfo: React.Dispatch<React.SetStateAction<displayInfo>>
    showLinks: boolean
}

const Header: React.FC<Props> = ({ window_frame, teams, blue_side_id, red_side_id, displayInfo, setDisplayInfo, showLinks }) => {
    return <div className='flex flex-col'>
        <div className="flex h-fit justify-center text-sm font-extrabold bg-dark-innerblock space-x-6 self-center">
            {/* BLUE SIDE */}
            {teams.filter((team: any) => team.id === blue_side_id).map((team: any, index: number) =>
                <div className="flex h-fit space-x-2" key={index}>
                    <div className="h-14 w-14 relative self-center">
                        <img src={team.image} />
                    </div>
                    <div className="text-center leading-4 self-center ">
                        <p>{team.code}</p>
                        <p>{team.record.wins}-{team.record.losses}</p>
                    </div>
                </div>
            )}
            <div className="flex self-center space-x-1 text-base">
                <img className="h-7 w-8" src={svg} />
                <p className='self-center'>{window_frame?.blueTeam?.towers || 0}</p>
            </div>
            <div className="flex self-center space-x-1">
                <Gold className='w-6 h-6' fill='white'></Gold>
                <p className='self-center w-10 text-left'>{window_frame?.blueTeam?.totalGold ? Math.round(window_frame.blueTeam.totalGold / 100) / 10 : 2.5}K</p>
            </div>
            <p className='self-center text-4xl'>{window_frame?.blueTeam?.totalKills || 0}</p>
            <p className='self-center text-4xl'> - </p>
            {/* RED SIDE */}
            <p className='self-center text-4xl'>{window_frame?.redTeam?.totalKills || 0}</p>
            <div className="flex self-center space-x-1">
                <p className='self-center w-10 text-right'>{window_frame?.redTeam?.totalGold ? Math.round(window_frame.redTeam.totalGold / 100) / 10 : 2.5}K</p>
                <Gold className='w-6 h-6' fill='white'></Gold>
            </div>
            <div className="flex self-center space-x-1  text-base">
                <p className='self-center'>{window_frame?.redTeam?.towers || 0}</p>
                <img className="h-7 w-8" src={svg} />
            </div>
            {teams.filter((team: any) => team.id === red_side_id).map((team: any, index: number) =>
                <div className="flex h-fit space-x-2" key={index}>
                    <div className="text-center leading-4 self-center ">
                        <p>{team.code}</p>
                        <p>{team.record.wins}-{team.record.losses}</p>
                    </div>
                    <div className="h-14 w-14 relative self-center">
                        <img src={team.image} />
                    </div>
                </div>
            )}
        </div>
        <div className='flex justify-around'>
            <div className='flex w-20'>
                {window_frame?.blueTeam?.dragons.map((dragon: any, index: number) => (
                    <img key={index} className='w-5 h-5' src={`/dragons/dragonsoulicon${dragon}.png`} />
                ))}
            </div>
            <div className='mt-1'>
                <InputOBS showLink={showLinks} link={`header`} hidden={displayInfo["header"]} id={"header"} setDisplayInfo={setDisplayInfo} />
            </div>
            <div className='flex justify-end w-20'>
                {window_frame?.redTeam?.dragons.map((dragon: any, index: number) => (
                    <img key={index} className='w-5 h-5' src={`/dragons/dragonsoulicon${dragon}.png`} />
                ))}
            </div>
        </div>
    </div>
}

export default Header;