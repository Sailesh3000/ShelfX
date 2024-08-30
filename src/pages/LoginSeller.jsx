import React from 'react';
import Login from "../components/Login";
import { MdOutlinePayment } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { GiWorld } from "react-icons/gi";

const LoginSeller = () => {
  return (
    <section className="flex flex-col lg:flex-row max-h-screen gap-4">
      <section className="flex items-center justify-center w-full md:w-full lg:w-1/2 bg-[#FFD369] min-h-screen">
        <div className="max-w-md">
          <div className="mb-6">
            <h2 className="text-5xl font-bold text-[#222831]">Why Sell with Us?</h2>
            <p className="text-[#222831] text-xl mt-2">Join a growing community of sellers who are thriving on our platform.</p>
          </div>
          <ul className="space-y-4">
            <li className="flex items-center">
              <MdOutlinePayment className="w-6 h-6 mr-4 text-[#222831]" />
              <span className="text-[#222831] text-xl">Low Transaction Fees</span>
            </li>
            <li className="flex items-center">
              <BiSupport className="w-6 h-6 mr-4 text-[#222831]" />
              <span className="text-[#222831] text-xl">24/7 Customer Support</span>
            </li>
            <li className="flex items-center">
              <GiWorld className="w-6 h-6 mr-4 text-[#222831]" />
              <span className="text-[#222831] text-xl">Global Reach</span>
            </li>
          </ul>
        </div>
      </section>

      <div className="flex items-center justify-center w-full lg:w-1/2 px-8">
        <Login />
      </div>
    </section>
  );
};

export default LoginSeller;
