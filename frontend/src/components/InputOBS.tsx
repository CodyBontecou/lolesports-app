
import { ClipboardCopyIcon, EyeIcon, EyeOffIcon } from '@heroicons/react/solid'
import { displayInfo } from '../pages/Event'

interface Props {
    id: string
    hidden: boolean
    link: any
    setDisplayInfo: React.Dispatch<React.SetStateAction<displayInfo>>
    showLink: boolean
}

const InputOBS: React.FC<Props> = ({ id, hidden, link, setDisplayInfo, showLink }) => {
    if (!showLink) { return <></> }

    return (
        <div className='mx-3 px-1 flex bg-gray-800 w-fit rounded-md overflow-hidden self-center'>
            <input className="bg-gray-800 p-1 outline-0 w-32 select-all" readOnly={true} value={`lolhub.gg/lolesports/${link}`}></input>
            <button onClick={() => { navigator.clipboard.writeText(`lolhub.gg/lolesports/${link}`) }} >
                <ClipboardCopyIcon className="h-6 w-6 text-palette-teal self-center" />
            </button>
            <button onClick={() => {
                setDisplayInfo((displayInfo: any) => {
                    displayInfo[id] = !hidden
                    return { ...displayInfo }
                })
            }}>
                {hidden ?
                    <EyeIcon className="h-6 w-6 text-palette-teal self-center" /> :
                    <EyeOffIcon className="h-6 w-6 text-palette-teal self-center" />
                }
            </button>
        </div>
    )
}

export default InputOBS