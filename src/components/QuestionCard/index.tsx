import type Pytanie from "models/Pytanie"
import Image from "next/image"

const QuestionCard = ({pytanie}: {pytanie: Pytanie}) => {
    return (
        <div className="text-white w-full bg-black border-white border-[1px] rounded-md p-3 mb-6 hover:shadow-gray-300 hover:shadow-inner transition duration-150">
            <h2 className="text-center text-xl font-bold mb-5">{pytanie.tresc}</h2>
            <p className={`text-xl text-gray-300 ${pytanie.zdjecie ? 'mb-5' : ''}`}>Odpowiedź: <span className="text-lime-500">{pytanie.odpowiedz}</span></p>
            {!!pytanie.zdjecie && (
                <div className="w-full max-h-[20vh] md:max-h-[30vh] lg:max-h-[35vh] overflow-hidden rounded-md aspect-auto">
                <Image alt="obrazek do pytania" src={pytanie.zdjecie} width={1000} height={500} loader={() => pytanie.zdjecie || ""} />
                </div>
            )
            }
        </div>
    )
}
export default QuestionCard