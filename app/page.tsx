"use client"

import { useState, ChangeEvent, useEffect } from "react";
import Card from "./components/card";
import axios from "axios";

export default function Home() {
  const [searchVal, setSearchVal] = useState("");
  const [home, setHome] = useState([]);
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Add state for current page
  const postsPerPage = 5; // Number of posts per page

  useEffect(() => {
    axios.get('https://hn.algolia.com/api/v1/search?tags=front_page')
      .then(function (response) {
        setHome(response.data.hits);
        setLoader(false);
      });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value);
  };

  const handleKeyPress = (event: { key: any }) => {
    if (event.key === "Enter") {
      const value = searchVal.trim();
      if (value) {
        axios.get(`https://hn.algolia.com/api/v1/search?query=${value}&tags=story`)
          .then(function (response) {
            setHome(response.data.hits);
          });
      }
    }
  };

  const removeCard = (objectId: string) => {
    const updatedHome = home.filter((hit: any) => hit.objectID !== objectId);
    setHome(updatedHome);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = home.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>

      <div className="flex flex-col w-full justify-center align-middle text-center px-4">
        <p className="text-7xl my-10">Hacker News Api</p>
        <div className="my-5">
          <input type="text" placeholder="Search Keywords" id="searchId" value={searchVal ?? ""}
            onChange={handleChange} onKeyDown={handleKeyPress}
            className="border border-gray-800 border-separate w-1/4 rounded-full py-2 px-5 min-w-56" />
        </div>
        <div className="flex justify-center my-5">
          {home.length > postsPerPage && (
            <ul className="flex gap-2">
              {Array.from({ length: Math.ceil(home.length / postsPerPage) }, (_, i) => (
                <li key={i} className="cursor-pointer" onClick={() => paginate(i + 1)}>
                  {i + 1}
                </li>
              ))}
            </ul>
          )}
        </div>
        {loader ? (
          <p>Loading...</p>
        ) : (
          currentPosts.length > 0 ? (
            <>
              <div className="flex flex-wrap justify-center gap-9">
                {currentPosts.map((hits: Hit) => (
                  <Card
                    key={hits.objectID}
                    title={hits.title}
                    author={hits.author}
                    upVotes={hits.points}
                    commentsCount={hits.num_comments}
                    url={hits.url}
                    removeCard={() => removeCard(hits.objectID)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p>Not Found</p>
          )
        )}
      </div>
    </>
  );
}
