import { useState } from "react";

interface CardProps {
    title: string;
    author: string;
    upVotes: number;
    commentsCount: number;
    url: string;
    removeCard: () => void;
}


export default function Card({ title, author, upVotes, commentsCount, url, removeCard }: CardProps) {
    const [removed, setRemoved] = useState(false)
    const handleRemove = () => {
        setRemoved(true);
        removeCard();
    };
    return (
        <>
            {!removed &&
                <div className="border border-black text-left w-96 flex flex-col justify-center p-4 rounded-xl">
                    <div className="flex-col mb-2">
                        <div className="font-bold text-2xl min-h-20">{title}</div>
                        <div className="font-semibold text-gray-600 mt-1">✍️: {author}</div>
                    </div>
                    <div className="flex justify-between mb-3">
                        <div>💬: {commentsCount}</div>
                        <div>🔼: {upVotes}</div>
                    </div>
                    <div className="flex justify-between">
                        <a href={url} target='_blank' className="underline text-blue-500">Read More</a>
                        <button onClick={handleRemove} className="text-red-400">Remove</button>
                    </div>
                </div>
            }
        </>
    )
}