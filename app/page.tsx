"use client"

import { useState, ChangeEvent, useEffect } from "react"
import Card from "./components/card"
import axios from "axios"


export default function Home() {

  const [searchVal, setSearchVal] = useState("")
  const [home, setHome] = useState([])
  const [loader, setLoader] = useState(true)
  useEffect(() => {
    axios.get('http://hn.algolia.com/api/v1/search?tags=front_page').then(function (response) {
      // console.log(response.data.hits)
      setHome(response.data.hits)
      setLoader(false)
    }
    )
  }, [])
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {

    const inputValue = event.target.value;

    setSearchVal(inputValue);

  }
  const handleKeyPress = (event: { key: any }) => {
    if (event.key === "Enter") {
      const value = searchVal.trim();
      if (value) {
        axios.get(`http://hn.algolia.com/api/v1/search?query=${value}&tags=story`).then(function (response) {
          setHome(response.data.hits);
        });
      }
    }
  };
  interface Hit {
    objectID: string;
    title: string;
    author: string;
    points: number;
    num_comments: number;
    url: string;
  }
  return (
    <>
      <div className="flex flex-col w-full justify-center align-middle text-center">
        <p className="text-7xl my-10">Hacker News Api</p>
        <div className="my-5">
          <input type="text" placeholder="Search Keywords" id="searchId" value={searchVal ?? ""}
            onChange={handleChange} onKeyDown={handleKeyPress}
            className="border border-gray-800 border-separate w-1/4 rounded-full py-2 px-5" />
        </div>
        {loader ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-9">
            {home.map((hits: Hit) => (
              <Card
                key={hits.objectID}
                title={hits.title}
                author={hits.author}
                upVotes={hits.points}
                commentsCount={hits.num_comments}
                url={hits.url}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}