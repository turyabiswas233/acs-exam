import React from "react";
import ReactPlayer from "react-player";

function Cards({ item }) {
  return (
    <div className="card w-auto max-w-sm bg-white shadow-lg rounded-lg p-1 sm:p-6 space-y-5 border border-gray-200">
      <figure className="w-full h-64 relative overflow-hidden rounded-lg mb-4">
        <ReactPlayer
          url={item.video}
          width="100%"
          height="100%"
          controls
          light={true}
          className="rounded-lg"
        />
        {item.new && (
          <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 rounded-bl-lg text-xs font-bold">
            NEW
          </div>
        )}
      </figure>

      <div className="card-body space-y-3 p-2 md:p-4">
        <h2 className="text-2xl font-semibold text-gray-900">{item.title}</h2>
        <p className="text-gray-600">{item.name}</p>
      </div>

      <div className="card-actions flex justify-between items-center mt-4 p-3">
        <div className="text-gray-800 font-semibold text-lg">
          {item.price.toLocaleString()} Taka
        </div>
        <a
          href={item.link}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 transform hover:scale-105"
        >
          BUY NOW
        </a>
      </div>
    </div>
  );
}

export default Cards;
