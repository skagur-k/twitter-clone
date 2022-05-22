import {
    CalendarIcon,
    EmojiHappyIcon,
    LocationMarkerIcon,
    PhotographIcon,
    SearchCircleIcon,
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Tweet, TweetBody } from '../typings'
import { fetchTweets } from '../utils/fetchTweets'

type Props = {
    setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>
}

function TweetBox({ setTweets }: Props) {
    const [input, setInput] = useState<string>('')
    const [image, setImage] = useState<string>('')
    const { data: session } = useSession()
    const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const addImageToTweet = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        if (!imageInputRef.current?.value) return
        setImage(imageInputRef.current.value)
        imageInputRef.current.value = ''
        setImageUrlBoxIsOpen(false)
    }

    const postTweet = async () => {
        const tweetInfo: TweetBody = {
            text: input,
            username: session?.user?.name || 'Unknown User',
            profileImg:
                session?.user?.image ||
                'https://avatars.githubusercontent.com/u/8953479?v=4',
            image: image,
        }

        const result = await fetch(`/api/addTweet`, {
            body: JSON.stringify(tweetInfo),
            method: 'POST',
        })
        const json = await result.json()


        const newTweets = await fetchTweets()
        setTweets(newTweets)


        toast('Tweet Posted!', {
            icon: '🚀',
        })

        return json
    }

    const handleSubmit = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        postTweet()

        setInput('')
        setImage('')
        setImageUrlBoxIsOpen(false)
    }

    return (
        <div className="flex space-x-2 p-5">
            <img
                src={
                    session?.user?.image ||
                    'https://avatars.githubusercontent.com/u/8953479?v=4'
                }
                className="mt-4 h-14 w-14 rounded-full bg-gray-200"
            />

            <div className="flex flex-1 items-center pl-2">
                <form className="flex flex-1 flex-col">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder="What's Happening"
                        className="h-24 w-full text-xl outline-none placeholder:text-xl"
                    />
                    <div className="flex items-center">
                        <div className="flex flex-1 space-x-2 text-twitter">
                            <PhotographIcon
                                onClick={() =>
                                    setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)
                                }
                                className="cursor-point h-5 w-5 transition-transform duration-150 ease-out hover:scale-150"
                            />
                            <SearchCircleIcon className="cursor-point h-5 w-5 transition-transform duration-150 ease-out hover:scale-150" />
                            <EmojiHappyIcon className="cursor-point h-5 w-5 transition-transform duration-150 ease-out hover:scale-150" />
                            <CalendarIcon className="cursor-point h-5 w-5 transition-transform duration-150 ease-out hover:scale-150" />
                            <LocationMarkerIcon className="cursor-point h-5 w-5 transition-transform duration-150 ease-out hover:scale-150" />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={!input || !session}
                            className="rounded-full bg-twitter px-5 py-2 font-bold text-white disabled:opacity-40 "
                        >
                            Tweet
                        </button>
                    </div>
                    {imageUrlBoxIsOpen && (
                        <form className="mt-5 flex bg-twitter/80 py-2 px-4">
                            <input
                                ref={imageInputRef}
                                type="text"
                                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                                placeholder="Enter Image URL..."
                            />
                            <button
                                type="submit"
                                onClick={addImageToTweet}
                                className="font-bold text-white"
                            >
                                Add Image
                            </button>
                        </form>
                    )}
                    {image && (
                        <img
                            src="image"
                            alt="image"
                            className="mt-10 h-40 w-full object-contain shadow-lg"
                        />
                    )}
                </form>
            </div>
        </div>
    )
}

export default TweetBox
