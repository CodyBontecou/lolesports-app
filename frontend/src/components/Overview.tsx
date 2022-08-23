interface Props {
    second: number;
    frame?: any
    game: any
}

const Overview: React.FC<Props> = ({ frame, game, second }) => {
    return <div className='flex flex-col'>
        {[0, 1, 2, 3, 4].map(i => (
            <Line second={second} key={i}
                lineFrame={Array.isArray(frame?.participants) ? [frame.participants[i], frame.participants[i + 5]] : []}
                metadata={[game?.game_metadata?.blueTeamMetadata?.participantMetadata[i], game?.game_metadata?.redTeamMetadata?.participantMetadata[i]]}
            />
        ))}
    </div>
}

interface LineProps {
    lineFrame: any
    metadata: any
    second: number
}

const Line: React.FC<LineProps> = ({ lineFrame, metadata, second }) => {

    const goldDiff = Math.round((Number(lineFrame[0]?.totalGoldEarned || 0) - Number(lineFrame[1]?.totalGoldEarned || 0)) / 100) / 10;

    return <div className='flex space-x-1 font-medium bg-[#020114] w-fit relative justify-center self-center px-1'>
        {/*BLUE SIDE */}
        <div className='flex space-x-0.5shrink-0'>
            <Item item={Array.isArray(lineFrame[0]?.items) && lineFrame[0]?.items[0]} />
            <Item item={Array.isArray(lineFrame[0]?.items) && lineFrame[0]?.items[1]} />
            <Item item={Array.isArray(lineFrame[0]?.items) && lineFrame[0]?.items[2]} />
            <Item item={Array.isArray(lineFrame[0]?.items) && lineFrame[0]?.items[3]} />
            <Item item={Array.isArray(lineFrame[0]?.items) && lineFrame[0]?.items[4]} />
            <Item item={Array.isArray(lineFrame[0]?.items) && lineFrame[0]?.items[5]} />
            <Item item={Array.isArray(lineFrame[0]?.items) && lineFrame[0]?.items[6]} />
        </div>
        <div className='self-center text-center flex text-sm md:text-lg font-medium shrink-0'>
            <p className='w-4 text-center'>{lineFrame[0]?.kills || 0}</p>
            /
            <p className='w-4 text-center'>{lineFrame[0]?.deaths || 0}</p>
            /
            <p className='w-4 text-center'>{lineFrame[0]?.assists || 0}</p>
        </div>
        <div className="relative flex w-24 md:w-28 h-8 overflow-hidden justify-start text-xs md:text-sm shrink-0">
            <div className='z-10 self-center text-center flex space-x-0.5'><p className='text-right w-6 md:w-8'>{lineFrame[0]?.creepScore || 0}</p><p><span className='text-xs'>CS</span>({Math.round((lineFrame[0]?.creepScore || 0) * 600 / (second || 1)) / 10})</p></div>
            <div style={{ backgroundImage: `url('/champs_tile/${metadata[0]?.championId}.webp')` }} className="absolute w-14 h-14 -right-1 -top-1 bg-no-repeat bg-contain ">
            </div>
            <div className="absolute w-14 h-14 -right-1 top-0 bg-gradient-to-r from-[#020114] to-transparent">
            </div>
        </div>
        <div className='text-center self-center text-xs w-7 font-semibold shrink-0'>
            {goldDiff === 0 ? <>{goldDiff}K</> :
                (goldDiff > 0 ?
                    <>{"<" + goldDiff}K</> :
                    <>{-goldDiff + "K>"}</>
                )}
        </div>
        {/*RED SIDE */}
        <div className="relative flex w-24 md:w-28 h-8 overflow-hidden justify-end text-xs md:text-sm shrink-0">
            <div className='z-10 self-center text-center flex space-x-0.5'><p className='text-right w-6 md:w-8'>{lineFrame[1]?.creepScore || 0}</p><p><span className='text-xs'>CS</span>({Math.round((lineFrame[1]?.creepScore || 0) * 600 / (second || 1)) / 10})</p></div>
            <div style={{ backgroundImage: `url('/champs_tile/${metadata[1]?.championId}.webp')` }} className={`absolute w-14 h-14 -left-1 -top-1 bg-no-repeat bg-contain`}>
            </div>
            <div className="absolute w-14 h-14 -left-1 top-0 bg-gradient-to-l from-[#020114] to-transparent">
            </div>
        </div>
        <div className='self-center text-center flex text-sm md:text-lg font-medium shrink-0'>
            <p className='w-5 text-center'>{lineFrame[1]?.kills || 0}</p>
            /
            <p className='w-5 text-center'>{lineFrame[1]?.deaths || 0}</p>
            /
            <p className='w-5 text-center'>{lineFrame[1]?.assists || 0}</p>
        </div>
        <div className='flex space-x-0.5 shrink-0'>
            <Item item={Array.isArray(lineFrame[1]?.items) && lineFrame[1]?.items[0]} />
            <Item item={Array.isArray(lineFrame[1]?.items) && lineFrame[1]?.items[1]} />
            <Item item={Array.isArray(lineFrame[1]?.items) && lineFrame[1]?.items[2]} />
            <Item item={Array.isArray(lineFrame[1]?.items) && lineFrame[1]?.items[3]} />
            <Item item={Array.isArray(lineFrame[1]?.items) && lineFrame[1]?.items[4]} />
            <Item item={Array.isArray(lineFrame[1]?.items) && lineFrame[1]?.items[5]} />
            <Item item={Array.isArray(lineFrame[1]?.items) && lineFrame[1]?.items[6]} />
        </div>
    </div >
}

interface ItemProps {
    item: any
}

const Item: React.FC<ItemProps> = ({ item }) => {
    if (item) {
        return <img className='w-5 h-5 lg:w-6 lg:h-6 self-center' src={`/items/${item}.webp`} />
    }
    return <div className='w-5 h-5 lg:w-6 lg:h-6 self-center'></div>
}


export default Overview;