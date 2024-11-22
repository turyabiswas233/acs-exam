import React from "react";

function Banner() {
  return (
    <div className=" px-10 w-full flex flex-col space-y-6 mx-auto max-w-3xl">
      <h1 className="text-4xl font-bold">
        Welcome to <span className="text-blue-500">Educrafters</span>
      </h1>
      <p>
        Educrafters এ সবাইকে স্বাগতম। আমাদের প্লাটফর্ম এ খুব ভালোভাবে
        শিক্ষার্থীদের পরীক্ষা নেওয়ার ব্যাবস্থা রয়েছে। শিক্ষার্থীরা নিজেদের যাচাই
        করার উপোযুক্ত প্লাটফর্ম হিসেবে Educrafters ই সেরা।
      </p>
    </div>
  );
}

export default Banner;
