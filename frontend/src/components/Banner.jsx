import React from "react";

function Banner() {
  return (
    <div className=" px-10 w-full flex flex-col space-y-6 mx-auto max-w-3xl">
      <h1 className="text-4xl font-bold">
        Welcome to <span className="text-blue-500">Educrafters</span>
      </h1>
      <p>
        Educrafters এ সবাইকে স্বাগতম। আমাদের প্লাটফর্ম এ খুব ভালোভাবে শিক্ষার্থীদের
        পরীক্ষা নেওয়ার ব্যাবস্থা রয়েছে। শিক্ষার্থীরা নিজেদের যাচাই করার উপোযুক্ত
        প্লাটফর্ম হিসেবে Educrafters ই সেরা।
      </p>

      {/* some tips for students how to login and use the app */}
      <ul className="list-disc space-y-2">
        <li>
          আমাদের প্লাটফর্ম এ লগইন করতে হলে আপনার নাম এবং মোবাইল নাম্বার দিয়ে রেজিস্ট্রেশন করতে হবে। আপনি স্বয়ংক্রিয়ভাবে লগইন হবেন।
        </li>
        <li>
          লগইন এর পরে আপনি হোম পেজে চলে যাবেন। এরপর মেনু সেকশন থেকে our service এ গেলে আপনি ২ টি লিঙ্ক পাবেন।
        </li>
        <ol className="list-decimal px-10">
          <li>Live Exam: এখানে আপনি নতুন ও পুরাতন সব এক্সাম দিতে পারবেন। প্রতি এক্সাম একবার ই দেওয়া যাবে। Exam End Time এর পরে আপনি এক্সাম দিতে পারবেন। কিন্তু সেটা live হিসেবে কাউন্ট হবে না।</li>
          <li>Leaderboard: এখানে আপনি আপনার সকল এক্সাম এর স্কোর দেখতে পারবেন।</li>
        </ol>
      </ul>
    </div>
  );
}

export default Banner;
