
interface Props {
    frame: any
    game: any
}

const GoldInfo: React.FC<Props> = ({ frame, game }) => {
    return <div className="flex flex-col justify-start w-full space-y-0.5">
        {[...frame.participants || []]?.sort((a: any, b: any) => (b.totalGoldEarned - a.totalGoldEarned)).map((participant: any, index: number, arr: any) => {

            let player
            if (participant?.participantId < 6) {
                player = game?.game_metadata?.blueTeamMetadata?.participantMetadata?.find((p: any) => p.participantId === participant.participantId)
            } else {
                player = game?.game_metadata?.redTeamMetadata?.participantMetadata?.find((p: any) => p.participantId === participant.participantId)
            }

            return <div className="flex self-center max-w-[400px] w-full space-x-1" key={participant?.participantId}>
                <div className="w-[50px] h-[50px] relative self-center">
                    <img src={`/champs/${player?.championId}.webp`} />
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex justify-between w-full'>
                        <p>{player?.summonerName}</p>
                        <p>{participant?.totalGoldEarned}</p>
                    </div>
                    <div className='w-full h-3'>
                        <div className={`transition-all duration-500  h-full ${participant?.participantId < 6 ? "bg-palette-blue" : "bg-palette-red"}`} style={{ width: Math.round(((participant?.totalGoldEarned * 100) / arr[0]?.totalGoldEarned) / 5) * 5 + '%' }}></div>
                    </div>
                </div>
            </div>
        })}
    </div >
}

export default GoldInfo;